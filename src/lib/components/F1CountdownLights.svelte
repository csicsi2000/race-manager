<script lang="ts">
  import Light from "$lib/_types/light";
  import { LightColors } from "$lib/_types/enums/lightColors";
  import LightStrip from "$lib/components/animations/LightStrip.svelte";
  import { Button, Modal, Badge } from "flowbite-svelte";
  import { LightStates } from "$lib/_types/enums/lightStates";
  import { base } from "$app/paths";
  import { sessionStatus, newRaceInfo } from "$lib/stores/raceInfos";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { formatMs } from "$lib/utils/converters/timeConverter";
  import { cancelRace } from "$lib/utils/raceInfoSession";
  import { sensorReadings, sensorSetting } from "$lib/stores/serverStatus";
  import { get } from "svelte/store";

  const LIGHT_ON_INTERVAL = 1000;

  let state = LightStates.IDLE;
  let nextLightStrip = 0;
  let result = "00.000";
  let startTime: number = -1;
  let timerId: number | undefined;
  let fuzzerId: number | undefined;
  let best = localStorage.best || 0;

  let lights: Light[][] = [];

  let audioStartLights = new Audio(base + "/sounds/F1-Start-light-sound.mp3");
  let audioLightsOut = new Audio(base + "/sounds/lights-out.mp3");

  let raceStatus: RaceStatus;
  let modalState = false;

  // --- Car position & false start tracking ---
  let laneBlocked: boolean[] = [];
  let falseStarts: boolean[] = [];
  let allReady = false;
  let countdownActive = false;
  let hasFalseStart = false;

  // --- Reaction time tracking ---
  let lightsOutTime: number = -1;
  let reactionTimes: (number | null)[] = [];  // null = not yet reacted
  let trackingReaction = false;

  // Subscribe to sensor readings for live position + reaction tracking
  let prevBlocked: boolean[] = [];

  sensorReadings.subscribe((reading) => {
    if (!reading || reading.millis < 0) return;
    const settings = get(sensorSetting);
    const lanes = settings.laneCount || 2;

    const newBlocked = Array(lanes).fill(false).map((_, i) =>
      i < reading.slot_status.length ? reading.slot_status[i] : false
    );

    // False start detection: car was on sensor and left during countdown
    if (countdownActive && prevBlocked.length > 0) {
      for (let i = 0; i < lanes; i++) {
        if (prevBlocked[i] && !newBlocked[i] && !falseStarts[i]) {
          falseStarts = [...falseStarts];
          falseStarts[i] = true;
          hasFalseStart = true;

          // Record jump start on the racer
          const racers = get(newRaceInfo).racers;
          if (racers[i]) {
            racers[i].jumpStart += 1;
          }

          // ABORT the countdown!
          abortCountdown();
        }
      }
    }

    // Reaction time: after lights out, detect when each car LEAVES the sensor
    if (trackingReaction && prevBlocked.length > 0) {
      for (let i = 0; i < lanes; i++) {
        if (prevBlocked[i] && !newBlocked[i] && reactionTimes[i] === null) {
          reactionTimes[i] = Date.now() - lightsOutTime;
          reactionTimes = [...reactionTimes]; // trigger reactivity
        }
      }
      // Stop tracking once all have reacted
      if (reactionTimes.every(t => t !== null)) {
        trackingReaction = false;
      }
    }

    prevBlocked = [...newBlocked];
    laneBlocked = newBlocked;
    allReady = laneBlocked.length > 0 && laneBlocked.every(b => b);
  });

  sessionStatus.subscribe(x => {
    raceStatus = x;
    if (raceStatus == RaceStatus.FORMATION) {
      modalState = true;
      formationLights();
      const lanes = get(sensorSetting).laneCount || 2;
      falseStarts = Array(lanes).fill(false);
      reactionTimes = Array(lanes).fill(null);
      hasFalseStart = false;
      countdownActive = false;
      trackingReaction = false;
      lightsOutTime = -1;
      prevBlocked = [];
    }
  });

  for (let i = 0; i < 5; i++) {
    lights.push([]);
    for (let j = 0; j < 4; j++) {
      lights[i].push(new Light(j));
    }
  }

  function cancelRaceLights() {
    clearLights();
    countdownActive = false;
    trackingReaction = false;
    modalState = false;
    cancelRace();
  }

  /** Called when a false start is detected during countdown */
  function abortCountdown() {
    clearLights();
    countdownActive = false;
    state = LightStates.FORMATION; // go back so Reset button shows
    audioStartLights.pause();
    audioStartLights.currentTime = 0;
    result = "FALSE START";
  }

  /** Reset after false start — go back to formation */
  function resetAfterFalseStart() {
    const lanes = get(sensorSetting).laneCount || 2;
    falseStarts = Array(lanes).fill(false);
    hasFalseStart = false;
    countdownActive = false;
    prevBlocked = [];
    formationLights();
    result = "00.000";
    sessionStatus.set(RaceStatus.FORMATION);
  }

  //#region Start race

  export function clickStartRace() {
    if (state === LightStates.FORMATION && !hasFalseStart) {
      clearLights();
      state = LightStates.RUNNING;
      countdownActive = true;
      setTimeout(() => start(), 1000);

      console.log("Countdown started");
      sessionStatus.set(RaceStatus.RACE);
    }
  }

  function pauseCountDown() {
    if (state === LightStates.RUNNING) {
      state = LightStates.IDLE;
      countdownActive = false;
      sessionStatus.set(RaceStatus.FORMATION);
      result = "Reset";
      audioStartLights.pause();
      clearInterval(timerId);
      clearTimeout(fuzzerId);
      console.log("Countdown paused");
    }
  }

  function start() {
    // Don't start if a false start already happened
    if (hasFalseStart) return;
    nextLightStrip = 0;
    result = "00.000";
    startTime = -1;
    clearLights();
    audioStartLights.play();
    turnOnNextLight();
    timerId = setInterval(() => turnOnNextLight(), LIGHT_ON_INTERVAL);
  }

  function turnOnNextLight() {
    // Abort if false start happened during the light sequence
    if (hasFalseStart) {
      clearInterval(timerId);
      return;
    }
    if (nextLightStrip === 5) {
      fuzzedLightsOut();
      clearInterval(timerId);
    } else {
      lights[nextLightStrip][2].color = LightColors.red;
      lights[nextLightStrip][3].color = LightColors.red;
      nextLightStrip += 1;
    }
  }

  function fuzzedLightsOut() {
    const fuzzyInterval = Math.random() * 2800 + 200;
    fuzzerId = setTimeout(() => {
      if (hasFalseStart) return;
      clearLights();
      lightsOutTime = Date.now();
      startTime = lightsOutTime;
      state = LightStates.WAITING;
      countdownActive = false;

      // Start tracking reaction times
      const lanes = get(sensorSetting).laneCount || 2;
      reactionTimes = Array(lanes).fill(null);
      trackingReaction = true;

      audioLightsOut.play();
      // Keep modal open longer to show reaction times
      setTimeout(() => {
        if (!hasFalseStart) {
          modalState = false;
        }
      }, 5000);
    }, fuzzyInterval);
  }

  //#endregion

  //#region Formation lap
  export function formationLights() {
    clearLights();
    lights.forEach((col) => {
      col[1].color = LightColors.green;
    });
    state = LightStates.FORMATION;
  }
  //#endregion

  function clearLights() {
    clearInterval(timerId);
    clearTimeout(fuzzerId);
    audioStartLights.pause();
    audioStartLights.currentTime = 0;
    audioLightsOut.pause();
    audioLightsOut.currentTime = 0;
    lights.forEach((col) => {
      col.forEach((light) => {
        light.color = LightColors.off;
      });
    });
  }

  function getRacerName(index: number): string {
    const racers = get(newRaceInfo).racers;
    return racers[index]?.name ?? `Lane ${index + 1}`;
  }
</script>

<Modal title="{RaceStatus[raceStatus]}" bind:open={modalState} dismissable={false}>
  <div id="light-parent">
    <!-- Car Position Status -->
    {#if state === LightStates.FORMATION || countdownActive}
      <div class="w-full mb-4">
        <p class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Car Positions</p>
        <div class="flex justify-center gap-4">
          {#each laneBlocked as blocked, i}
            <div class="flex flex-col items-center gap-1">
              <span class="text-sm font-medium dark:text-white">{getRacerName(i)}</span>
              {#if falseStarts[i]}
                <Badge color="red" rounded large class="animate-pulse">⚠ FALSE START</Badge>
              {:else if blocked}
                <Badge color="green" rounded large>✓ Ready</Badge>
              {:else}
                <Badge color="yellow" rounded large>✗ Not on sensor</Badge>
              {/if}
            </div>
          {/each}
        </div>
        {#if allReady && !hasFalseStart}
          <p class="text-center text-green-600 dark:text-green-400 font-bold mt-2 text-sm">All cars in position!</p>
        {/if}
      </div>
    {/if}

    <!-- Reaction Times (after lights out) -->
    {#if state === LightStates.WAITING && lightsOutTime > 0}
      <div class="w-full mb-4">
        <p class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Reaction Times</p>
        <div class="flex justify-center gap-6">
          {#each reactionTimes as rt, i}
            <div class="flex flex-col items-center gap-1">
              <span class="text-sm font-medium dark:text-white">{getRacerName(i)}</span>
              {#if rt !== null}
                <Badge color={rt < 300 ? "green" : rt < 600 ? "yellow" : "red"} rounded large class="text-lg font-bold tabular-nums">
                  {formatMs(rt)}
                </Badge>
              {:else}
                <Badge color="dark" rounded large class="animate-pulse">Waiting...</Badge>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div id="lights-container">
      <div id="connector"></div>
      {#key state}
        {#each lights as lightCol}
          <LightStrip bind:lightCol />
        {/each}
      {/key}
    </div>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      <h1 class="time">{result !== null ? result : ""}</h1>
      <h1 class="time">{result !== null ? result : ""}</h1>
    </div>
    <div>Your best: {formatMs(best)}</div>

    <!-- False start warning -->
    {#if hasFalseStart}
      <div class="w-full my-3 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-center">
        <p class="text-red-700 dark:text-red-300 font-bold text-lg">⚠ False Start!</p>
        <p class="text-red-600 dark:text-red-400 text-sm mt-1">
          {#each falseStarts as fs, i}
            {#if fs}
              <span class="font-semibold">{getRacerName(i)}</span>{" "}
            {/if}
          {/each}
          moved before lights out.
        </p>
      </div>
    {/if}

    <div class="grid gap-6 mb-6 md:grid-cols-2">
      {#if hasFalseStart}
        <!-- False start: show Reset button -->
        <Button color="yellow" pill on:click={resetAfterFalseStart}>Reset (place cars again)</Button>
      {:else if raceStatus == RaceStatus.FORMATION}
        <Button color="green" pill on:click={clickStartRace} disabled={!allReady}>
          {#if allReady}Start Countdown{:else}Waiting for cars...{/if}
        </Button>
      {:else if state == LightStates.RUNNING}
        <Button color="yellow" pill on:click={pauseCountDown}>Reset</Button>
      {:else}
        <Button color="yellow" pill on:click={pauseCountDown} disabled>Disabled</Button>
      {/if}
      <Button color="alternative" pill on:click={cancelRaceLights}>Cancel race</Button>
    </div>
  </div>
</Modal>

<style>
  #light-parent {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }

  #lights-container {
    position: relative;
    display: flex;
    flex-direction: row;
  }

  #connector {
    position: absolute;
    background: black;
    height: 3%;
    top: 50%;
    width: 80%;
    left: 10%;
    z-index: -1;
  }

  @media only screen and (max-width: 600px) {
    .time {
      font-size: 3.5rem;
      font-weight: 300;
      line-height: 1.2;
    }
  }

  @media only screen and (min-width: 600px) {
    .time {
      font-size: 5.5rem;
      font-weight: 300;
      line-height: 1.2;
    }
  }
</style>

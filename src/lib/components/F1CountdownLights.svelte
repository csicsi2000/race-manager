<script lang="ts">
  import Light from "$lib/_types/light";
  import { LightColors } from "$lib/_types/enums/lightColors";
  import LightStrip from "$lib/components/animations/LightStrip.svelte";
  import { Button, Modal } from "flowbite-svelte";
  import { LightStates } from "$lib/_types/enums/lightStates";
  import { base } from "$app/paths";
  import { currentRaceInfo, sessionStatus, newRaceInfo } from "$lib/stores/raceInfos";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { formatMs } from "$lib/utils/converters";

  const LIGHT_ON_INTERVAL = 1000;

  let state = LightStates.IDLE;
  let nextLightStrip = 0;
  let result = "00.000";
  let startTime: number;
  let timerId: number | undefined;
  let fuzzerId: number | undefined;
  let best = localStorage.best || 0;

  let lights: Light[][] = [];

  let audioStartLights = new Audio(base + "/sounds/F1-Start-light-sound.mp3");
  let audioLightsOut = new Audio(base + "/sounds/lights-out.mp3");

  let raceStatus: RaceStatus;

  let modalState = false;

sessionStatus.subscribe(x => {
  raceStatus = x;
  if(raceStatus == RaceStatus.FORMATION){
    modalState = true;
    formationLights();
  }
})

  for (let i = 0; i < 5; i++) {
    lights.push([]);
    for (let j = 0; j < 4; j++) {
      lights[i].push(new Light(j));
    }
  }

  function cancelRace(){
    clearLights();
    sessionStatus.set(RaceStatus.PRACTICE);
    modalState =false;
  }

  //#region Start race

  export function clickStartRace() {
  if (state === LightStates.FORMATION) {
    clearLights();
    state = LightStates.RUNNING;
    setTimeout(() => start(),1000)
    
    console.log("Countdown started")
    sessionStatus.set(RaceStatus.RACE);

    }
  }

  function getStartTimeDiff(){
    state = LightStates.IDLE;
      const timeDiff = Date.now() - startTime;
      result = formatMs(timeDiff);
      best = best === 0 ? timeDiff : Math.min(best, timeDiff);
      localStorage.best = best;

      return result;
  }

  function pauseCountDown(){
    if (state === LightStates.RUNNING) {
      state = LightStates.IDLE;
      sessionStatus.set(RaceStatus.FORMATION)
      result = "Reset";
      audioStartLights.pause();
      clearInterval(timerId);
      clearTimeout(fuzzerId);
      console.log("Countdown paused")
    }
  }

  function start() {
    nextLightStrip = 0;
    result = "00.000";
    startTime = -1;
    clearLights();
    audioStartLights.play();
    turnOnNextLight();
    timerId = setInterval(() => turnOnNextLight(), LIGHT_ON_INTERVAL);
  }

  function turnOnNextLight() {
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
    // delay for the lights
    const fuzzyInterval = Math.random() * 2800 + 200;
    fuzzerId = setTimeout(() => {
      clearLights();
      startTime = Date.now();
      state = LightStates.WAITING;
      audioLightsOut.play();
      setTimeout(() => modalState = false, 3000);
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

    let prepareRace = $newRaceInfo;
    prepareRace.raceStatus = RaceStatus.RACE;
    currentRaceInfo.set(prepareRace);
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


</script>

<Modal title="{RaceStatus[raceStatus]}" bind:open={modalState} dismissable={false}>
<div id="light-parent">
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
  <div class="grid gap-6 mb-6 md:grid-cols-2">
{#if raceStatus == RaceStatus.FORMATION}
  <Button color="green" pill on:click={clickStartRace}>Start Race</Button>
  {:else if state == LightStates.RUNNING}
  <Button color="yellow" pill on:click={pauseCountDown} >Reset</Button>
  {:else}
  <Button color="yellow" pill on:click={pauseCountDown} disabled>Disabled</Button>

{/if}
  <Button color="alternative" pill on:click={cancelRace}>Cancel race</Button>
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

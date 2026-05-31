<script lang="ts">
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { connectedSensorIP, sensorSetting } from "$lib/stores/serverStatus";
  import {
    Input,
    Label,
    Heading,
    Button,
    Popover,
    Toggle,
  } from "flowbite-svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import RacerSetting from "$lib/components/settings/RacerSettings.svelte";
  import QrCode from "../dataDisplay/QrCode.svelte";
  import { saveSensorIp } from "$lib/utils/localSettings";
  import { QuestionCircleSolid } from "flowbite-svelte-icons";

  function storeRaceConfig() {
    let database = new LocalStorageDatabase();
    database.storeRaceConfig($newRaceInfo);
  }

  let tempIp = $connectedSensorIP;

  function saveIp() {
    console.warn("New ip set: " + tempIp);
    connectedSensorIP.set(tempIp);
    saveSensorIp(tempIp);
  }
</script>

<div class="grid gap-4">
  <div class="grid md:grid-cols-2 gap-8">
    <section class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading tag="h3" class="text-xl">Sensor connection</Heading>
      <Label for="connected_ip">Sensor WebSocket address</Label>
      <div class="flex items-center font-light text-gray-500 dark:text-gray-400">
        <Input
          type="text"
          id="connected_ip "
          placeholder="ws://127.0.0.1"
          bind:value={tempIp}
        />
        <button id="b3">
          <QuestionCircleSolid class="w-4 h-4 ms-1.5" />
          <span class="sr-only">Show information</span>
        </button>
      </div>
      <Button id="ConnectBtn" color="blue" on:click={saveIp}>Connect</Button>
      <Popover
        class="w-64 text-sm font-light "
        title="Hint"
        triggeredBy="#b3">Use ws://192.168.x.x or paste only the IP address. Port 80 is used by the ESP WebSocket server.</Popover
      >
    </section>
    <section class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading tag="h3" class="text-xl">Lap validation</Heading>
      <div>
        <Label for="threshold" class="mb-2">Analog threshold</Label>
        <Input id="threshold" type="number" min="0" max="4095" bind:value={$sensorSetting.threshold} />
      </div>
      <div>
        <Label for="min_lap" class="mb-2">Minimum lap time (ms)</Label>
        <Input id="min_lap" type="number" min="250" step="250" bind:value={$sensorSetting.minLapMillis} />
      </div>
      <div>
        <Label for="lane_count" class="mb-2">Lane count</Label>
        <Input id="lane_count" type="number" min="1" max="4" bind:value={$sensorSetting.laneCount} />
      </div>
      <Toggle bind:checked={$sensorSetting.voiceCues}>Voice lap cues</Toggle>
    </section>
    <section class="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading tag="h3" class="text-xl">Open on another device</Heading>
      <QrCode
        displayedText={"https://csicsi2000.github.io/race-manager?server=" +
          $connectedSensorIP}
      />
      <Label
        >{"https://csicsi2000.github.io/race-manager?server=" +
          $connectedSensorIP}</Label
      >
    </section>
    {#each $newRaceInfo.racers as racer}
      <RacerSetting bind:racer />
    {/each}
  </div>
  <Button color="blue" on:click={storeRaceConfig}>Save configuration</Button>
</div>

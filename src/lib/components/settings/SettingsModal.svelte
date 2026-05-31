<script lang="ts">
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { connectedSensorIP, sensorSetting, settingsModalOpen, isSimulated } from "$lib/stores/serverStatus";
  import {
    Modal,
    Input,
    Label,
    Heading,
    Button,
    Toggle,
  } from "flowbite-svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import RacerSetting from "$lib/components/settings/RacerSettings.svelte";
  import QrCode from "../dataDisplay/QrCode.svelte";
  import { saveSensorIp } from "$lib/utils/localSettings";
  import type { SensorSettings } from "$lib/_types/sensorSettings";
  import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";

  // --- Snapshot for cancel/revert ---
  let savedSensorSettings: SensorSettings | null = null;
  let savedRaceInfo: IRaceInfo | null = null;
  let savedSimulated: boolean = false;

  // Take a snapshot every time the modal opens
  settingsModalOpen.subscribe((open) => {
    if (open) {
      savedSensorSettings = structuredClone($sensorSetting);
      savedRaceInfo = structuredClone($newRaceInfo);
      savedSimulated = $isSimulated;
    }
  });

  function storeRaceConfig() {
    let database = new LocalStorageDatabase();
    database.storeRaceConfig($newRaceInfo);
    $settingsModalOpen = false;
  }

  function closeWithoutSaving() {
    // Revert all stores to the snapshot
    if (savedSensorSettings) {
      sensorSetting.set(savedSensorSettings);
    }
    if (savedRaceInfo) {
      newRaceInfo.set(savedRaceInfo);
    }
    isSimulated.set(savedSimulated);
    $settingsModalOpen = false;
  }

  let tempIp = $connectedSensorIP;

  function saveIp() {
    console.warn("New ip set: " + tempIp);
    connectedSensorIP.set(tempIp);
    saveSensorIp(tempIp);
  }
</script>

<Modal bind:open={$settingsModalOpen} size="xl" autoclose={false} dismissable={false} class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-2xl">
  <div class="flex items-start justify-between">
    <Heading tag="h2" class="text-3xl font-extrabold tracking-tight dark:text-white">Settings</Heading>
  </div>
  
  <div class="grid gap-6">
    <section class="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-gray-50 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <Heading tag="h3" class="text-xl font-bold">Sensor connection</Heading>
      <Label for="connected_ip" class="text-gray-700 dark:text-gray-300">Sensor WebSocket address (Optional)</Label>
      <div class="flex items-center gap-3 font-light text-gray-500 dark:text-gray-400">
        <Input
          type="text"
          id="connected_ip"
          class="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          placeholder="Leave empty for auto-connect"
          bind:value={tempIp}
        />
        <Button id="ConnectBtn" color="blue" class="shadow-md hover:scale-105 transition-all bg-gradient-to-br from-blue-500 to-blue-600" on:click={saveIp}>Apply</Button>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400">Usually handled automatically. Only enter IP if using a custom setup.</p>
      
      <div class="mt-4 pt-4 border-t border-gray-300/50 dark:border-white/10">
        <Toggle bind:checked={$isSimulated} class="text-gray-800 dark:text-white font-medium">Simulate Sensor Data</Toggle>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Enables the Dev Panel for manual sensor testing without an ESP board.</p>
      </div>
    </section>

    <section class="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-gray-50 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <Heading tag="h3" class="text-xl font-bold">Lap validation</Heading>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="threshold" class="mb-2 text-gray-700 dark:text-gray-300">Analog threshold</Label>
          <Input id="threshold" type="number" class="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" min="0" max="4095" bind:value={$sensorSetting.threshold} />
        </div>
        <div>
          <Label for="min_lap" class="mb-2 text-gray-700 dark:text-gray-300">Min lap time (ms)</Label>
          <Input id="min_lap" type="number" class="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" min="250" step="250" bind:value={$sensorSetting.minLapMillis} />
        </div>
        <div>
          <Label for="lane_count" class="mb-2 text-gray-700 dark:text-gray-300">Lane count</Label>
          <Input id="lane_count" type="number" class="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" min="1" max="4" bind:value={$sensorSetting.laneCount} />
        </div>
      </div>
      <Toggle bind:checked={$sensorSetting.voiceCues} class="mt-2 text-gray-800 dark:text-white font-medium">Voice lap cues</Toggle>
    </section>

    <section class="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-gray-50 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <Heading tag="h3" class="text-xl font-bold">Racer Setup</Heading>
      <div class="grid md:grid-cols-2 gap-4">
        {#each $newRaceInfo.racers as racer}
          <RacerSetting bind:racer />
        {/each}
      </div>
    </section>
  </div>

  <svelte:fragment slot="footer">
    <div class="flex justify-end gap-3 w-full">
      <Button color="alternative" class="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" on:click={closeWithoutSaving}>Cancel</Button>
      <Button color="blue" class="shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-r from-blue-500 to-blue-700 font-bold" on:click={storeRaceConfig}>Save and Close</Button>
    </div>
  </svelte:fragment>
</Modal>

<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { connectedSensorIP } from "$lib/stores/serverStatus";
  import {
    Input,
    Label,
    Card,
    Heading,
    Select,
    Button,
    Popover,
  } from "flowbite-svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import RacerSetting from "$lib/components/settings/RacerSettings.svelte";
  import QrCode from "../dataDisplay/QrCode.svelte";
  import { saveSensorIp } from "$lib/utils/localSettings";
  import { base } from "$app/paths";
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
    <div class="flex flex-col gap-4">
      <Label for="connected_ip">Sensor IP</Label>
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
        triggeredBy="#b3">The IP address must start with "ws://"</Popover
      >
    </div>
    <div class="flex flex-col">
      <QrCode
        displayedText={"https://csicsi2000.github.io/race-manager?server=" +
          $connectedSensorIP}
      />
      <Label
        >{"https://csicsi2000.github.io/race-manager?server=" +
          $connectedSensorIP}</Label
      >
    </div>
    {#each $newRaceInfo.racers as racer}
      <RacerSetting bind:racer />
    {/each}
  </div>
  <Button color="blue" on:click={storeRaceConfig}>Save configuration</Button>
</div>

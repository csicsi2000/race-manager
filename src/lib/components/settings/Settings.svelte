<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { connectedSensorIP } from "$lib/stores/serverStatus";
  import { Input, Label, Card, Heading, Select, Button } from "flowbite-svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import RacerSetting from "$lib/components/settings/RacerSettings.svelte";
  import QrCode from "../dataDisplay/QrCode.svelte";
  import { saveSensorIp } from "$lib/utils/localSettings";
  import { base } from "$app/paths";

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
      <Input
        type="text"
        id="connected_ip "
        placeholder="127.0.0.1"
        bind:value={tempIp}
      />
      <Button color="blue" on:click={saveIp}>Connect</Button>
    </div>
    <div class="flex flex-col">
    <QrCode
      displayedText={"https://csicsi2000.github.io/race-manager?server=" +$connectedSensorIP}
    />
    <Label>{"https://csicsi2000.github.io/race-manager?server=" +$connectedSensorIP}</Label>
  </div>
    {#each $newRaceInfo.racers as racer}
      <RacerSetting bind:racer />
    {/each}
  </div>
  <Button color="blue" on:click={storeRaceConfig}>Save configuration</Button>
</div>

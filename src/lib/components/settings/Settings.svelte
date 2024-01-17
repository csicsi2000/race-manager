<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { connectedSensorIP } from "$lib/stores/serverStatus";
  import { Input, Label, Card, Heading, Select, Button } from "flowbite-svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import RacerSetting from "$lib/components/settings/RacerSettings.svelte"
  import QrCode from "../dataDisplay/QrCode.svelte";
  import { saveSensorIp } from "$lib/utils/localSettings";

  
  function storeRaceConfig() {
    let database = new LocalStorageDatabase();
    database.storeRaceConfig($newRaceInfo);
  }

  let tempIp = $connectedSensorIP;

  function saveIp(){
    console.warn("New ip set: " + tempIp)
    connectedSensorIP.set(tempIp);
    saveSensorIp(tempIp);
  }
</script>

<form>
  <div class="grid md:grid-cols-2 gap-8">
  <div class="grid mb-6 gap-4">
      <Label for="connected_ip" class="mb-2">Sensor IP</Label>
      <Input
        type="text"
        id="connected_ip "
        placeholder="127.0.0.1"
        bind:value={tempIp}
      />
      <Button color="blue" on:click={saveIp}>Connect</Button>
  </div>
  <QrCode displayedText={"https://csicsi2000.github.io/svelte-slot-car-race-management?server="+ $connectedSensorIP}/>

    {#each $newRaceInfo.racers as racer}
    <RacerSetting bind:racer={racer}/>
    {/each}
  </div>
</form>

<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { connectedIP } from "$lib/stores/serverStatus";
  import { Input, Label, Card, Heading, Select, Button } from "flowbite-svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import RacerSetting from "$lib/components/settings/RacerSettings.svelte"

  
  function storeRaceConfig() {
    let database = new LocalStorageDatabase();
    database.storeRaceConfig($newRaceInfo);
  }

  let tempIp = $connectedIP;

  function saveIp(){
    console.warn("New ip set: " + tempIp)
    connectedIP.set(tempIp);
  }
</script>

<form>
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
  <div class="grid md:grid-cols-2 gap-8">
    {#each $newRaceInfo.racers as racer}
    <RacerSetting bind:racer={racer}/>
    {/each}
  </div>
</form>

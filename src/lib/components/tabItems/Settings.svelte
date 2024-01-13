<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { connection, connectedIP } from "$lib/stores/sensorStatus";
  import { Input, Label, Card, Heading, Select, Button } from "flowbite-svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import RacerSetting from "$lib/components/settings/RacerSettings.svelte"

  
  function storeRaceConfig() {
    let database = new LocalStorageDatabase();
    database.storeRaceConfig($newRaceInfo);
  }

</script>

<form>
  <div class="grid mb-6">
    <div>
      <Label for="connected_ip" class="mb-2">Sensor IP</Label>
      <Input
        type="text"
        id="connected_ip "
        placeholder="127.0.0.1"
        bind:value={$connectedIP}
      />
    </div>
  </div>
  <div class="grid mb-6 md:grid-cols-2 gap-2">
    {#each $newRaceInfo.racers as racer}
    <RacerSetting bind:racer={racer}/>
    {/each}
  </div>
  <div class="grid gap-4 grid-col-1">
    <Heading tag="h3" class="mb-4">New Race</Heading>
    <div>
      <Label for="race_name" class="mb-2">Race Name</Label>
      <Input
        type="text"
        id="race_name"
        placeholder="name"
        bind:value={$newRaceInfo.raceName}
      />
    </div>
    <div>
      <Label for="race_lap_count" class="mb-2">Race Lap Count</Label>
      <Input
        type="number"
        id="race_lap_count"
        placeholder="10"
        bind:value={$newRaceInfo.lapCount}
      />
    </div>
    <Button color="blue" on:click={storeRaceConfig}>Save configuration</Button>
  </div>
</form>

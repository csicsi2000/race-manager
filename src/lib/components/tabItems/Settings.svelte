<script lang="ts">
  import { RaceStatus } from '$lib/_types/enums/raceStatus';
  import { raceInfo, newRaceInfo } from '$lib/stores/raceInfos';
  import { connection, connectedIP } from '$lib/stores/sensorStatus';
    import { Input, Label,Card, Heading,Select } from 'flowbite-svelte';

    let raceStates: any[] = [];

    for(let state in RaceStatus){
      if (!isNaN(Number(state))) {
        continue;
      }
      raceStates.push({
        name: state
      })
    }
  </script>
  
  <form>
    <div class="grid mb-6">
      <div>
        <Label for="connected_ip" class="mb-2">Sensor IP</Label>
        <Input type="text" id="connected_ip " placeholder="127.0.0.1" bind:value={$connectedIP}/>
      </div>
    </div>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      {#each $raceInfo.racers as racer}
      <Card class="grid gap-6 mb-6">
        <Heading tag="h2" class="mb-4">{racer.name}</Heading>
        <div>
          <Label for="slot_1_name" class="mb-2">Name</Label>
          <Input type="text" id="slot_1_name" placeholder="Slot 1" bind:value={racer.name} />
        </div>
        <div>
          <Label for="slot_1_color" class="mb-2">Color</Label>
          <input type="color" id="favcolor" name="slot_1_color" bind:value={racer.color} >
        </div>
      </Card>
      {/each}
    </div>
    <div class="grid gap-6 grid-col-1">
        <Heading tag="h2" class="mb-4">New Race</Heading>
        <div>
          <Label for="race_name" class="mb-2">Race Name</Label>
          <Input type="text" id="race_name" placeholder="name" bind:value={$newRaceInfo.raceName}/>
        </div>
        <div>
          <Label for="race_lap_count" class="mb-2">Race Lap Count</Label>
          <Input type="number" id="race_lap_count" placeholder="10" bind:value={$newRaceInfo.lapCount}/>
        </div>
    </div>
</form>
<script lang="ts">
  import { newRaceInfo } from "$lib/stores/raceInfos";
  import { Heading, Label, Input,Button } from "flowbite-svelte";

</script>
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
  </div>
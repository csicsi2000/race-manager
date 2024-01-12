<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import type Racer from "$lib/_types/racer";
  import { raceInfo, sessionStatus } from "$lib/stores/currentRaceInfo";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
    TableSearch,
    Heading,
    Button,
  } from "flowbite-svelte";
  import RacerData from "$lib/components/dataDisplay/RacerData.svelte";

  let racers: Racer[] = [];
  raceInfo.subscribe((x) => {
    racers = x.racers;
  });


  function startFormation() {
    sessionStatus.set(RaceStatus.FORMATION);
  }
</script>

<div class="grid gap-6 mb-6">
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    {#each racers as racer,index(index)}
      <RacerData bind:racer={racer} manualScrollOnly={false}/>
    {/each}
  </div>
  <Button>New Practice Session</Button>
  <Button on:click={startFormation}>Start Race</Button>
</div>

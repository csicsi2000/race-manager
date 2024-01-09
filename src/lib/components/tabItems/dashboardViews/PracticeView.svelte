<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import type Racer from "$lib/_types/racer";
  import { raceInfo, sessionStatus } from "$lib/stores/raceInfo";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
    TableSearch,
    Heading, Button
  } from "flowbite-svelte";

  let racers: Racer[] = [];
  raceInfo.subscribe((x) => {
    racers = x.racers;
  });

  function getBestLapTime(lapTimes: number[]) {
    let bestTime = lapTimes[lapTimes.length-1] - lapTimes[0];
    for (let i = 1; i < lapTimes.length; i++) {
      let current = lapTimes[i] - lapTimes[i - 1];
      console.log(current)
      if (current == 0) {
        continue;
      }
      if (current < bestTime) {
        bestTime = current;
      }
    }
    return bestTime;
  }

  function startFormation(){
    sessionStatus.set(RaceStatus.FORMATION)
  }
</script>

<div class="grid gap-6 mb-6">
<div class="grid gap-6 mb-6 md:grid-cols-2">
  {#each racers as racer}
  <div>
    <div class="text-center">
    <Heading tag="h2" class="mb-4">{racer.name}</Heading>
    <Heading tag="h4" class="mb-4"
    >Best lap time: {getBestLapTime(racer.lapTimes)}</Heading
    >
</div>

    <Table striped={true}>
      <TableHead>
        <TableHeadCell>Lap</TableHeadCell>
        <TableHeadCell>Lap Time</TableHeadCell>
        <TableHeadCell>Overall Tap Time</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each racer.lapTimes as times, index}
          <TableBodyRow>
            <TableBodyCell>{index + 1}</TableBodyCell>
            {#if index == 0}
              <TableBodyCell>{times - racer.startTime}</TableBodyCell>
            {:else}
              <TableBodyCell>{times - racer.lapTimes[index - 1]}</TableBodyCell>
            {/if}
            <TableBodyCell>{times}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
    </div>
  {/each}
  </div>
  <Button >New Practice Session</Button>
  <Button on:click={startFormation}>Start Race</Button>
</div>

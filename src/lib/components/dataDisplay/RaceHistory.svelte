<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { RaceInfo } from "$lib/_types/raceInfo";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Toggle, Button
  } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import RacerData from "$lib/components/dataDisplay/RacerData.svelte";

export let raceHistory : RaceInfo[];

    let openRow:number | null;
  let details:RaceInfo;

  const toggleRow = (i:number) => {
    openRow = openRow === i ? null : i
  }

  function deleteRaceInfo(index:number){
    if (index > -1) {
    raceHistory.splice(index, 1);
    }
  }
</script>

<div>
    <Table
      shadow
      divClass="dark:bg-gray-600 max-h-[70svh] h-[70svh] overflow-y-auto scroll-auto scroll-smooth no-scrollbar"
    >
    <caption
    class="p-5 text-lg font-semibold text-left text-gray-900 bg-gray-200 dark:text-white dark:bg-gray-900 sticky top-[-1px]"
    >
      </caption>
  
      <TableHead theadClass="sticky top-0 dark:bg-gray-900 bg-gray-200">
        <TableHeadCell>Session</TableHeadCell>
        <TableHeadCell>Date</TableHeadCell>
        <TableHeadCell>Type</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y-2 dark:divide-gray-500 divide-gray-400">
        {#each raceHistory as race, i}
          <TableBodyRow on:click={() => toggleRow(i)}>
            <TableBodyCell>{race.raceName}</TableBodyCell>
            <TableBodyCell>{race.startDate.toLocaleString("hu-HU")}</TableBodyCell>
            <TableBodyCell>{RaceStatus[race.raceStatus]}</TableBodyCell>
          </TableBodyRow>
          {#if openRow === i}
        <TableBodyRow on:dblclick={() => (details = race)}>
          <TableBodyCell colspan="4" class="p-0">
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="px-2 py-3 grid gap-5" on:click={() => toggleRow(i)} transition:slide={{ duration: 800, axis: 'y' }}>
                    <div class="flex flex-row my-2 gap-4">
                        <Button color="blue" class="grow">Details</Button>
                        <Button color="red" class="grow" on:click={() => deleteRaceInfo(i)}>Delete</Button>
                    </div>
                {#each race.racers as racer}
                    <RacerData bind:racer={racer} manualScrollOnly={true} />
                    
                {/each}
            </div>
          </TableBodyCell>
        </TableBodyRow>
      {/if}
        {/each}
      </TableBody>
    </Table>
  </div>
  
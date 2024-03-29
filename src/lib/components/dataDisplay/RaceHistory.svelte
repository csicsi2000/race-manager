<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Toggle,
    Button,
  } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import RacerData from "$lib/components/dataDisplay/RacerData.svelte";
  import RaceStatistics from "$lib/components/dataDisplay/RaceStatistics.svelte";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
  import { formatDate } from "$lib/utils/converters/timeConverter";
  import { raceHistory } from "$lib/stores/raceHistory";

  let currHistory: IRaceInfo[];
  
  raceHistory.subscribe( x => currHistory = x);

  let openRow: number | null;
  let details: IRaceInfo;
  let modalOpen = false;

  function openModal(selectedInfo:IRaceInfo){
    details = selectedInfo;
    modalOpen = true;
  }
  $:{
    console.log("Details changed");
  }

  const toggleRow = (i: number) => {
    openRow = openRow === i ? null : i;
  };

  function deleteRaceInfo(index: number) {
    if (index > -1) {
      let newHistory = structuredClone(currHistory);
      newHistory.splice(index, 1);
      console.log(currHistory.length + " " + newHistory.length)
      raceHistory.set(newHistory);
      openRow = null;
    }
  }
</script>

<div>
  <Table 
   hoverable={true}
    shadow
    divClass="dark:bg-gray-600 max-h-[70svh] h-[70svh] overflow-y-auto scroll-auto scroll-smooth no-scrollbar drop-shadow-2xl"
  >
    <TableHead class="sticky top-0 bg-gray-300 dark:bg-gray-900">
      <TableHeadCell>Session</TableHeadCell>
      <TableHeadCell>Date</TableHeadCell>
      <TableHeadCell>Type</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y-2 dark:divide-gray-500 divide-gray-300">
      {#each currHistory as race, i}
        <TableBodyRow on:click={() => toggleRow(i)}>
          <TableBodyCell>{race.raceName}</TableBodyCell>
          <TableBodyCell>{formatDate(race.startDate)}</TableBodyCell>
          <TableBodyCell>{RaceStatus[race.raceStatus]}</TableBodyCell>
        </TableBodyRow>
        {#if openRow === i}
          <TableBodyRow>
            <TableBodyCell colspan="4" class="p-0">
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="px-2 py-3 grid gap-5"
                transition:slide={{ duration: 800, axis: "y" }}
              >
                <div class="flex flex-row my-2 gap-4">
                  <Button color="blue" class="grow" on:click={() => openModal(race)}>Details</Button>
                  <Button
                    color="red"
                    class="grow"
                    on:click={() => deleteRaceInfo(i)}>Delete</Button
                  >
                </div>
                <div on:click={() => toggleRow(i)} class="grid gap-6">
                  {#each race.racers as racer}
                    <RacerData bind:racer manualScrollOnly={true} />
                  {/each}
                </div>
              </div>
            </TableBodyCell>
          </TableBodyRow>
        {/if}
      {/each}
    </TableBody>
  </Table>
</div>
<RaceStatistics bind:raceInfo={details} bind:state={modalOpen}/>

<script lang="ts">
  import { type IRacer } from "$lib/_types/interfaces/IRacer";
  import type Racer from "$lib/_types/racer";
  import { formatMs } from "$lib/utils/converters/timeConverter";
  import { getNewBestLapTime, updateBestLapTime } from "$lib/utils/racerHelpers";
  import { scrollToBottom } from "$lib/utils/helpers/scrolling";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Toggle
  } from "flowbite-svelte";
  import { onMount } from "svelte";

export let racer: IRacer;
export let manualScrollOnly: boolean;
export let isStickyHeader: boolean = false;

  let tableChild: HTMLElement | undefined;
  let isAutoScrolling = true;
  let headerClass = "";
  let bestLapTime = "Not set";


  if(isStickyHeader){
    headerClass = "sticky";
  }
  onMount(() => updateBestLapTime(racer))

  $: {
    getNewBestLapTime(racer);
    if (racer.lapTimes.length > 0 && tableChild && !manualScrollOnly && isAutoScrolling) {

      bestLapTime = formatMs(racer.bestLapTime);
      let tableNode = tableChild.parentNode?.parentNode;
      setTimeout(() => {
        if (tableNode instanceof HTMLElement  && isAutoScrolling) {
          scrollToBottom(tableNode);
        }
      }, 100);
    }
  }
</script>

<div>
  <Table
    shadow
    striped={true}
    divClass="tabular-nums dark:bg-gray-600 max-h-[70svh] h-[70svh] overflow-y-auto scroll-auto scroll-smooth no-scrollbar drop-shadow-2xl "
  >
  <caption
  bind:this={tableChild}
  class="p-5 text-lg font-semibold text-left text-gray-900 bg-{racer.color}-300 dark:text-white dark:bg-{racer.color}-700 {headerClass} top-[-1px]"
  >
  {racer.name}
  <div class="grid gap-6 mb-6 grid-cols-2">

      <p class="mt-1 text-sm font-normal text-gray-800 dark:text-gray-100">
        Best lap time: {bestLapTime}
      </p>
      {#if !manualScrollOnly}
      <Toggle bind:checked={isAutoScrolling}>Auto scroll</Toggle>
      {/if}
  </div>
    </caption>

    <TableHead theadClass="text-gray-800 dark:text-gray-100 {headerClass} top-25 dark:bg-{racer.color}-600 bg-{racer.color}-300">
      <TableHeadCell class="text-gray-800 dark:text-gray-100">Lap</TableHeadCell>
      <TableHeadCell class="text-gray-800 dark:text-gray-100 text-right">Lap Time</TableHeadCell>
      <TableHeadCell class="text-gray-800 dark:text-gray-100 text-right">Overall Time</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y-2 dark:divide-gray-500 divide-gray-400">
      {#each racer.lapTimes as times, index}
        <TableBodyRow>
          <TableBodyCell >{index + 1}</TableBodyCell>
          {#if index == 0}
            <TableBodyCell class="text-right">{formatMs(times - racer.startMillis)}</TableBodyCell>
          {:else}
            <TableBodyCell class="text-right">{formatMs(times - racer.lapTimes[index - 1])}</TableBodyCell>
          {/if}
          <TableBodyCell class="text-right">{formatMs(times)}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>

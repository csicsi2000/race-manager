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
    Toggle,
    Button
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

  function removeLap(index: number) {
    racer.lapTimes = racer.lapTimes.filter((_, lapIndex) => lapIndex !== index);
    racer.bestLapTime = -1;
    updateBestLapTime(racer);
  }

  $: {
    getNewBestLapTime(racer);
    if (racer.lapTimes.length > 0) {
      bestLapTime = formatMs(racer.bestLapTime);
    }
    if (racer.lapTimes.length > 0 && tableChild && !manualScrollOnly && isAutoScrolling) {
      let tableNode = tableChild.parentNode?.parentNode;
      setTimeout(() => {
        if (tableNode instanceof HTMLElement  && isAutoScrolling) {
          scrollToBottom(tableNode);
        }
      }, 100);
    } else if (racer.lapTimes.length === 0) {
      bestLapTime = "Not set";
    }
  }
</script>

<div class="flex flex-col dark:bg-gray-800 bg-white rounded-2xl drop-shadow-xl border border-gray-300 dark:border-gray-700 overflow-hidden h-[70svh]">
  
  <!-- Fixed Header -->
  <div class="p-4 text-lg font-semibold text-left text-gray-900 bg-{racer.color}-200 dark:text-white dark:bg-{racer.color}-800 border-b border-gray-300 dark:border-gray-700 shrink-0">
    <div class="mb-2">{racer.name}</div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <p class="text-sm font-normal text-gray-800 dark:text-gray-100">
        Best lap: <span class="font-bold">{bestLapTime}</span>
      </p>
      <div class="flex items-center gap-4">
        {#if !manualScrollOnly}
          <Toggle bind:checked={isAutoScrolling} size="small" class="whitespace-nowrap text-sm font-normal text-gray-800 dark:text-gray-100">Auto scroll</Toggle>
        {/if}
        <Button size="xs" color="alternative" disabled={racer.lapTimes.length === 0} on:click={() => removeLap(racer.lapTimes.length - 1)} class="whitespace-nowrap">Undo last</Button>
      </div>
    </div>
  </div>

  <!-- Scrolling Table -->
  <div class="flex-1 overflow-y-auto scroll-smooth no-scrollbar" bind:this={tableChild}>
    <Table shadow={false} striped={false} divClass="tabular-nums">
      <TableHead theadClass="text-gray-800 dark:text-gray-100 sticky top-0 dark:bg-gray-700 bg-gray-100 z-10 border-b border-gray-300 dark:border-gray-700">
        <TableHeadCell class="text-gray-800 dark:text-gray-100">Lap</TableHeadCell>
        <TableHeadCell class="text-gray-800 dark:text-gray-100 text-right">Lap Time</TableHeadCell>
        <TableHeadCell class="text-gray-800 dark:text-gray-100 text-right">Overall Time</TableHeadCell>
        <TableHeadCell class="text-gray-800 dark:text-gray-100 text-right">Fix</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y divide-gray-200 dark:divide-gray-700">
        {#each racer.lapTimes as times, index}
          <TableBodyRow class="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <TableBodyCell class="font-medium text-gray-900 dark:text-white">{index + 1}</TableBodyCell>
            {#if index == 0}
              <TableBodyCell class="text-right font-semibold">{formatMs(times - racer.startMillis)}</TableBodyCell>
            {:else}
              <TableBodyCell class="text-right font-semibold">{formatMs(times - racer.lapTimes[index - 1])}</TableBodyCell>
            {/if}
            <TableBodyCell class="text-right text-gray-500 dark:text-gray-400">{formatMs(times)}</TableBodyCell>
            <TableBodyCell class="text-right">
              <button class="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition-colors" on:click={() => removeLap(index)}>Delete</button>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>

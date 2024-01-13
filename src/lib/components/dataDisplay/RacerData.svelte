<script lang="ts">
  import type Racer from "$lib/_types/racer";
  import { getBestLapTime } from "$lib/utils/racerHelpers";
  import { scrollToBottom } from "$lib/utils/scrolling";
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

  export let racer: Racer;
export let manualScrollOnly: boolean;
export let isStickyHeader: boolean = false;

  let tableChild: HTMLElement | undefined;
  let isAutoScrolling = true;
  let headerClass = "";

  if(isStickyHeader){
    headerClass = "sticky";
  }

  $: {
    if (racer.lapTimes.length > 0 && tableChild && !manualScrollOnly && isAutoScrolling) {
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
    divClass="dark:bg-gray-600 max-h-[70svh] h-[70svh] overflow-y-auto scroll-auto scroll-smooth no-scrollbar"
  >
  <caption
  bind:this={tableChild}
  class="p-5 text-lg font-semibold text-left text-gray-900 bg-{racer.color}-200 dark:text-white dark:bg-{racer.color}-900 {headerClass} top-[-1px]"
  >
  {racer.name}
  <div class="grid gap-6 mb-6 grid-cols-2">

      <p class="mt-1 text-sm font-normal text-gray-800 dark:text-gray-100">
        Best lap time: {getBestLapTime(racer)}
      </p>
      {#if !manualScrollOnly}
      <Toggle bind:checked={isAutoScrolling}>Auto scroll</Toggle>
      {/if}
  </div>
    </caption>

    <TableHead theadClass="text-gray-800 dark:text-gray-100 {headerClass} top-20 dark:bg-{racer.color}-900 bg-{racer.color}-200">
      <TableHeadCell class="text-gray-800 dark:text-gray-100">Lap</TableHeadCell>
      <TableHeadCell class="text-gray-800 dark:text-gray-100">Lap Time</TableHeadCell>
      <TableHeadCell class="text-gray-800 dark:text-gray-100">Overall Tap Time</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y-2 dark:divide-gray-500 divide-gray-400">
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

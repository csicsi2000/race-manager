<script lang="ts">
  import type Racer from "$lib/_types/racer";
  import { scrollToBottom } from "$lib/utils/scrolling";
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
    Toggle
  } from "flowbite-svelte";
  import { onMount } from "svelte";

  export let racer: Racer;
export let manualScrollOnly: boolean;

  let tableChild: HTMLElement | undefined;
  let isAutoScrolling = true;

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
  class="p-5 text-lg font-semibold text-left text-gray-900 bg-gray-200 dark:text-white dark:bg-gray-900 sticky top-[-1px]"
  >
  {racer.name}
  <div class="grid gap-6 mb-6 grid-cols-2">

      <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
        Best lap time: {racer.getBestLapTime()}
      </p>
      <Toggle bind:checked={isAutoScrolling}>Auto scroll</Toggle>
  </div>
    </caption>

    <TableHead theadClass="sticky top-20 dark:bg-gray-900 bg-gray-200">
      <TableHeadCell>Lap</TableHeadCell>
      <TableHeadCell>Lap Time</TableHeadCell>
      <TableHeadCell>Overall Tap Time</TableHeadCell>
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

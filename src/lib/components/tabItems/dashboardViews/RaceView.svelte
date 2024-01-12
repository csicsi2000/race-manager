<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import  Racer from "$lib/_types/racer";
  import { raceInfo, sessionStatus } from "$lib/stores/raceInfos";
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
  import autoAnimate from "@formkit/auto-animate"

  let racers: Racer[] = [];
  raceInfo.subscribe((x) => {
    racers = x.racers.sort(Racer.racerCompare);
    console.log(racers)
  });

  function cancelRace() {
    sessionStatus.set(RaceStatus.PRACTICE);
  }

  let currentLap = 1;
</script>

<div class="grid gap-6 mb-6">
  <div class="grid gap-6 mb-6 md:grid-cols-2">
      <div>
        <div class="text-center">
          <Heading tag="h2" class="mb-4">{$raceInfo.raceName}</Heading>
          <Heading tag="h3" class="mb-4">LAP {currentLap}/{$raceInfo.lapCount}</Heading
          >
        </div>

        <Table striped={true}>
          <!--
          <TableHead>
            <TableHeadCell>No.</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Time</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            {#each racers as racer, index}

              <TableBodyRow>
                <TableBodyCell>{index + 1}</TableBodyCell>
                <TableBodyCell>{racer.name}</TableBodyCell>
                {#if index == 0}
                <TableBodyCell>Interval</TableBodyCell>

                {:else}
                  <TableBodyCell>+{racer.getMillisBehind(racers[index-1])}</TableBodyCell
                  >
                {/if}
              </TableBodyRow>
            {/each}
          </TableBody>
          -->

          <tbody use:autoAnimate>
            {#each racers as racer, index (racer.name)}
            <tr class=" bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
              <td class="px-6 py-4">
                {index + 1}
              </td>
              <td class="px-6 py-4">
              </td>
              <td class="px-6 py-4">
                {racer.name}
              </td>
              {#if index == 0}
              <td class="px-6 py-4">
                Interval
            </td>
              {:else}
              <td class="px-6 py-4">
                +{racer.getMillisBehind(racers[index-1])}
            </td>
                {/if}
          </tr>
          {/each}

          </tbody>
        </Table>
        <ul use:autoAnimate class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {#each racers as racer(racer)}
          <li class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">{racer.name}</li>
          {/each}
      </ul>
      </div>
  </div>
  <Button on:click={cancelRace}>Cancel Race</Button>
</div>

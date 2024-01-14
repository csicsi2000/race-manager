<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import  Racer from "$lib/_types/racer";
  import { currentRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
  import { base } from "$app/paths";
  import {
    Table,
    Heading,
    Button,
  } from "flowbite-svelte";
  import autoAnimate from "@formkit/auto-animate"
  import { getMillisBehind } from "$lib/utils/racerHelpers";
  import { newPracticeSession } from "$lib/utils/raceInfoSession";
  import { type IRacer } from "$lib/_types/interfaces/IRacer";
  import { formatMs } from "$lib/utils/converters";

  let racers: IRacer[] = [];
  currentRaceInfo.subscribe((x) => {
    racers = x.racers;
    racers = racers.sort(Racer.racerCompare);
    console.log(racers)
  });

  function endRace(){

  }

  function cancelRace() {
    sessionStatus.set(RaceStatus.PRACTICE);
    newPracticeSession();
  }

  let currentLap = 1;
</script>

<div class="grid gap-6">
  <div class="grid gap-6 mb-6 bg-gray-100 dark:bg-gray-700 rounded">
      <div>
        <div class="text-center">
          <Heading tag="h4" class="mb-4">{$currentRaceInfo.raceName}</Heading>
          <Heading tag="h5" class="mb-4">LAP {currentLap}/{$currentRaceInfo.lapCount}</Heading>
        </div>

        <Table striped={true} divClass="tabular-nums">

          <tbody use:autoAnimate>
            {#each racers as racer, index (racer.name)}
            <tr class="dark:bg-{racer.color}-900 bg-gray-300 border-b dark:border-gray-700">
              <td class="min-h-3 min-v-3 px-1">  
                <img src={base + "/img/penalty.png"} class="max-w-10" alt="penalty symbol">
              </td>
              <td class="font-bold px-5 py-4 text-gray-800 dark:text-white text-xl">
                {index + 1}
              </td>
              <td class="px-5 py-4 text-gray-800 dark:text-white text-xl">
                {racer.name}
              </td>
              {#if index == 0}
              <td class="px-5 py-4 text-gray-800 dark:text-white text-xl text-right">
                Interval
            </td>
              {:else}
              <td class="px-5 py-4 text-gray-800 dark:text-white text-xl text-right">
                +{formatMs(getMillisBehind(racer,racers[index-1]))}
            </td>
                {/if}
          </tr>
          {/each}

          </tbody>
        </Table>

      </div>
  </div>
  <Button on:click={cancelRace}>Cancel Race</Button>
</div>

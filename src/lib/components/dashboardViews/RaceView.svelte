<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import Racer from "$lib/_types/racer";
  import { currentPractice, sessionStatus } from "$lib/stores/raceInfos";
  import { base } from "$app/paths";
  import { Table, Heading, Button } from "flowbite-svelte";
  import autoAnimate from "@formkit/auto-animate";
  import { getMillisBehind } from "$lib/utils/racerHelpers";
  import { cancelRace, newPracticeSession } from "$lib/utils/raceInfoSession";
  import { type IRacer } from "$lib/_types/interfaces/IRacer";
  import { formatMs } from "$lib/utils/converters/timeConverter";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";

  export let raceInfo: IRaceInfo;

  function endRace() {}

  $:{
    raceInfo.racers.sort(Racer.racerCompare);
  }

  let currentLap = 1;
</script>

<div class="grid gap-6">
  <div class="grid gap-6 mb-6 bg-gray-100 dark:bg-gray-700 rounded">
    <div>
      <div class="text-center">
        <Heading tag="h4" class="m-4">{$currentPractice.raceName}</Heading>
        <Heading tag="h5" class="m-4"
          >LAP {currentLap}/{$currentPractice.lapCount}</Heading
        >
      </div>

      <Table striped={true} divClass="tabular-nums">
        <tbody use:autoAnimate>
          {#each raceInfo.racers as racer, index (racer.name)}
            <tr
              class="dark:bg-{racer.color}-900 bg-gray-300 border-b dark:border-gray-700"
            >
              <td class="min-h-3 min-v-3 px-1">
                <img
                  src={base + "/img/penalty.png"}
                  class="max-w-10"
                  alt="penalty symbol"
                />
              </td>
              <td
                class="font-bold px-5 py-4 text-gray-800 dark:text-white text-xl"
              >
                {index + 1}
              </td>
              <td class="px-5 py-4 text-gray-800 dark:text-white text-xl">
                {racer.name}
              </td>
              {#if racer.lapTimes.length == 0}
                <td
                  class="px-5 py-4 text-gray-800 dark:text-white text-xl text-right"
                >
                </td>
              {:else if index == 0}
                <td
                  class="px-5 py-4 text-gray-800 dark:text-white text-xl text-right"
                >
                  Interval
                </td>
              {:else}
                <td
                  class="px-5 py-4 text-gray-800 dark:text-white text-xl text-right"
                >
                  +{formatMs(
                    getMillisBehind(racer, raceInfo.racers[index - 1])
                  )}
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

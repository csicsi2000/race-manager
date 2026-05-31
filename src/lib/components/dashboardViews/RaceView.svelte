<script lang="ts">
  import Racer from "$lib/_types/racer";
  import { base } from "$app/paths";
  import { Table, Heading, Button } from "flowbite-svelte";
  import { getMillisBehind } from "$lib/utils/racerHelpers";
  import { cancelRace } from "$lib/utils/raceInfoSession";
  import { formatMs } from "$lib/utils/converters/timeConverter";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";

  export let raceInfo: IRaceInfo;

  $:{
    raceInfo.racers.sort(Racer.racerCompare);
    currentLap = Math.max(1, ...raceInfo.racers.map((racer) => racer.lapTimes.length));
  }

  let currentLap = 1;
</script>

<div class="grid gap-6">
  <div class="grid gap-6 mb-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div>
      <div class="text-center">
        <Heading tag="h4" class="m-4">{raceInfo.raceName}</Heading>
        <Heading tag="h5" class="m-4"
          >LAP {currentLap}/{raceInfo.lapCount}</Heading
        >
      </div>

      <Table striped={true} divClass="tabular-nums">
        <tbody>
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
                  Waiting
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

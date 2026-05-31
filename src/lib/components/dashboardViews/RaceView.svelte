<script lang="ts">
  import Racer from "$lib/_types/racer";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { base } from "$app/paths";
  import { Table, Heading, Button, Modal } from "flowbite-svelte";
  import { getMillisBehind } from "$lib/utils/racerHelpers";
  import { cancelRace, closeFinishedRace } from "$lib/utils/raceInfoSession";
  import { formatMs } from "$lib/utils/converters/timeConverter";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
  import type { IRacer } from "$lib/_types/interfaces/IRacer";
  import RacerData from "$lib/components/dataDisplay/RacerData.svelte";
  import { sessionStatus } from "$lib/stores/raceInfos";

  export let raceInfo: IRaceInfo;

  $:{
    raceInfo.racers.sort(Racer.racerCompare);
    currentLap = Math.max(1, ...raceInfo.racers.map((racer) => racer.lapTimes.length));
  }

  let currentLap = 1;
  let cancelModalOpen = false;
  let selectedRacer: IRacer | null = null;
  let detailsModalOpen = false;

  $: isFinished = $sessionStatus === RaceStatus.FINISHED;

  function confirmCancel() {
    cancelModalOpen = false;
    cancelRace();
  }

  function handleCloseRace() {
    closeFinishedRace();
  }

  function openRacerDetails(racer: IRacer) {
    selectedRacer = racer;
    detailsModalOpen = true;
  }

  function getLapTime(racer: IRacer): string {
    if (racer.lapTimes.length === 0) return "";
    if (racer.lapTimes.length === 1) return formatMs(racer.lapTimes[0] - racer.startMillis);
    const last = racer.lapTimes[racer.lapTimes.length - 1];
    const prev = racer.lapTimes[racer.lapTimes.length - 2];
    return formatMs(last - prev);
  }

  function hasFinished(racer: IRacer): boolean {
    return raceInfo.lapCount > 0 && racer.lapTimes.length >= raceInfo.lapCount;
  }
</script>

<div class="grid gap-6">
  <div class="rounded-2xl border border-gray-300 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
    <div class="text-center py-6 border-b border-gray-200 dark:border-gray-700">
      <Heading tag="h4" class="m-2 text-2xl font-bold">{raceInfo.raceName}</Heading>
      {#if isFinished}
        <span class="inline-block mt-2 px-4 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-lg font-bold">
          🏁 Race Complete
        </span>
      {:else}
        <Heading tag="h5" class="m-2 text-gray-500 dark:text-gray-400 font-medium"
          >LAP {currentLap}/{raceInfo.lapCount}</Heading
        >
      {/if}
    </div>

    <Table striped={true} divClass="tabular-nums">
      <thead class="text-xs uppercase text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-3 py-3">Pen</th>
          <th class="px-3 py-3">Pos</th>
          <th class="px-3 py-3">Name</th>
          <th class="px-3 py-3 text-right">Laps</th>
          <th class="px-3 py-3 text-right">Last Lap</th>
          <th class="px-3 py-3 text-right">Gap</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        {#each raceInfo.racers as racer, index (racer.name)}
          <tr
            class="dark:bg-{racer.color}-900 bg-{racer.color}-100 hover:bg-{racer.color}-200 dark:hover:bg-{racer.color}-800 transition-colors cursor-pointer"
            on:click={() => openRacerDetails(racer)}
          >
            <td class="min-h-3 min-v-3 px-1 py-4 text-center">
              <img
                src={base + "/img/penalty.png"}
                class="max-w-10 inline-block drop-shadow-md"
                alt="penalty symbol"
              />
            </td>
            <td
              class="font-bold px-5 py-4 text-gray-800 dark:text-white text-2xl"
            >
              {index + 1}
            </td>
            <td class="px-5 py-4 font-semibold text-gray-800 dark:text-white text-xl">
              {racer.name}
              {#if hasFinished(racer)}
                <span class="ml-2 text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full font-medium">Finished</span>
              {/if}
            </td>
            <td class="px-5 py-4 text-gray-700 dark:text-gray-300 text-lg text-right tabular-nums">
              {racer.lapTimes.length}/{raceInfo.lapCount}
            </td>
            <td class="px-5 py-4 text-gray-700 dark:text-gray-300 text-lg text-right tabular-nums">
              {getLapTime(racer) || "—"}
            </td>
            {#if racer.lapTimes.length == 0}
              <td
                class="px-5 py-4 text-gray-500 dark:text-gray-400 text-xl text-right italic"
              >
                Waiting
              </td>
            {:else if index == 0}
              <td
                class="px-5 py-4 text-green-600 dark:text-green-400 font-bold text-xl text-right"
              >
                Leader
              </td>
            {:else}
              <td
                class="px-5 py-4 text-red-600 dark:text-red-400 font-bold text-xl text-right"
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

  {#if isFinished}
    <Button color="blue" size="lg" class="shadow-lg hover:scale-[1.02] transition-all font-semibold" on:click={handleCloseRace}>Back to Practice</Button>
  {:else}
    <Button color="red" size="lg" class="shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-r from-red-500 to-red-700 font-semibold" on:click={() => cancelModalOpen = true}>Cancel Race</Button>
  {/if}
</div>

<!-- Cancel Race Confirmation Modal -->
<Modal bind:open={cancelModalOpen} size="xs" autoclose>
  <div class="text-center">
    <Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Are you sure you want to cancel the race?
    </Heading>
    <Button color="red" class="me-2" on:click={confirmCancel}>Yes, cancel it</Button>
    <Button color="alternative">No, keep racing</Button>
  </div>
</Modal>

<!-- Racer Details Modal -->
<Modal bind:open={detailsModalOpen} size="lg" title={selectedRacer?.name ?? "Racer Details"} outsideclose>
  {#if selectedRacer}
    <RacerData bind:racer={selectedRacer} manualScrollOnly={true} isStickyHeader={false} />
  {/if}
</Modal>

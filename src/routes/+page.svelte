<script lang="ts">
  import F1CountdownLights from "$lib/components/F1CountdownLights.svelte";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { sessionStatus, currentRace } from "$lib/stores/raceInfos";
  import PracticeView from "$lib/components/dashboardViews/PracticeView.svelte";
  import RaceView from "$lib/components/dashboardViews/RaceView.svelte";
  import RaceInfoSettings from "$lib/components/settings/RaceInfoSettings.svelte";
  import { startFormation } from "$lib/utils/raceInfoSession";
  import { Button, Modal } from "flowbite-svelte";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";

  let currentState = RaceStatus.PRACTICE;
  sessionStatus.subscribe((x) => {
    currentState = x;
  });

  let raceInfo: IRaceInfo | null = null;
  currentRace.subscribe((x) => {
    raceInfo = x;
  });

  let setupModalOpen = false;

  function handleStartRace() {
    setupModalOpen = false;
    startFormation();
  }
</script>

<div class="lg:max-w-screen-xl mx-auto w-full p-4 mt-8">
  {#if currentState === RaceStatus.PRACTICE}
    <div class="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg">
      <div>
        <h2 class="text-3xl font-extrabold tracking-tight dark:text-white">Practice Mode</h2>
        <p class="text-md text-gray-700 dark:text-gray-300 mt-1">Run laps freely. No limits.</p>
      </div>
      <Button color="green" size="xl" class="shadow-lg hover:scale-[1.03] transition-all bg-gradient-to-r from-green-400 to-green-600 font-bold" on:click={() => setupModalOpen = true}>Setup Race</Button>
    </div>
    <PracticeView />
  {:else if currentState === RaceStatus.FORMATION || currentState === RaceStatus.RACE || currentState === RaceStatus.FINISHED}
    {#if raceInfo}
      <RaceView bind:raceInfo />
    {/if}
    {#if currentState !== RaceStatus.FINISHED}
      <F1CountdownLights />
    {/if}
  {/if}
</div>

<Modal bind:open={setupModalOpen} size="sm" title="Race Setup" outsideclose class="bg-white dark:bg-gray-800">
  <RaceInfoSettings />
  <svelte:fragment slot="footer">
    <Button color="green" size="lg" on:click={handleStartRace} class="w-full shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-r from-green-400 to-green-600 font-bold">Start Formation Lap</Button>
  </svelte:fragment>
</Modal>

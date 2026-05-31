<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import {
    currentPractice,
    newRaceInfo,
    sessionStatus,
  } from "$lib/stores/raceInfos";
  import { Button, Heading, Label, Input } from "flowbite-svelte";
  import RacerData from "$lib/components/dataDisplay/RacerData.svelte";
  import {
    newPracticeSession,
    startFormation,
  } from "$lib/utils/raceInfoSession";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";

  let raceInfo: IRaceInfo;
  currentPractice.subscribe((x) => {
    raceInfo = x;
  });
</script>

{#if $sessionStatus != RaceStatus.PRACTICE}
<div class="text-center">
  <Heading tag="h2">You have an ongoing race session.</Heading>
</div>
{:else}
  <div class="grid gap-6 mb-6">
    <div class="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-300 dark:border-gray-700 shadow-lg">
      <Heading tag="h3" class="text-3xl font-bold tracking-tight">{raceInfo.raceName}</Heading>
    </div>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      {#each raceInfo.racers as racer, index (index)}
        <RacerData bind:racer manualScrollOnly={false} isStickyHeader />
      {/each}
    </div>
    <Button color="blue" size="lg" class="shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-r from-blue-500 to-blue-700 font-semibold" on:click={newPracticeSession}
      >New Practice Session</Button
    >
  </div>
{/if}

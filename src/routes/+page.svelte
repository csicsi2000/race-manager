<script lang="ts">
  import {
    BottomNav,
    BottomNavHeader,
    BottomNavHeaderItem,
  } from "flowbite-svelte";
  import F1CountdownLights from "$lib/components/F1CountdownLights.svelte";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { currentPractice, sessionStatus } from "$lib/stores/raceInfos";
  
  let lights: F1CountdownLights;
  import PracticeView from "$lib/components/dashboardViews/PracticeView.svelte";

  
  let currentState = RaceStatus.PRACTICE;

  sessionStatus.subscribe((x) => {
    currentState = x;
  })

</script>

<div class="lg:max-w-screen-lg mx-auto">
  <PracticeView/>
</div>
<BottomNav position="fixed" navType="group" classInner="grid-cols-5">
  <BottomNavHeader slot="header" style="pointer-events: none;">
    {#each Object.keys(RaceStatus) as state}
      {#if isNaN(Number(state))}
        {#if state == RaceStatus[currentState]}
          <BottomNavHeaderItem itemName={state} active disabled />
        {:else}
          <BottomNavHeaderItem itemName={state} disabled />
        {/if}
      {/if}
    {/each}
  </BottomNavHeader>
</BottomNav>

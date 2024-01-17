<script lang="ts">
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
  import F1CountdownLights from "$lib/components/F1CountdownLights.svelte";
  import RaceInfoSettings from "$lib/components/settings/RaceInfoSettings.svelte";
  import RaceView from "$lib/components/dashboardViews/RaceView.svelte";
  import { currentRace } from "$lib/stores/raceInfos";
  import { startFormation } from "$lib/utils/raceInfoSession";
  import { Button } from "flowbite-svelte";

  let raceInfo: IRaceInfo | null = null;
  currentRace.subscribe((x) => {
    raceInfo = x;
    console.log(raceInfo);
  });
</script>

<div class="lg:max-w-screen-lg mx-auto grid gap-4">
  {#if raceInfo}
    <RaceView bind:raceInfo />
  {:else}
    <RaceInfoSettings />
    <Button color="green" on:click={startFormation}>New Race</Button>
  {/if}
</div>
<F1CountdownLights />

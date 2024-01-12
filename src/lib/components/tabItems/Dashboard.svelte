<script>
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { raceInfo, sessionStatus } from "$lib/stores/currentRaceInfo";
  import PracticeView from "./dashboardViews/PracticeView.svelte";
  import RaceView from "./dashboardViews/RaceView.svelte";

  let status = RaceStatus.PRACTICE;
  raceInfo.subscribe((x) => {
    status = x.raceStatus;
  });

  sessionStatus.subscribe((x) => {
    status = x;
  })
</script>

{#if status == RaceStatus.RACE || status == RaceStatus.FORMATION}
  <RaceView  />
{:else}
  <PracticeView />
{/if}

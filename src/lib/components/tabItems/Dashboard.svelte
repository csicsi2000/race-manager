<script>
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { sessionStatus } from "$lib/stores/raceInfos";
  import PracticeView from "./dashboardViews/PracticeView.svelte";
  import RaceView from "./dashboardViews/RaceView.svelte";

  let status = RaceStatus.PRACTICE;

  sessionStatus.subscribe((x) => {
    status = x;
    console.log(status);
  })
</script>

{#if status == RaceStatus.RACE || status == RaceStatus.FORMATION}
  <RaceView  />
{:else}
  <PracticeView />
{/if}

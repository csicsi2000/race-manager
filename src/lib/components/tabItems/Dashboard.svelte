<script>
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { raceInfo } from "$lib/stores/raceInfo";
  import FormationView from "./dashboardViews/FormationView.svelte";
  import PracticeView from "./dashboardViews/PracticeView.svelte";
  import RaceView from "./dashboardViews/RaceView.svelte";

  let status = RaceStatus.PRACTICE;
  raceInfo.subscribe((x) => {
    status = x.raceStatus;
  });
</script>

{#if status == RaceStatus.FORMATION}
  <FormationView />
{:else if status == RaceStatus.RACE}
  <RaceView />
{:else}
  <PracticeView />
{/if}

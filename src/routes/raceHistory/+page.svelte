<script lang="ts">
  import type { RaceInfo } from "$lib/_types/raceInfo";
  import { raceHistory } from "$lib/stores/raceHistory";
  import RaceHistory from "$lib/components/dataDisplay/RaceHistory.svelte";


  let raceInfos: RaceInfo[];
raceHistory.subscribe( x => raceInfos = x);
</script>

<div class="lg:max-w-screen-lg mx-auto">
    <RaceHistory bind:raceHistory={raceInfos}/>
</div>
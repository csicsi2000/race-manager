<script lang="ts">
  import { raceHistory } from "$lib/stores/raceHistory";
  import RaceHistory from "$lib/components/dataDisplay/RaceHistory.svelte";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";


  let raceInfos: IRaceInfo[];
</script>

<div class="lg:max-w-screen-lg mx-auto">
    <RaceHistory/>
</div>
<script lang="ts">
  import type { RaceInfo } from "$lib/_types/raceInfo";
  import { raceHistory } from "$lib/stores/raceHistory";

  let raceInfos: RaceInfo[];
raceHistory.subscribe( x => raceInfos = x);
</script>

<div class="w-4/5 lg:max-w-screen-lg mx-auto">
    {#each raceInfos as race}
        
    {/each}
</div>
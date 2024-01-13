<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import Racer from "$lib/_types/racer";
  import { currentRaceInfo, newRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
  import {
    Button, Heading
  } from "flowbite-svelte";
  import RacerData from "$lib/components/dataDisplay/RacerData.svelte";
  import { newPracticeSession } from "$lib/utils/raceInfoSession";
  import type { RaceInfo } from "$lib/_types/raceInfo";

  let raceInfo: RaceInfo;
  currentRaceInfo.subscribe((x) => {
    raceInfo= x;
    console.log(x)
  });


  function startFormation() {
    sessionStatus.set(RaceStatus.FORMATION);
  }


</script>

<div class="grid gap-6 mb-6">
  <Heading tag="h4">{raceInfo.raceName}</Heading>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    {#each raceInfo.racers as racer,index(index)}
      <RacerData bind:racer={racer} manualScrollOnly={false}/>
    {/each}
  </div>
  <Button on:click={newPracticeSession}>New Practice Session</Button>
  <Button on:click={startFormation}>Start Race</Button>
</div>

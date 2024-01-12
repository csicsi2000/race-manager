<script lang="ts">
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import Racer from "$lib/_types/racer";
  import { currentRaceInfo, newRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
  import {
    Button,
  } from "flowbite-svelte";
  import RacerData from "$lib/components/dataDisplay/RacerData.svelte";
  import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
  import { RaceInfo } from "$lib/_types/raceInfo";

  let racers: Racer[] = [];
  currentRaceInfo.subscribe((x) => {
    racers = x.racers;
    console.log("Racers changed")
  });


  function startFormation() {
    sessionStatus.set(RaceStatus.FORMATION);
  }

  function newPracticeSession(){
    let database = new LocalStorageDatabase();
    database.putRaceInfo($currentRaceInfo);
    let newPractice = structuredClone($newRaceInfo);
    console.log(newPractice);
    currentRaceInfo.set(newPractice);
  }
</script>

<div class="grid gap-6 mb-6">
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    {#each racers as racer,index(index)}
      <RacerData bind:racer={racer} manualScrollOnly={false}/>
    {/each}
  </div>
  <Button on:click={newPracticeSession}>New Practice Session</Button>
  <Button on:click={startFormation}>Start Race</Button>
</div>

<script lang="ts">
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
    import {Modal, ImagePlaceholder} from "flowbite-svelte";
  import RaceInfoGraph from "./RaceInfoGraph.svelte";

    export let raceInfo: IRaceInfo;
    export let state: boolean;
    $:{
        console.log(state);
    }
</script>

<Modal title={raceInfo?.raceName} bind:open={state} size="xl" autoclose outsideclose>
    <RaceInfoGraph bind:raceInfo={raceInfo} />
  </Modal>
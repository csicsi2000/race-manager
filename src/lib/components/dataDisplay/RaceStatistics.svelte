<script lang="ts">
  import type { RaceInfo } from "$lib/_types/raceInfo";
    import {Modal, ImagePlaceholder} from "flowbite-svelte";

    export let raceInfo: RaceInfo;
    export let state: boolean;
    $:{
        console.log(state);
    }
</script>

<Modal title={raceInfo?.raceName} bind:open={state} autoclose outsideclose>
    <ImagePlaceholder />
  </Modal>
<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import QrScanner from "qr-scanner";
  import {Heading} from "flowbite-svelte";
  import { saveSensorIp } from "$lib/utils/localSettings";

  export let data: PageData;

  let videoElement: HTMLVideoElement;
    let isCameraAvailable:boolean;

  onMount(() => {
    hasCameraAccess().then((res) => {
        isCameraAvailable = res;
    })

    const qrScanner = new QrScanner(videoElement, (result) =>
      processCodeContent(result)
    );
    qrScanner.start();
  });
  function processCodeContent(text: string) {
    let searchParams = new URLSearchParams(text);
    let serverValue = searchParams.get("server");
    console.log(serverValue);
    if (serverValue?.startsWith("ws")) {
        saveSensorIp(serverValue);
    }
  }

  async function hasCameraAccess(): Promise<boolean> {
    try {
      // Try to get camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // If successful, release the stream and return true
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        return true;
      }

      return false;
    } catch (error) {
      // An error occurred, likely due to no camera access
      console.error("Error accessing camera:", error);
      return false;
    }
  }
</script>

<div class="grid justify-items-center">
    {#if !isCameraAvailable}
        <p class="text-2xl">Camera is not available. Please allow it for the site.</p>
    {/if}
  <video bind:this={videoElement}></video>
</div>

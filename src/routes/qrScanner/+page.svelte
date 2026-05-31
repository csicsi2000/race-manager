<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import QrScanner from "qr-scanner";
  import { saveSensorIp } from "$lib/utils/localSettings";
  import { routeToPage } from "$lib/utils/navigationHelper";
  import { PageRoutes } from "$lib/_types/enums/pageRoutes";

  let videoElement: HTMLVideoElement;
  let isCameraAvailable: boolean;

  let qrScanner: QrScanner;
  onMount(() => {
    hasCameraAccess().then((res) => {
      isCameraAvailable = res;
    });

    qrScanner = new QrScanner(videoElement, (result) =>
      processCodeContent(result.data),
      {highlightCodeOutline: true,
      highlightScanRegion: true}
    );
    qrScanner.start();
  });
  function processCodeContent(text: string) {
    try {
      let searchParams = new URL(text);
      let serverValue = searchParams.searchParams.get("server");
      if (serverValue?.startsWith("ws")) {
        routeToPage(PageRoutes.SETTINGS);
        saveSensorIp(serverValue);
      }
    } catch {
      if (text.startsWith("ws://") || text.startsWith("wss://")) {
        routeToPage(PageRoutes.SETTINGS);
        saveSensorIp(text);
      }
    }
  }

  onDestroy(() => {
    qrScanner.stop();
  });

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
    <p class="text-2xl">
      Camera is not available. Please allow it for the site.
    </p>
  {/if}
  <video bind:this={videoElement}>
    <track kind="captions" />
  </video>
</div>

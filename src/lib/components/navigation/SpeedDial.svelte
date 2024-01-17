<script>
  import { base } from "$app/paths";
  import { SpeedDial, SpeedDialButton } from "flowbite-svelte";
  import {
    ShareNodesSolid,
    PrintSolid,
    DownloadSolid,
    FileCopySolid,
    CameraFotoOutline,
  } from "flowbite-svelte-icons";
</script>

<SpeedDial defaultClass="fixed end-6 bottom-[60px]" left>
  <SpeedDialButton name="Scan" top>
    <a href="{base}/qrScanner">
      <CameraFotoOutline class="w-5 h-5" />
    </a>
  </SpeedDialButton>
</SpeedDial>

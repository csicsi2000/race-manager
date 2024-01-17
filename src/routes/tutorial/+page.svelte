<script lang="ts">
  import { base } from "$app/paths";
  import CopyToClipboard from "$lib/components/CopyToClipboard.svelte";
  import type { PageData } from "./$types";
  import { Heading } from "flowbite-svelte";

  export let data: PageData;
</script>

<div class="w-4/5 lg:max-w-screen-lg mx-auto">
  <article
    id="ServerConfig"
    class="format lg:format-lg dark:format-invert w-full mt-5 mb-2 max-w-max"
  >
    <h2>Enable server as secure IP</h2>
    <ol>
      <li>
        You can find the server address in the settings page, or from the url
        when you scan the esp board unit.<br> (e.g. ws://192.168.178.101)
      </li>
      <li>
        On Chrome go to the link below (Click to copy):
        <CopyToClipboard textToCopy="chrome://flags/#unsafely-treat-insecure-origin-as-secure">chrome://flags/#unsafely-treat-insecure-origin-as-secure</CopyToClipboard>
      </li>
      <li>
        Add the server url to the box, and enable <code
          >unsafely-treat-insecure-origin-as-secure</code
        > option. Then relaunch the browser.
      </li>
      <img src={base + "/img/unsecure.png"} alt="Image of the unsecured option"/>
    </ol>
  </article>
</div>

<script lang="ts">
  import CopyToClipboard from "$lib/components/CopyToClipboard.svelte";
  import { Heading, List, Li, Accordion, AccordionItem } from "flowbite-svelte";
</script>

<div class="mx-auto grid w-full max-w-screen-lg gap-6 px-4 py-4">
  <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <Heading tag="h2" class="mb-3">Quick setup</Heading>
    <List tag="ol" class="space-y-2">
      <Li>Flash the ESP firmware from <code>ESP_Board_Codes/Central_Server/nonAsyncWifiCounter_withScreen_TextOnly</code>.</Li>
      <Li>Connect to the <code>RaceM-Server</code> Wi-Fi setup portal if the board has no saved Wi-Fi.</Li>
      <Li>Open <code>http://SENSOR_IP:81</code> and verify live WebSocket messages.</Li>
      <Li>In Settings, enter <code>ws://SENSOR_IP</code>, tune minimum lap time, and enable voice cues if wanted.</Li>
      <Li>Run practice mode and pass each car through the sensor before starting a race.</Li>
    </List>
  </section>

  <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <Heading tag="h2" class="mb-3">Browser notes</Heading>
    <p class="mb-4 text-gray-700 dark:text-gray-300">
      If you use the deployed HTTPS site with a local ESP WebSocket, some browsers block mixed content. Running the app locally avoids this during development.
    </p>
    <Accordion>
      <AccordionItem>
        <span slot="header">Chrome / Edge HTTPS exception</span>
        <List tag="ol" class="space-y-2">
          <Li>
            Open:
            <CopyToClipboard textToCopy="chrome://flags/#unsafely-treat-insecure-origin-as-secure">chrome://flags/#unsafely-treat-insecure-origin-as-secure</CopyToClipboard>
          </Li>
          <Li>Add the deployed app origin and the ESP origin, then relaunch the browser.</Li>
        </List>
      </AccordionItem>
      <AccordionItem>
        <span slot="header">Firefox Nightly</span>
        <List tag="ol" class="space-y-2">
          <Li>
            Open:
            <CopyToClipboard textToCopy="about:config">about:config</CopyToClipboard>
          </Li>
          <Li>Set <code>network.websocket.allowInsecureFromHTTPS</code> to <code>true</code>.</Li>
        </List>
      </AccordionItem>
    </Accordion>
  </section>

  <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <Heading tag="h2" class="mb-3">Physical sensor recommendation</Heading>
    <p class="text-gray-700 dark:text-gray-300">
      Use one active-low IR break-beam per lane for the reliable build. Reflective IR modules work for a fast prototype, but car color and room light can create false triggers. Full wiring is in <code>HARDWARE.md</code>.
    </p>
  </section>
</div>

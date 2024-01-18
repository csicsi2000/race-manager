<script lang="ts">
  import { base } from "$app/paths";
  import CopyToClipboard from "$lib/components/CopyToClipboard.svelte";
  import type { PageData } from "../$types";
  import {
    Heading,
    List,
    Li,
    Img,
    Accordion,
    AccordionItem,
  } from "flowbite-svelte";

  export let data: PageData;
</script>

<div class="w-4/5 lg:max-w-screen-lg mx-auto">
  <article
    id="ServerConfig"
    class="w-full mt-5 mb-2 max-w-max text-gray-800 dark:text-gray-400"
  >
    <Heading tag="h2" class="mb-2">Enable server as secure IP (Mixed content)</Heading>
    <List tag="ol" class="space-y-2">
      <Li>
        You can find the server address in the settings page, or from the url
        when you scan the esp board unit.<br /> (e.g. ws://192.168.178.101)
      </Li>
      <Li> Following browsers supports:
        <Accordion>
          <AccordionItem>
            <span slot="header">Google Chrome</span>
            <List tag="ol">
              <Li>
                <p class="mb-2 text-gray-800 dark:text-gray-400">
                  On Chrome go to the link below (Click to copy):
                  <CopyToClipboard
                    textToCopy="chrome://flags/#unsafely-treat-insecure-origin-as-secure"
                    >chrome://flags/#unsafely-treat-insecure-origin-as-secure</CopyToClipboard
                  >
                </p>
              </Li>
              <Li>
                Add the server url to the box, and enable <code
                  >unsafely-treat-insecure-origin-as-secure</code
                > option. Then relaunch the browser.
              </Li>
              <Img
                src={base + "/img/unsecure.png"}
                alt="Image of the unsecured option on chrome"
              />
            </List>
          </AccordionItem>
          <AccordionItem>
            <span slot="header">Edge</span>
            <List tag="ol">
              <Li>
                <p class="mb-2 text-gray-800 dark:text-gray-400">
                  On Edge go to the link below (Click to copy):
                  <CopyToClipboard
                    textToCopy="edge://flags/"
                    >edge://flags/#unsafely-treat-insecure-origin-as-secure</CopyToClipboard
                  >
                </p>
              </Li>
              <Li>
                Add the server url to the box, and enable <code
                  >unsafely-treat-insecure-origin-as-secure</code
                > option. Then relaunch the browser.
              </Li>
              <Img
                src={base + "/img/unsecure.png"}
                alt="Image of the unsecured option on chrome"
              />
            </List>
          </AccordionItem>
          <AccordionItem>
            <span slot="header">Firefox (Nightly)</span>
            <List tag="ol">
              <Li>
                <p class="mb-2 text-gray-800 dark:text-gray-400">
                  On Firefox go to the link below (Click to copy):
                  <CopyToClipboard textToCopy="about:config"
                    >about:config</CopyToClipboard
                  >
                </p>
              </Li>
              <Li>
                Set the following setting to true <code
                  >network.websocket.allowInsecureFromHTTPS</code
                > option. Then relaunch the browser.
              </Li>
              <Img
                src={base + "/img/firefoxUnsecure.png"}
                alt="Image of the unsecured option on firefox"
              />
            </List>
          </AccordionItem>
        </Accordion>
      </Li>
    </List>
  </article>
</div>

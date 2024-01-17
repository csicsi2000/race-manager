<script>
  import "../app.postcss";
  import {
    DarkMode,
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Badge, BottomNav, BottomNavHeader, BottomNavHeaderItem, BottomNavItem, Tooltip


  } from "flowbite-svelte";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { AdjustmentsVerticalOutline, BookmarkSolid, GithubSolid, HomeSolid, PlusSolid, SearchOutline } from "flowbite-svelte-icons";
  import { connection } from "$lib/stores/serverStatus";
  import { ConnectionStatus } from "$lib/_types/enums/connectionStatus";
  import { fade } from "svelte/transition";
  import { onNavigate } from "$app/navigation";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import { sessionStatus } from "$lib/stores/raceInfos";
  import SpeedDial from "$lib/components/navigation/SpeedDial.svelte";

  onNavigate((navigation) => {

    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
  connection.subscribe(() => console.warn("Connection state changed" + $connection + ";" + ConnectionStatus.CONNECTED));
</script>

<Navbar class="z-10 bg-gray-300" let:toggle>
  <NavBrand>
    <DarkMode />
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-3"
    >
      <a href="{base}/">Carrera Go lap counter</a>
    </span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl>
    <NavLi href="{base}/" active={$page.url.pathname.endsWith("/")}
    >Practice</NavLi>
    <NavLi href="{base}/race" active={$page.url.pathname.endsWith("/race")}
      >Race</NavLi>
    <NavLi href="{base}/settings" active={$page.url.pathname.endsWith("/settings")}
    >Settings</NavLi>
    <NavLi
      href="{base}/raceHistory"
      active={$page.url.pathname.endsWith("raceHistory")}>History</NavLi
    >
    <NavLi href="{base}/tutorial" active={$page.url.pathname.endsWith("tutorial")}
      >Tutorial</NavLi
    >
    <NavLi href="{base}/credits" active={$page.url.pathname.endsWith("credits")}
    >Credits</NavLi
  >
    <NavLi href="https://github.com/csicsi2000/svelte-slot-car-race-management">
      <GithubSolid />
    </NavLi>
  </NavUl>
</Navbar>
<div class="my-3">
  <div class="flex items-center justify-center my-4">
    {#if $connection == ConnectionStatus.DISCONNECTED}
      <Badge class="" rounded large color="red">Disconnected</Badge
      >{:else if ($connection == ConnectionStatus.CONNECTED)}
      <Badge class="" rounded large color="green">Connected</Badge>
    {/if}
  </div>
  <div class="p-4">
    <slot />
  </div>
  <BottomNav position="fixed" navType="group" classInner="grid-cols-5">
    <BottomNavHeader slot="header" style="pointer-events: none;">
      {#each Object.keys(RaceStatus) as state}
        {#if isNaN(Number(state))}
          {#if state == RaceStatus[$sessionStatus]}
            <BottomNavHeaderItem itemName={state} active disabled />
          {:else}
            <BottomNavHeaderItem itemName={state} disabled />
          {/if}
        {/if}
      {/each}
    </BottomNavHeader>
  </BottomNav>
  <SpeedDial />
</div>
<div class="min-h-12" />

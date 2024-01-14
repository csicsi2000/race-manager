<script>
  import "../app.postcss";
  import {
    DarkMode,
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Badge,
  } from "flowbite-svelte";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { GithubSolid } from "flowbite-svelte-icons";
  import { connection } from "$lib/stores/sensorStatus";
  import { ConnectionStatus } from "$lib/_types/enums/connectionStatus";
  import { fade } from "svelte/transition";
  import { onNavigate } from '$app/navigation';

  onNavigate((navigation) => {
	if (!document.startViewTransition) return;

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
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
  <NavUl >
    <NavLi
    href="{base}/"
    active={$page.url.pathname.endsWith("/")}>Practice</NavLi
  >
  <NavLi
  href="{base}/race"
  active={$page.url.pathname.endsWith("/race")}>Race</NavLi
>
    <NavLi
      href="{base}/raceHistory"
      active={$page.url.pathname.endsWith("raceHistory")}>Race History</NavLi
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
      >{:else if ($connection = ConnectionStatus.CONNECTED)}
      <Badge class="" rounded large color="green">Connected</Badge>
    {/if}
  </div>
  <slot/>
</div>
<div class="min-h-12" />

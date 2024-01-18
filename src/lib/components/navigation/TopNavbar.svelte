<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { Navbar, NavBrand, DarkMode, NavHamburger, NavUl, NavLi } from "flowbite-svelte";
  import { GithubSolid } from "flowbite-svelte-icons";

  $: activeUrl = $page.url.pathname;
</script>
<Navbar class="z-10 bg-gray-200" let:toggle>
    <NavBrand>
      <DarkMode />
      <span
        class="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-3"
      >
        <a href="{base}/">Carrera Go lap counter</a>
      </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {activeUrl} activeClass="text-white bg-green-700 md:bg-transparent md:text-green-500 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent">
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
      <NavLi href="{base}/setup" active={$page.url.pathname.endsWith("setup")}
        >Setup</NavLi
      >
      <NavLi href="{base}/credits" active={$page.url.pathname.endsWith("credits")}
      >Credits</NavLi
    >
      <NavLi href="https://github.com/csicsi2000/svelte-slot-car-race-management">
        <GithubSolid />
      </NavLi>
    </NavUl>
  </Navbar>
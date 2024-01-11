<script>
  import "../app.postcss";
  import {DarkMode, Navbar, NavBrand, NavHamburger, NavLi, NavUl, Badge} from "flowbite-svelte";
  import {page} from "$app/stores";
  import {base} from "$app/paths";
  import {GithubSolid} from "flowbite-svelte-icons";
</script>
<Navbar class="z-10" let:hidden let:toggle>
    <NavBrand>
        <DarkMode/>
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-3">
      <a href="{base}/">Carrera Go lap counter</a>
    </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavLi href="{base}/raceHistory" active={$page.url.pathname.endsWith('raceHistory')}>Race History</NavLi>
        <NavLi href="{base}/credits" active={$page.url.pathname.endsWith('credits')}>Credits</NavLi>
        <NavLi href="https://github.com/sroehrl/svelte-flowbite-boilerplate#readme" >
            <GithubSolid/>
        </NavLi>
    </NavUl>
</Navbar>
<div class="my-3">
  <div class="flex items-center justify-center">
<Badge class="" rounded large color="red">Disconnected</Badge>
</div>
<slot />
</div>
<div class="min-h-12"/>

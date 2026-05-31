<script lang="ts">
  import { Heading } from "flowbite-svelte";

  const links = [
    { name: "Start icons created by Smashicons - Flaticon", href: "https://www.flaticon.com/free-icons/start" }
  ];
</script>

<div class="mx-auto grid w-full max-w-screen-lg gap-6 px-4 py-4">
  <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <Heading tag="h2" class="mb-4">Used resources</Heading>
    <ul class="space-y-2">
      {#each links as link}
        <li>
          <a class="text-blue-700 hover:underline dark:text-blue-300" href={link.href}>{link.name}</a>
        </li>
      {/each}
    </ul>
  </section>
</div>

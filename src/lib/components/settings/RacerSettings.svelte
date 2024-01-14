<script lang="ts">
  import type Racer from "$lib/_types/racer";
  import { Input, Label, Card, Heading, Select, Button } from "flowbite-svelte";
  import colors from "tailwindcss/colors";
  import { onMount } from "svelte";
  import { type IRacer } from "$lib/_types/interfaces/IRacer";

  export let racer: IRacer;

  let selectedColor: string = racer.color;
  $: {
    racer.color = selectedColor;
    console.log("Selected color: " + selectedColor);
  }

  let colorValues: string[] = [];

  onMount(() => {
    let ignoredColors = ["inherit", "current", "transparent", "black", "white"];
    Object.keys(colors).forEach((key) => {
      if (ignoredColors.includes(key)) {
        return;
      }
      colorValues.push(key);
    });
    console.log(racer.color);
  });

  function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
</script>

<Card class="grid gap-4 mb-6 bg-{racer.color}-400 dark:bg-{racer.color}-600">
  <Heading tag="h3" class="mb-4">{racer.name}</Heading>
  <div>
    <Label for="slot_1_name" class="mb-2">Name</Label>
    <Input
      type="text"
      id="slot_1_name"
      placeholder="Slot 1"
      bind:value={racer.name}
    />
  </div>
  <div>
    <Label for="slot_1_color" class="mb-2">Color</Label>
    <select
      bind:value={racer.color}
      id="slot_1_color"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      {#each colorValues as color (color)}
      {#if racer.color == selectedColor}
        <option value={color} selected>{capitalizeFirstLetter(color)}</option>
        {:else}
        <option value={color} >{capitalizeFirstLetter(color)}</option>
        {/if}
      {/each}
    </select>
  </div>
</Card>

<script lang="ts">
  import type Light from "$lib/_types/light";

  export let lightCol: Light[];
</script>

<div class="light-container">
  {#each lightCol as light}
    <div class="light" style="background: {light.color};"></div>
  {/each}
</div>

<style>
  @media only screen and (min-width: 600px) {
    .light-container {
      width: 100px;
      padding: 0 10px;
      border-radius: 15px;
      background: black;
      margin: 0 5px;
    }

    .light {
      padding-top: 100%;
      border-radius: 50%;
      background: #8080805c;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }

  @media only screen and (max-width: 600px) {
    .light-container {
      width: 60px;
      padding: 0 5px;
      border-radius: 8px;
      background: black;
      margin: 0 3px;
    }

    .light {
      padding-top: 100%;
      border-radius: 50%;
      background: #8080805c;
      margin-bottom: 5px;
      margin-top: 5px;
    }

  }
</style>

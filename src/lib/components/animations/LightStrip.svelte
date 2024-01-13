<script lang="ts">
  import Light from "$lib/_types/light"

  export let lightCol: Light[];
</script>

<div class="light-container">
  {#each lightCol as light}
    <div class="light" style="background: {light.color};"></div>
  {/each}
</div>

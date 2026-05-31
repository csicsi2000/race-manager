<script lang="ts">
  import { isSimulated, sensorSetting } from "$lib/stores/serverStatus";
  import { newRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";
  import {
    manualLaneState,
    autoLapEnabled,
    triggerLanePulse,
    toggleLaneHold,
    blockAllLanes,
    unblockAllLanes,
    startAutoLap,
    stopAutoLap,
  } from "$lib/services/simulator";
  import { Button, Toggle, Badge } from "flowbite-svelte";

  let collapsed = false;

  $: laneCount = $sensorSetting.laneCount || 2;
  $: lanes = $manualLaneState;
  $: activeLaneCount = Math.min($sensorSetting.laneCount || 2, lanes.length);
  $: racers = $newRaceInfo.racers;
  $: statusLabel = RaceStatus[$sessionStatus];

  function getRacerName(index: number): string {
    return racers[index]?.name ?? `Lane ${index + 1}`;
  }
</script>

{#if $isSimulated}
  <div
    class="fixed bottom-28 right-4 z-[9999] w-72 rounded-2xl border border-orange-400 bg-orange-50 dark:bg-gray-900 dark:border-orange-600 shadow-2xl text-sm"
  >
    <!-- Header -->
    <button
      class="w-full flex items-center justify-between px-4 py-2 rounded-t-2xl bg-orange-400 dark:bg-orange-700 text-white font-bold cursor-pointer"
      on:click={() => (collapsed = !collapsed)}
    >
      <span>🛠 Dev Panel</span>
      <span class="text-xs">
        <Badge color="dark" rounded>{statusLabel}</Badge>
        {collapsed ? "▲" : "▼"}
      </span>
    </button>

    {#if !collapsed}
      <div class="p-4 flex flex-col gap-4">
        <!-- Lane Controls -->
        <div>
          <p class="font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Sensor Lanes
          </p>
          <div class="flex flex-col gap-2">
            {#each Array(activeLaneCount) as _, i (i)}
              <div
                class="flex items-center justify-between gap-2 p-2 rounded-lg border {lanes[i]
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                  : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'}"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-full {lanes[i]
                      ? 'bg-green-500'
                      : 'bg-gray-400'}"
                  ></span>
                  <span class="font-medium text-gray-800 dark:text-white text-xs">
                    {getRacerName(i)}
                  </span>
                </div>
                <div class="flex gap-1">
                  <button
                    class="px-2 py-1 text-xs rounded font-semibold transition-colors {lanes[i]
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'}"
                    on:click={() => toggleLaneHold(i)}
                    title="Toggle sensor blocked/unblocked (hold mode)"
                  >
                    {lanes[i] ? "ON" : "OFF"}
                  </button>
                  <button
                    class="px-2 py-1 text-xs rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                    on:click={() => triggerLanePulse(i)}
                    title="Send a quick pulse (simulates car passing over sensor)"
                  >
                    Pulse
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Bulk Controls -->
        <div class="flex gap-2">
          <Button size="xs" color="green" class="flex-1" on:click={blockAllLanes}>
            All ON
          </Button>
          <Button size="xs" color="alternative" class="flex-1" on:click={unblockAllLanes}>
            All OFF
          </Button>
        </div>

        <!-- Auto Lap -->
        <div
          class="flex items-center justify-between p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <span class="text-xs font-medium text-gray-700 dark:text-white"
            >Auto-lap timer</span
          >
          <Toggle
            size="small"
            checked={$autoLapEnabled}
            on:change={() => {
              if ($autoLapEnabled) stopAutoLap();
              else startAutoLap();
            }}
          />
        </div>

        <!-- Info -->
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
          <strong>ON/OFF</strong> = hold sensor blocked (for formation).
          <strong>Pulse</strong> = quick pass (triggers a lap).
        </p>
      </div>
    {/if}
  </div>
{/if}

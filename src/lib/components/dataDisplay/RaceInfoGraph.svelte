<script lang="ts">
  import {
    Chart,
    Card,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { type ApexOptions } from "apexcharts";
  import { onMount } from "svelte";
  import { formatMs } from "$lib/utils/converters/timeConverter";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";

  export let raceInfo: IRaceInfo;

  // --- Helpers ---
  function getLapDurations(racer: typeof raceInfo.racers[0]) {
    const durations: number[] = [];
    for (let i = 0; i < racer.lapTimes.length; i++) {
      const prev = i === 0 ? racer.startMillis : racer.lapTimes[i - 1];
      durations.push(racer.lapTimes[i] - prev);
    }
    return durations;
  }

  function getAvg(arr: number[]) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function getMin(arr: number[]) {
    if (arr.length === 0) return 0;
    return Math.min(...arr);
  }

  function getTotalTime(racer: typeof raceInfo.racers[0]) {
    if (racer.lapTimes.length === 0) return 0;
    return racer.lapTimes[racer.lapTimes.length - 1] - racer.startMillis;
  }

  // --- Chart data ---
  let lapTimesBarOptions: ApexOptions = {};
  let cumulativeLineOptions: ApexOptions = {};
  let positionLineOptions: ApexOptions = {};
  let ready = false;

  // Color palette for racers
  const palette = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"];

  onMount(() => {
    if (!raceInfo?.racers) return;

    const racers = raceInfo.racers;
    const maxLaps = Math.max(...racers.map(r => r.lapTimes.length));
    const lapLabels = Array.from({ length: maxLaps }, (_, i) => `Lap ${i + 1}`);

    // --- 1. Lap Times Bar Chart (side-by-side per lap) ---
    const barSeries = racers.map((racer, ri) => ({
      name: racer.name,
      data: getLapDurations(racer),
      color: palette[ri % palette.length],
    }));

    lapTimesBarOptions = {
      chart: {
        type: "bar",
        height: 350,
        fontFamily: "Inter, sans-serif",
        toolbar: { show: true },
      },
      series: barSeries,
      plotOptions: {
        bar: { horizontal: false, columnWidth: "70%", borderRadius: 3 },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: lapLabels,
        title: { text: "Lap" },
        labels: { style: { cssClass: "text-xs fill-gray-500 dark:fill-gray-300" } },
      },
      yaxis: {
        title: { text: "Lap Time (ms)" },
        labels: {
          formatter: (val: number) => formatMs(Math.round(val)),
          style: { cssClass: "text-xs fill-gray-500 dark:fill-gray-300" },
        },
      },
      tooltip: {
        y: { formatter: (val: number) => formatMs(Math.round(val)) },
      },
      legend: { show: true, position: "top" },
      grid: { strokeDashArray: 4 },
    };

    // --- 2. Cumulative Line Chart ---
    const lineSeries = racers.map((racer, ri) => ({
      name: racer.name,
      color: palette[ri % palette.length],
      data: racer.lapTimes.map((t, idx) => ({
        x: idx + 1,
        y: t - racer.startMillis,
      })),
    }));

    cumulativeLineOptions = {
      chart: {
        type: "line",
        height: 350,
        fontFamily: "Inter, sans-serif",
        toolbar: { show: true },
        zoom: { type: "x", enabled: true, autoScaleYaxis: true },
      },
      series: lineSeries,
      stroke: { width: 3, curve: "straight" },
      markers: { size: 4 },
      xaxis: {
        type: "numeric",
        title: { text: "Lap" },
        labels: {
          formatter: (val: string) => `${Math.round(Number(val))}`,
          style: { cssClass: "text-xs fill-gray-500 dark:fill-gray-300" },
        },
      },
      yaxis: {
        title: { text: "Total Time" },
        labels: {
          formatter: (val: number) => formatMs(Math.round(val)),
          style: { cssClass: "text-xs fill-gray-500 dark:fill-gray-300" },
        },
      },
      tooltip: {
        y: { formatter: (val: number) => formatMs(Math.round(val)) },
      },
      legend: { show: true, position: "top" },
      grid: { strokeDashArray: 4 },
    };

    // --- 3. Position Over Time Chart ---
    // For each lap, compute positions based on cumulative time
    if (maxLaps > 0) {
      const positionSeries = racers.map((racer, ri) => {
        const positions: { x: number; y: number }[] = [];
        for (let lap = 0; lap < racer.lapTimes.length; lap++) {
          // Who was ahead at this lap?
          const timesAtLap = racers
            .filter(r => r.lapTimes.length > lap)
            .map(r => ({
              name: r.name,
              time: r.lapTimes[lap] - r.startMillis,
              laps: r.lapTimes.length,
            }))
            .sort((a, b) => {
              // More laps = better; if equal laps, less time = better
              if (a.laps !== b.laps) return b.laps - a.laps;
              return a.time - b.time;
            });
          const pos = timesAtLap.findIndex(t => t.name === racer.name) + 1;
          positions.push({ x: lap + 1, y: pos });
        }
        return {
          name: racer.name,
          color: palette[ri % palette.length],
          data: positions,
        };
      });

      positionLineOptions = {
        chart: {
          type: "line",
          height: 300,
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
        },
        series: positionSeries,
        stroke: { width: 3, curve: "smooth" },
        markers: { size: 4 },
        xaxis: {
          type: "numeric",
          title: { text: "Lap" },
          labels: {
            formatter: (val: string) => `${Math.round(Number(val))}`,
            style: { cssClass: "text-xs fill-gray-500 dark:fill-gray-300" },
          },
        },
        yaxis: {
          reversed: true,
          title: { text: "Position" },
          min: 1,
          max: racers.length,
          tickAmount: racers.length - 1,
          labels: {
            formatter: (val: number) => `P${Math.round(val)}`,
            style: { cssClass: "text-xs fill-gray-500 dark:fill-gray-300" },
          },
        },
        legend: { show: true, position: "top" },
        grid: { strokeDashArray: 4 },
      };
    }

    ready = true;
  });
</script>

{#if raceInfo}
  <div class="grid gap-6">
    <!-- Summary Table -->
    <Card size="xl" class="border border-gray-300 dark:border-gray-700">
      <h3 class="text-lg font-bold mb-3 dark:text-white">Race Summary</h3>
      <Table striped hoverable>
        <TableHead>
          <TableHeadCell>Racer</TableHeadCell>
          <TableHeadCell class="text-right">Laps</TableHeadCell>
          <TableHeadCell class="text-right">Best Lap</TableHeadCell>
          <TableHeadCell class="text-right">Avg Lap</TableHeadCell>
          <TableHeadCell class="text-right">Total Time</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each raceInfo.racers as racer}
            {@const durations = getLapDurations(racer)}
            <TableBodyRow>
              <TableBodyCell class="font-semibold">{racer.name}</TableBodyCell>
              <TableBodyCell class="text-right tabular-nums">{racer.lapTimes.length}</TableBodyCell>
              <TableBodyCell class="text-right tabular-nums font-bold text-green-600 dark:text-green-400">
                {durations.length > 0 ? formatMs(getMin(durations)) : "—"}
              </TableBodyCell>
              <TableBodyCell class="text-right tabular-nums">
                {durations.length > 0 ? formatMs(Math.round(getAvg(durations))) : "—"}
              </TableBodyCell>
              <TableBodyCell class="text-right tabular-nums">
                {getTotalTime(racer) > 0 ? formatMs(getTotalTime(racer)) : "—"}
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </Card>

    <!-- Lap Times Bar Chart -->
    {#if ready}
      <Card size="xl" class="border border-gray-300 dark:border-gray-700">
        <h3 class="text-lg font-bold mb-3 dark:text-white">Lap Times Comparison</h3>
        <Chart options={lapTimesBarOptions} />
      </Card>

      <!-- Cumulative Time Line Chart -->
      <Card size="xl" class="border border-gray-300 dark:border-gray-700">
        <h3 class="text-lg font-bold mb-3 dark:text-white">Cumulative Race Progress</h3>
        <Chart options={cumulativeLineOptions} />
      </Card>

      <!-- Position Chart (only meaningful for races with 2+ racers) -->
      {#if raceInfo.racers.length >= 2 && positionLineOptions.series}
        <Card size="xl" class="border border-gray-300 dark:border-gray-700">
          <h3 class="text-lg font-bold mb-3 dark:text-white">Position Over Time</h3>
          <Chart options={positionLineOptions} />
        </Card>
      {/if}
    {/if}
  </div>
{/if}

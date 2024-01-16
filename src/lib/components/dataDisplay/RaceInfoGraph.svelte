<script lang="ts">
  import {
    Chart,
    Card,
    A,
    Button,
    Dropdown,
    DropdownItem,
    Popover,
  } from "flowbite-svelte";
  import {
    InfoCircleSolid,
    ChevronRightSolid,
    ChevronDownSolid,
    FileLinesSolid,
  } from "flowbite-svelte-icons";
  import  { type ApexOptions } from "apexcharts";
  import { onMount } from "svelte";
  import { formatMs } from "$lib/utils/converters";
  import { type IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
  import type { RaceInfo } from "$lib/_types/raceInfo";
  import { RaceStatus } from "$lib/_types/enums/raceStatus";

  export let raceInfo: IRaceInfo;

  let chartSeries: any[] = [];
  let lapCounts: string[] = [];

  function formatTime(duration:number):string{
    var milliseconds = Math.floor((duration % 1000) / 100);
    let seconds: number |string = Math.floor((duration / 1000) % 60);
    let minutes: number |string = Math.floor((duration / (1000 * 60)) % 60);
    let hours: number |string = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + "." + minutes + "." + seconds + "." + milliseconds;
  }
  onMount(() => {
    let laps = raceInfo.lapCount;
    if(raceInfo.raceStatus == RaceStatus.PRACTICE){
        laps = Math.max(raceInfo.racers[0].lapTimes.length,raceInfo.racers[1].lapTimes.length)
    }
    for(let i = 1; i <= laps; i++){
        lapCounts.push(String(i));
    }
    raceInfo.racers.forEach((racer) => {
        let times:any[] = [];

        racer.lapTimes.forEach((time, index) => {
            let formattedTime = String(time - raceInfo.startMillis);
            times.push(
                {
                    x: index,
                    y: formattedTime
                });   
        });

      chartSeries.push({
        name: racer.name,
        data: times
      });
    });
});

  let options: ApexOptions = {
    chart: {
        id: "mainChart",
      height: "400px",
      width: "100%",
      type: "line",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: true,
      },
      toolbar: {
        autoSelected: 'pan',
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "straight",
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -26,
      },
    },
    series: chartSeries,
    legend: {
      show: true,
    },
    xaxis: {
      //categories: lapCounts,
      title:{
        text: "Lap Count"
      },
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-100",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      title:{
        text: "Time"
      },
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-100",
        },
      },
    },
  };




</script>

<Card size="xl">
  <Chart {options} />
</Card>

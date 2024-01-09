<script lang="ts">
    import Light from '$lib/_types/light';
import { LightColors } from "$lib/_types/enums/LightColors";
    import LightStrip from '$lib/components/animations/LightStrip.svelte';
  import { Button } from 'flowbite-svelte';
  import { LightStates } from '$lib/_types/enums/LightStates';
  import {base} from "$app/paths";

    const LIGHT_ON_INTERVAL = 1000;
  
    let state = LightStates.IDLE;
    let nextLightStrip = 0;
    let result = '00.000';
    let startTime : number ;
    let timerId : number | undefined;
    let fuzzerId : number | undefined;
    let best = localStorage.best || 0;

    let lights : Light[][] = [];

    let audioStartLights = new Audio(base+'/sounds/F1-Start-light-sound.mp3');
    let audioLightsOut = new Audio(base+'/sounds/lights-out.mp3')

    for(let i = 0; i < 5; i++){
        lights.push([])
        for(let j = 0; j < 4; j++){
            lights[i].push(new Light(j));
        }
    }

    console.log(lights)
  
    //#region Start race

    function clickStartRace() {
      if (state === LightStates.RUNNING) {
        state = LightStates.IDLE;
        result = 'JUMP START!';
        audioStartLights.pause();
        clearInterval(timerId);
        clearTimeout(fuzzerId);
      } else if (state === LightStates.WAITING) {
        state = LightStates.IDLE;
        const timeDiff = Date.now() - startTime;
        result = format(timeDiff);
        best = best === 0 ? timeDiff : Math.min(best, timeDiff);
        localStorage.best = best;
      }
      else{
        clearLights();
        state = LightStates.RUNNING;
        start();
      }
    }
  
    function start() {
      nextLightStrip = 0;
      result = '00.000';
      startTime = -1;
      clearLights();
      audioStartLights.play();
      turnOnNextLight();
      timerId = setInterval(() => turnOnNextLight(), LIGHT_ON_INTERVAL);
    }
  
    function turnOnNextLight() {
      if (nextLightStrip === 5) {
        fuzzedLightsOut();
        clearInterval(timerId);
      } else {
        lights[nextLightStrip][2].color = LightColors.red;
        lights[nextLightStrip][3].color = LightColors.red;
        nextLightStrip += 1;
      }
    }
  
    function fuzzedLightsOut() {
      // delay for the lights
      const fuzzyInterval = Math.random() * 2800 + 200;
      fuzzerId = setTimeout(() => {
        clearLights();
        startTime = Date.now();
        state = LightStates.WAITING;
        audioLightsOut.play();
      }, fuzzyInterval);
    }
  
    //#endregion
    
    //#region Formation lap
    function formationLights(){
      clearLights();
      lights.forEach((col) => 
      {
        col[1].color = LightColors.green;
      })
      state = LightStates.FORMATION;
      
    }
    //#endregion

    function clearLights() {
      clearInterval(timerId);
      clearTimeout(fuzzerId);
      audioStartLights.pause();
      audioStartLights.currentTime = 0;
      audioLightsOut.pause();
      audioLightsOut.currentTime = 0;
      lights.forEach((col) => 
      {
        col.forEach((light) =>{
          light.color = LightColors.off;
        })
    });
    }
  

    function format(ms : number) {
      const secs = (ms / 1000).toFixed(3);
      return `${(parseInt(secs) < 10 ? '0' : '') + secs}`;
    }
  </script>
  
  <style>
    #app {
      height: 100%;
      width: 100%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
    }
  
    #lights-container {
      position: relative;
      display: flex;
      flex-direction: row;
    }
  
    #connector {
      position: absolute;
      background: black;
      height: 3%;
      top: 50%;
      width: 80%;
      left: 10%;
      z-index: -1;
    }
  
    @media only screen and (max-width: 600px) {
      .help {
        width: 90%;
        text-align: center;
      }
  
      .time {
        font-size: 3.5rem;
        font-weight: 300;
        line-height: 1.2;
      }
    }
  
    @media only screen and (min-width: 600px) {
      .time {
        font-size: 5.5rem;
        font-weight: 300;
        line-height: 1.2;
      }
    }
  </style>
  

  <div id="app">
    <div class="help">
      <p>
        <em>
          Click or tap anywhere on the screen to start. Click again when lights
          go off.
        </em>
      </p>
    </div>
  
    <div id="lights-container">
      <div id="connector"></div>
      {#key state}
        {#each lights as lightCol}
            <LightStrip bind:lightCol />
        {/each}
      {/key}
    </div>
  
    <h1 class="time">{result !== null ? result : ''}</h1>
    <div>Your best: {format(best)}</div>

    <Button color="green" pill  on:click={formationLights}>Start Formation</Button>
    <Button pill  on:click={clickStartRace}>Start Race</Button>
  </div>
  
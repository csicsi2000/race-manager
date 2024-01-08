<script lang="ts">
    import Light from '$lib/_types/light';
    import LightStrip from '$lib/components/animations/LightStrip.svelte';
  
    const IDLE = 'idle';
    const RUNNING = 'running';
    const WAITING = 'waiting';
    const LIGHT_ON_INTERVAL = 1000;
  
    let state = IDLE;
    let nextLightStrip = 0;
    let result = '00.000';
    let startTime : number ;
    let timerId : number | undefined;
    let fuzzerId : number | undefined;
    let best = localStorage.best || 0;

    let lights : Light[][] = [];

    for(let i = 0; i < 5; i++){
        lights.push([])
        for(let j = 0; j < 4; j++){
            lights[i].push(new Light(j));
        }
    }

    console.log(lights)
  
    function start() {
      nextLightStrip = 0;
      result = '00.000';
      startTime = -1;
      clearLights();
      turnOnNextLight();
      timerId = setInterval(() => turnOnNextLight(), LIGHT_ON_INTERVAL);
    }
  
    function turnOnNextLight() {
      if (nextLightStrip === 5) {
        fuzzedLightsOut();
        clearInterval(timerId);
      } else {
        lights[nextLightStrip][2].on = true;
        lights[nextLightStrip][3].on = true;
        nextLightStrip += 1;
      }
    }
  
    function fuzzedLightsOut() {
      const fuzzyInterval = Math.random() * 1800 + 2400;
      fuzzerId = setTimeout(() => {
        clearLights();
        startTime = Date.now();
        state = WAITING;
      }, fuzzyInterval);
    }
  
    function clearLights() {
      lights.forEach((l) => 
      {
        l[2].on = false;
        l[3].on = false;
    });
    }
  
    function onClick() {
      if (state === RUNNING) {
        state = IDLE;
        result = 'JUMP START!';
        clearInterval(timerId);
        clearTimeout(fuzzerId);
      } else if (state === IDLE) {
        state = RUNNING;
        start();
      } else if (state === WAITING) {
        state = IDLE;
        const timeDiff = Date.now() - startTime;
        result = format(timeDiff);
        best = best === 0 ? timeDiff : Math.min(best, timeDiff);
        localStorage.best = best;
      }
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
  
  
  <div id="app" on:click={onClick}>
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
  </div>
  
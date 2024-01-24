<script lang="ts">
  import { P } from "flowbite-svelte";
  import qrcode from "qrcode-generator";
  import { onMount } from "svelte";

  export let displayedText: string;

  let qrCodeDiv: HTMLElement;

  $: {
      if(qrCodeDiv){
    console.log("Displayed text: " + displayedText);
    let code = qrcode(0, "M");
    code.addData(displayedText);
    code.make();
    qrCodeDiv.innerHTML = code.createSvgTag(4);}
  }
</script>
<div class="grid justify-items-center">
    <P  class="items-center">Scan to share</P>
<div id="qr" bind:this={qrCodeDiv} class="content-center flex justify-center"/>
</div>

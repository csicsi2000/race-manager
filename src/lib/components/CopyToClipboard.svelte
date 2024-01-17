<script lang="ts">
    import {ClipboardOutline} from "flowbite-svelte-icons";
    import {Toast} from "flowbite-svelte";

    export let textToCopy:string;


    let open = false;
    function copy() {
        open = true;
        navigator.clipboard.writeText(textToCopy);
        setTimeout(() => {
            open = false;
        }, 2000)
    }
</script>

<div class="cursor-pointer bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded" role="button" tabindex="0" on:click={copy} on:keydown={e => e.key === "Enter" && copy}>
    <slot>
        <ClipboardOutline size="md" class="text-primary-400 text-inherit"/>
    </slot>
</div>
<div class="absolute">
    <Toast bind:open>
        <span class="font-semibold">{textToCopy}</span> has been copied to your clipboard
    </Toast>
</div>


import type { SvelteComponent } from "svelte";

export function scrollToBottom(node:HTMLElement){
    const scroll = () => node.scroll({
        top: node.scrollHeight,
        behavior: 'smooth',
    });
    scroll();
    console.log("Scrolling to bottom " )
    return { update: scroll }
};
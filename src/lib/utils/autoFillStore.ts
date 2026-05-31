import type { Writable } from "svelte/store";

export default function autoFillStore<T>(store: Writable<T[]>, _endpoint: string) {
    store.set([]);
    return () => undefined;
}

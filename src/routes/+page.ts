import { connectedIP } from '$lib/stores/serverStatus';
import type { PageLoad } from './$types';

export const load = (async ({params,url}) => {
    let serverAddress = url.searchParams.get("server");
    console.log(serverAddress);
    connectedIP.set(serverAddress);
    return {};
}) satisfies PageLoad;
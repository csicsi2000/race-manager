import { connectedSensorIP } from '$lib/stores/serverStatus';
import { getSavedSensorIp } from '$lib/utils/localSettings';
import type { PageLoad } from './$types';

export const load = (async ({ params, url }) => {
    let serverAddress = url.searchParams.get("server");
    console.log(serverAddress);
    if (serverAddress) {
        connectedSensorIP.set(serverAddress);
    }
    else{
        getSavedSensorIp();
    }
    return {};
}) satisfies PageLoad;
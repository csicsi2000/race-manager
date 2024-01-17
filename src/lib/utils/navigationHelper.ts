import { goto } from '$app/navigation';
import { PageRoutes } from '$lib/_types/enums/pageRoutes';

export function routeToPage(route: PageRoutes, replaceState: boolean) {
    console.log(route)
   goto(`${route}`, { replaceState }) 
}
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { PageRoutes } from '$lib/_types/enums/pageRoutes';

export function routeToPage(route: PageRoutes, replaceState: boolean = true) {
    console.log(route)
   goto(`${base}${route}`, { replaceState }) 
}
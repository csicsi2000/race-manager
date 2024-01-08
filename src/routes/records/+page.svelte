<script lang="ts">
    import {
        Alert,
        Card, Heading,
        Sidebar,
        SidebarGroup,
        SidebarItem,
        SidebarWrapper
    } from 'flowbite-svelte'
    import {fade} from "svelte/transition";
    import viewportObserver from "$lib/utils/viewportObserver";
    import Sleep from "$lib/utils/sleep";
    import {ExclamationCircleSolid} from "flowbite-svelte-icons";

    let functionalInView = false;
    const isVisible = (val:boolean) => {
        functionalInView = val
    }

</script>
<div class="block">
    <div class="flex flex-row gap-5">
        <div class="!w-64 flex-shrink-0 relative bg-gray-50 dark:bg-gray-800">
            <Sidebar divClass="w-64 h-full " class="fixed bottom-[72px] top-[72px] bg-transparent dark:bg-transparent">
                <SidebarWrapper>
                    <SidebarGroup>
                        <SidebarItem label="Setup" href="#setup"/>
                        <SidebarItem label="Resources" href="#resources"/>
                        <SidebarItem label="Colors" href="#colors"/>
                        <SidebarItem label="Icons" href="#icons"/>
                    </SidebarGroup>
                </SidebarWrapper>
            </Sidebar>
        </div>

        <section class="flex-1 xl:max-w-screen-lg mr-5 3xl:mr-12">
            <Card class="min-w-full">

                <article class="format lg:format-lg dark:format-invert ">
                    <h1>REtech starter kit</h1>
                    <Alert color="green" class="flex gap-3">
                        <ExclamationCircleSolid/>
                        Now for svelte kit 2!
                    </Alert>
                    <p class="lead">This template is meant to jump start svelte kit app development with customization
                        in mind</p>
                    <p>The package includes a complete setup of svelte-flowbite, flowbite-icons, functional utilities,
                        and customization functionality.</p>
                </article>

            </Card>
            
        </section>
    </div>
</div>

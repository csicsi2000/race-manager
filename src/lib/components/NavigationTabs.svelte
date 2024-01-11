<script>
    import { Tabs, TabItem } from 'flowbite-svelte';
  import RacersSettings from './tabItems/RaceManagement.svelte';
  import Dashboard from './tabItems/Dashboard.svelte';
  </script>
  
  <Tabs style="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700 m-6">
    <TabItem class="w-full" open>
      <span slot="title">Dashboard</span>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        <Dashboard/>
      </p>
    </TabItem>
    <TabItem class="w-full">
        <span slot="title">Settings</span>
        <div class="w-4/5 lg:max-w-screen-lg mx-auto">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        <RacersSettings></RacersSettings>
      </p>
      </div>
    </TabItem>
  </Tabs>
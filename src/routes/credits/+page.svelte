
<script>
    import { Listgroup, Heading } from 'flowbite-svelte';
    let links = [
        { name: 'Start icons created by Smashicons - Flaticon', href: 'https://www.flaticon.com/free-icons/start'}
    ];
  </script>
  <div class="grid gap-6 w-4/5 lg:max-w-screen-lg mx-auto">
   <Heading>Used resources</Heading>
  <Listgroup active items={links} let:item class="w-100">
    {item.name}
  </Listgroup>
</div>
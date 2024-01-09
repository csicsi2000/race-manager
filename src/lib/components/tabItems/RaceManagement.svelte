<script lang="ts">
  import { RaceStatus } from '$lib/_types/enums/raceStatus';
    import { Input, Label,Card, Heading,Select } from 'flowbite-svelte';

    let raceStates: any[] = [];
    let selectedState: RaceStatus = RaceStatus.PRACTICE;

    for(let state in RaceStatus){
      if (!isNaN(Number(state))) {
        continue;
      }
      raceStates.push({
        name: state
      })
    }
  </script>
  
  <form>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      <Card class="grid gap-6 mb-6">
        <Heading tag="h2" class="mb-4">Slot 1</Heading>
        <div>
          <Label for="slot_1_name" class="mb-2">Name</Label>
          <Input type="text" id="slot_1_name" placeholder="Slot 1" />
        </div>
        <div>
          <Label for="slot_1_color" class="mb-2">Color</Label>
          <input type="color" id="favcolor" name="slot_1_color" value="#FFFFFF">
        </div>

      </Card>
      <Card class="grid gap-6 mb-6">
        <Heading tag="h2" class="mb-4">Slot 2</Heading>
        <div>
          <Label for="slot_2_name" class="mb-2">Slot 2 Name</Label>
          <Input type="text" id="slot_2_name" placeholder="Slot 2"/>
        </div>
        <div>
          <Label for="slot_2_color" class="mb-2">Color</Label>
          <input type="color" id="favcolor" name="slot_2_color" value="#FFFFFF">
        </div>

      </Card>
    </div>
    <div class="grid gap-6 mb-6">
      <div>
        <Label for="slot_2_name" class="mb-2">Race Lap Count</Label>
        <Input type="number" id="slot_2_name" placeholder="10"/>
      </div>
    </div>
</form>
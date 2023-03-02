<!-- MyComponent.svelte -->
<script>
  import localforage from 'localforage';
	import {onMount} from 'svelte';

  // Define a default value for the data
  let data = { name: 'John', age: 30 };
	localforage.setDriver(localforage.LOCALSTORAGE);

  // Load the data from local storage when the component is mounted
  onMount(async () => {
    try {
      const storedData = await localforage.getItem('myData');
      if (storedData) {
        data = storedData;
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Save the data to local storage when it changes
  $: {
    try {
      localforage.setItem('myData', data);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<!-- Display the data -->
<div>
  <p>Name: {data.name}</p>
  <p>Age: {data.age}</p>
</div>
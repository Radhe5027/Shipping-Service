<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map, Marker } from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';

  export let latitude = 0;
  export let longitude = 0;

  let map;
  let mapContainer;
  const apiKey = 'MUcK4rAEnjC41dOkSD2Y';

  onMount(() => {
    map = new Map({
      container: mapContainer,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [longitude, latitude],
      zoom: 14,
    });

    new Marker({ color: '#FF0000' })
      .setLngLat([longitude, latitude])
      .addTo(map);
  });

  onDestroy(() => {
    map.remove();
  });
</script>

<div class="map-wrap">
  <div class="map" bind:this={mapContainer}></div>
</div>

<style>
  .map-wrap {
    width: 100%;
    height: 500px;
    position: relative;
  }

  .map {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <choropleth
    :map-data="{ VA: 100, MD: 150, DC: 200 }"
    :center="[37.43, -78.66]"
    :zoom="6"
    :colors="'Greens'"
    :num-classes="3"
  ></choropleth>
</template>

<script>
import Choropleth from "./Choropleth";

export default {
  name: "ChoroplethExample",
  components: {
    Choropleth
  }
};
</script>

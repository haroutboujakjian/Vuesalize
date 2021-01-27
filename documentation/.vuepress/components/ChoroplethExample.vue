<template>
  <choropleth
    :geographies="geographies"
    :map-data="{ VA: 100, MD: 150, DC: 200 }"
    :center="[37.43, -78.66]"
    :zoom="6"
    :num-colors="3"
  ></choropleth>
</template>

<script>
import Choropleth from "./Choropleth";
import stateGeographies from "./state-geographies.json";

export default {
  name: "ChoroplethExample",
  components: {
    Choropleth
  },
  data() {
    return {
      geographies: stateGeographies
    };
  }
};
</script>

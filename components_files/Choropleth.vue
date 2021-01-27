<template>
  <div ref="Choropleth">
    <div id="mapContainer">
      <div class="leaflet-control-container" v-if="!hideLegend && max">
        <div class="leaflet-bottom leaflet-right">
          <div
                  class="info legend leaflet-control"
                  style="margin-bottom: 25px;"
                  v-if="min + 1 !== max"
          >
            <div v-for="index in localNumColors" :key="index">
              <i
                      v-bind:style="{
                  background: colorScale[index - 1]
                }"
              ></i>
              {{
              Math.floor(min + ((index - 1) * (max - min)) / localNumColors) + 1
              }}
              -
              {{ Math.floor(min + (index * (max - min)) / localNumColors) }}
            </div>
          </div>
          <div
                  class="info legend leaflet-control"
                  style="margin-bottom: 25px;"
                  v-if="min + 1 === max"
          >
            <i
                    v-bind:style="{
                background: colorScale[localNumColors - 1]
              }"
            ></i>
            {{ max }}
          </div>
        </div>
      </div>
      <div
              v-if="tooltip"
              class="info legend tooltip"
              :style="{ left: tooltip.x, top: tooltip.y }"
      >
        <h4>{{ tooltip.code }}</h4>
        {{ mapData[tooltip.code] }}
      </div>
    </div>
  </div>
</template>

<script>
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import * as colorbrewer from "colorbrewer";
  import { min, max } from "d3-array";

  export default {
    name: "Choropleth",
    props: {
      geographies: { type: Object, require: true },
      mapData: { type: Object, required: true },
      colors: String, // colorbrewer scale
      numColors: Number,
      hideLegend: Boolean,
      center: Array,
      tileURL: String,
      zoom: Number
    },
    data() {
      return {
        map: null,
        stateLayer: null,
        tooltip: null
      };
    },
    computed: {
      localNumColors() {
        return this.numColors ? this.numColors : 5;
      },
      colorScale() {
        return (this.colors
                ? colorbrewer[this.colors][this.localNumColors + 1]
                : colorbrewer.Blues[this.localNumColors + 1]).slice(1);
      },
      min() {
        return min(Object.keys(this.mapData), d => this.mapData[d]) - 1;
      },
      max() {
        return max(Object.keys(this.mapData), d => this.mapData[d]);
      }
    },
    watch: {
      mapData: {
        handler() {
          this.updateMapColors();
        }
      }
    },
    mounted() {
      let self = this;

      // create map and add state layer
      self.map = L.map("mapContainer", {
        center: self.center ? self.center : [38, -95.1],
        zoom: self.zoom ? self.zoom : 5,
        zoomControl: false,
        maxZoom: 10,
        minZoom: 3
      });
      L.tileLayer(self.tileURL ? self.tileURL :
              "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      ).addTo(self.map);

      self.geographiesLayer = L.geoJson(self.geographies, {
        onEachFeature: function(feature, layer) {
          layer.on({
            mousemove: d => {
              self.tooltip = self.mapData[d.target.feature.properties.code]
                      ? {
                        x: d.originalEvent.layerX + "px",
                        y: d.originalEvent.layerY + 25 + "px",
                        code: d.target.feature.properties.code
                      }
                      : null;
            },
            mouseout: () => {
              self.tooltip = null;
            }
          });
        }
      });

      self.geographiesLayer.addTo(self.map);

      self.updateMapColors();
    },
    methods: {
      getColor(state) {
        for (let i = 0; i < this.localNumColors; i++) {
          if (
                  this.mapData[state] <=
                  this.min + ((i + 1) * (this.max - this.min)) / this.localNumColors
          )
            return i;
        }
        return -1;
      },

      updateMapColors() {
        let self = this;
        self.geographiesLayer.setStyle(d => {
          return {
            fillColor: self.mapData[d.properties.code]
                    ? self.colorScale[self.getColor(d.properties.code)]
                    : "none",
            weight: 1,
            opacity: 1,
            color: "darkgrey",
            fillOpacity: 0.7
          };
        });
      }
    }
  };
</script>

<style>
  #mapContainer {
    width: 100%;
    height: 100%;
  }

  .info {
    padding: 6px 8px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }

  .info h4 {
    margin: 0 0 5px;
    color: #777;
  }

  .legend {
    text-align: left;
    line-height: 18px;
    color: #555;
  }

  .legend-section label {
    margin-right: 5px;
    font-weight: bold;
  }

  .legend i {
    width: 18px;
    height: 18px;
    float: left;
    margin-right: 8px;
    opacity: 0.7;
  }

  .tooltip {
    z-index: 10000;
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
  }

</style>

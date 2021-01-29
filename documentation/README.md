# Directory of Components

## Installation

## Introduction

This directory contains chart components and other basic components used in building interactive visualizations on the
web. The charts are built using a combination of [Vue.js](https://vuejs.org/v2/guide/) and [D3.js](https://d3js.org/).
The main rationale for this approach is to move the SVG definitions to the template (HTML) and let Vue actually control
creating/destroying elements on the page. This is analogous to the "enter/update/exit" strategy used in D3 but without
all of the pain. Additionally, the scales that control the layouts points, bar, axes, etc. are used in computed
properties in Vue. This allows for automatic updating of the chart purely based on changes in the data without having to
define an additional function to handle updates. A full explanation of the method used can be
found [here](./rationale.md)

## Charts

### Hierarchical Edge Bundling

<div style="display: flex; justify-content: center">
    <hierarchical-edge-bundling-example></hierarchical-edge-bundling-example>
</div>

#### Props

| Name            | Required             | Type     | Default | Description                                               |
|--               | :------------------: | -------  | --      |                                                         --|
| `plotdata`      | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `width`         | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`        | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `radial-margin` |                      | `Number` | 70      | margin (in pixels) between the text label and edge of svg |

#### Events Emitted

#### Example

```html
<template>
    <HierarchicalEdgeBundling :plotdata="plotdata"
                              :width="600"
                              :height="600">
    </HierarchicalEdgeBundling>
</template>

<script>
import HierarchicalEdgeBundling from "./HierarchicalEdgeBundling";
import HEBdata from "./HierarchicalEdgeBundlingData.json"

export default {
    name: "HierarchicalEdgeBundlingExample",
    components: {HierarchicalEdgeBundling},
    data() {
        return {
            plotdata: HEBdata
        }
    }
}
</script>
```

### Grouped Bar Chart

Grouped bar charts are useful in comparing values together in and between groups.

<div style="display: flex; justify-content: center">
    <grouped-bar-chart-example></grouped-bar-chart-example>
</div>

#### Props

| Name            | Required             | Type     | Default | Description                                               |
|--               | :------------------: | -------  | --      |                                                         --|
| `plotdata`      | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `width`         | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`        | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `colors`        |  :heavy_check_mark:  | `Array`  |         | array of colors used for each bar, must match number of bar in a group   |

#### Events Emitted

#### Example

```html
<template>
    <GroupedBarChart :plotdata="plotdata"
                     :width="500"
                     :height="300"
                     :colors="['#F8CBAD', '#C5E0B4', '#BDD7EE', '#D5B8EA']">
    </GroupedBarChart>
</template>

<script>
import GroupedBarChart from "./GroupedBarChart";
import GBCdata from "./GroupedBarChartData.json"

export default {
    name: "GroupedBarChartExample",
    components: {
        GroupedBarChart
    },
    data() {
        return {
            plotdata: GBCdata
        }
    }
}
</script>

<style scoped>
</style>
```

### Stacked Bar Chart

### Donut Chart

### Scatter Plot

### Network

### Choropleth

[Leaflet](https://leafletjs.com/) is an open-source JavaScript library for creating interactive maps. One common
visualization that leverages Leaflet is a choropleth, which involves coloring different geographic areas based on some
statistic associated with the area.

#### Example

```html

<template>
    <choropleth
        :geographies="geographies"
        :map-data="{ VA: 100, MD: 150, DC: 200 }"
        :center="[37.43, -78.66]"
        :zoom="6"
        :colors="'Greens'"
        :num-classes="3"
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
```

[comment]: <> (<choropleth-example style="width: 100%; height: 300px"></choropleth-example>)

#### Props

| Name          | Required             | Type      | Default                                      | Description                                                                                      |
|--             | :------------------: | -------   | -------------------------------------------- |                                                                                                --|
| `geographies` | :heavy_check_mark:   | `Object`  |                                              | [GeoJSON](https://geojson.org/) definition of the geographical regions to be outlined in the map |
| `map-data`    | :heavy_check_mark:   | `Object`  |                                              | Object mapping geography codes to values                                                         |
| `center`      | :heavy_check_mark:   | `Array`   | `[38, -95.1]`                                | Two-dimensional Array containing the latitude and longitude of the center of the map display     |
| `zoom`        |                      | `Number`  | `5`                                          | Number between 3 and 10 specifying the default zoom level                                        |
| `colors`      |                      | `String`  | `Blues`                                      | [Color Brewer](https://colorbrewer2.org) color scheme name                                       |
| `num-classes` |                      | `Number`  | `5`                                          | The number of different colors in the color scale                                                |
| `tile-url`    |                      | `String`  | ArcGIS Light Grey Tiles                      | URL of the desired Leaflet tile layer                                                            |
| `hide-legend` |                      | `Boolean` | `false`                                      | Hides the legend in the lower right corner                                                       |                                             |

## Additional useful components

### Basic Legend

The legend component takes in a json object with key value pairs in the form of label:color. This will generate a simple
legend like the one below.

```json
{
  "first": "black",
  "second": "blue"
}
```

<base-legend v-bind:legend-data="{'first': 'black', 'second': 'blue'}"></base-legend>

### Loading Spinner

The loading spinner is useful when data is being fetched from an API and there is some lag before the GUI receives it.

<div style="display: flex; justify-content: center">
<loader-spinning></loader-spinning>
</div>



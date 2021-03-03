# Directory of Components


## Introduction

This directory contains chart components and other basic components used in building interactive visualizations on the
web. The charts are built using a combination of [Vue.js](https://vuejs.org/v2/guide/) and [D3.js](https://d3js.org/).
The main rationale for this approach is to move the SVG definitions to the template (HTML) and let Vue actually control
creating/destroying elements on the page. This is analogous to the "enter/update/exit" strategy used in D3 but without
all of the pain. Additionally, the scales that control the layouts points, bar, axes, etc. are defined as computed
properties in Vue. This allows for automatic updating of the chart purely based on changes in the data without having to
define an additional function to handle updates. A full explanation of the methods used can be
found [here](./rationale.md)

## Installation

Any Vue.js based project will be able to take advantage of this library.

Install info coming soon... but in the meantime, the components can be retrieved from [gitlab](https://gitlab.mitre.org/full-stack-interactive-visualizations/components/-/tree/master/documentation/.vuepress/components)

## Charts


### Stacked Bar Chart

Occasionally, it's easier to compare groups by stacking them in one bar. Here is a simple example that constructs a
stacked bar chart

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example></stacked-bar-chart-example>
</div>

```html
<template>
    <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" :x_key="'date'"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </StackedBarChart>
</template>

<script>
import StackedBarChart from "./StackedBarChart";
import SBCdata from './BarChartData.json'

export default {
    name: "StackedBarChartExample",
    components: {
        StackedBarChart
    },
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>
```

In order for the stacked bar chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `BarChartData.json` data file that populates
the example grouped bar chart has "date" for the x value, and "Veteran's Benefit Administration",
"Veteran's Health Administration", and "National Cemetery Administration" for the y values. Both the grouped bar chart
and stacked bar chart use the same data format for input.

```json
[
  {
    "date": "2019",
    "Veteran's Benefit Administration": 5921,
    "Veteran's Health Administration": 1026,
    "National Cemetery Administration": 2324
  },
  {
    "date": "2020",
    "Veteran's Benefit Administration": 1539,
    "Veteran's Health Administration": 1560,
    "National Cemetery Administration": 1257
  }, ...
]
```

#### Props

| Name         | Required             | Type     | Default | Description                                               |
|--            | :------------------: | -------  | --      |                                                         --|
| `plotdata`   | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `x_key`     |  :heavy_check_mark:   | `String` |         | string that is the key of the x value in plotdata        |
| `width`      | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`     | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `colors`     |  :heavy_check_mark:  | `Array`  |         | array of colors used for each bar, must match number of bar in a group|
| `margin`     |                      | `Object` |         | object that contains the top, bottom, right, and left margins|
|`enable_tooltip`|                    |`Boolean` | True    | Turn default tooltip on or off                               |

#### Events Emitted

| Event        | Location          | Value Emitted    |  Description                                                                      |
|--            | --------          |------          |                                                                                 --|
| `click`      |   Rectangle       | `Object`          |  `x_label`, `y_label`, `x_value`, and `y_value` of the bar in the stack that is clicked on|

#### Slots

We provide a default tooltip that gives the x and y value for the bar that is hovered over. If you want to define a
slightly more [custom tooltip](#tooltips), then we pass up the bar's info in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Name         | Value    |  Description                                                                      |
|--            | -------  |                                                                                 --|
| `bar`       | `Object`  | contains `x_label`, `y_label`, `x_value`, and `y_value` keys of the bar in the stack that is hovered over|

### Grouped Bar Chart

Grouped bar charts are useful in comparing values together in and between groups.

#### Example

<div style="display: flex; justify-content: center">
    <grouped-bar-chart-example></grouped-bar-chart-example>
</div>

```html
<template>
    <GroupedBarChart :plotdata="plotdata"
                     :x_key="'date'"
                     :width="450"
                     :height="300"
                     :margin="margin"
                     :colors="['#F8CBAD', '#C5E0B4', '#BDD7EE', '#D5B8EA']">
    </GroupedBarChart>
</template>

<script>
import GroupedBarChart from "./GroupedBarChart";
import GBCdata from "./BarChartData.json"

export default {
    name: "GroupedBarChartExample",
    components: {
        GroupedBarChart
    },
    data() {
        return {
            plotdata: GBCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>
```


#### Format of Data

In order for the stacked bar chart to render properly, `plotdata` needs to be as an array of objects. There should be
one key for the x value, and all the other keys will be for y values. The `BarChartData.json` data file that
populates the example grouped bar chart has "date" for the x value, and "Veteran's Benefit Administration",
"Veteran's Health Administration", and "National Cemetery Administration" for the y values. Both the grouped bar chart
and stacked bar chart use the same data format for input.

```json
[
  {
    "date": "2019",
    "Veteran's Benefit Administration": 5921,
    "Veteran's Health Administration": 1026,
    "National Cemetery Administration": 2324
  },
  {
    "date": "2020",
    "Veteran's Benefit Administration": 1539,
    "Veteran's Health Administration": 1560,
    "National Cemetery Administration": 1257
  }, ...
]
```

#### Props

| Name         | Required             | Type     | Default | Description                                               |
|--            | :------------------: | -------  | --      |                                                         --|
| `plotdata`   | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `x_key`     |  :heavy_check_mark:   | `String` |         | string that is the key of the x value in plotdata        |
| `width`      | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`     | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `colors`     |  :heavy_check_mark:  | `Array`  |         | array of colors used for each bar, must match number of bar in a group   |
| `margin`     |                      | `Object` |         | object that contains the top, bottom, right, and left margins|
|`enable_tooltip`|                    |`Boolean` | True    | Turn default tooltip on or off                               |

#### Events Emitted

### Line Chart

The line chart component allows for one or more lines to be plotted.

<div style="display: flex; justify-content: center">
    <line-chart-example></line-chart-example>
</div>

```html
<template>
    <LineChart :plot-data="plotData" :x_key="'date'"
               :width="450" :height="250"
               :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']"
               :margin="margin">
    </LineChart>
</template>

<script>
import LineChart from "./LineChart";
import LCdata from "./BarChartData.json"

export default {
    name: "LineChartExample",
    components: {
        LineChart
    },
    data() {
        return {
            plotData: LCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>
```

#### Props

| Name         | Required             | Type     | Default | Description                                               |
|--            | :------------------: | -------  | --      |                                                         --|
| `plotdata`   | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `x_key`     |  :heavy_check_mark:   | `String` |         | string that is the key of the x value in plotdata        |
| `width`      | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`     | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `colors`     |  :heavy_check_mark:  | `Array`  |         | array of colors used for each bar, must match number of bar in a group   |
| `margin`     |                      | `Object` |         | object that contains the top, bottom, right, and left margins|
|`enable_tooltip`|                    |`Boolean` | True    | Turn default tooltip on or off                               |


#### Events Emitted

#### Slots

The default tooltip that gives all of the values for the x value hovered over. If you want to define a slightly
more [custom tooltip](#tooltips), then we pass up the line's info in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Name         | Value    |  Description                                                                      |
|--            | -------  |                                                                                 --|
| `lines`      | `Object` | contains the x key and all of the y keys for the x value that is hovered over     |


### Stacked Area Chart

Under construction...

### Donut Chart

#### Example

```html
<donut-chart 
    :chart-data="[
        {name: 'VA', value: 100},
        {name: 'MD', value: 150},
        {name: 'DC', value: 200}
    ]"
    :chart-title="'Dummy Data'"
    style="height: 300px">
</donut-chart>
```

<div style="height: 300px">
    <donut-chart 
        :chart-data="[
          {name: 'VA', value: 100},
          {name: 'MD', value: 150},
          {name: 'DC', value: 200}
        ]"
        :chart-title="'Dummy Data'"
        >
    </donut-chart>
</div>



#### Props

| Name          | Required             | Type     | Default                  | Description                                                    |
|--             | :------------------: | -------  | --                       |                                                              --|
| `chart-data`  | :heavy_check_mark:   | `Array`  |                          | Data for the slices of the donut chart                         |
| `chart-title` |                      | `String` | `null`                   | Text in the center of the donut chart                          |
| `colors`      |                      | `Array`  | `colorbrewer.Paired[12]` | Array of colors used for each slice                            |
| `value-key`   |                      | `String` | `value`                  | Key for the value of the slice in each element of `chart-data` |

### Scatter Plot

Under construction...

### Hierarchical Edge Bundling

#### Example

The code below constructs the hierarchical edge bundling plot below it.

<div style="display: flex; justify-content: center">
    <hierarchical-edge-bundling-example></hierarchical-edge-bundling-example>
</div>

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


#### Format of Data

The format of the data for edge bundling chart requires a bit more work. There are three main keys: `name`, `color`, and
`imports`. The `name` key is for the name of the node, which should be unique, and `color` which is the color of the
node. Lastly, the `imports` key contains all of the connection to that node.

```json
[
  {
    "name": "root|Outcome|Meet Client",
    "color": "#395fa0",
    "imports": ["root|Outcome|Complete Outcome 1"]
  },
  {
    "name": "root|Indicator|Go To Dinner",
    "color": "red",
    "imports": [
      "root|Outcome|Meet Client"
    ]
  },
  {
    "name": "root|Indicator|Fill Out Paperwork",
    "color": "#395fa0",
    "imports": [
      "root|Indicator|Go To Dinner",
      "root|Outcome|Complete Outcome 1"
    ]
  }, ...
]
```

#### Props

| Name            | Required             | Type     | Default | Description                                               |
|--               | :------------------: | -------  | --      |                                                         --|
| `plotdata`      | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `width`         | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`        | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `radial-margin` |                      | `Number` | 70      | margin (in pixels) between the text label and edge of svg |
|`highlight-event`|                      | `String` | 'click' | Event that hightlights connections for a specific node and has two options: 'click' or 'mouseover'|

#### Events Emitted


### Network

Networks are useful in displaying relationships between groups. The sticky force layout below provides an easy way to
implement one. A few features are available that are quite useful: 

1. Individual nodes can be dragged
2. The entire graph of nodes and links can be panned (e.g. dragged around)
3. Nodes and links can be added or removed without having to rerender the entire component

<network-example></network-example>

```html
<template>
    <div>
        <Network :width="500" :height="400" :plot-data="plotData"></Network>
    </div>
</template>

<script>
import Network from "./Network";
import NetworkData from "./NetworkData.json"

export default {
    name: "NetworkExample",
    components: {
        Network
    },
    data() {
        return {
            plotData: NetworkData
        }
    },
}
</script>
```

#### Format of Data

The data needs to be an object that has an array of nodes and array of links. A node object should have a name property,
a null x and y, and a color (if specific nodes should be colored differently). The links need to have source and target
keys which reference a node by name. Nodes and links can have additional metadata in them as well, as long as the names
don't conflict the required keys. Here is the data used to create the network above.

```json
{
  "nodes": [
    {
      "name": "Jerry",
      "x": null,
      "y": null,
      "color": "#cd34b5"
    },
    {
      "name": "George",
      "x": null,
      "y": null,
      "color": "#fa8775"
    }, ...
  ],
  "links": [
    {
      "source": "Jerry",
      "target": "Elaine"
    },
    {
      "source": "Elaine",
      "target": "David"
    }, ...
  ]
}
```

#### Props

| Name            | Required            | Type     | Default | Description                                               |
|--               | :-----------------: | -------  | --      |                                                         --|
| `plotdata`      | :heavy_check_mark:  | `Array`  |         | data necessary to create the chart                        |
| `width`         | :heavy_check_mark:  | `Number` |         | chart width in pixels                                     |
| `height`        | :heavy_check_mark:  | `Number` |         | chart height in pixels                                    |
| `node-radius`   |                     | `Number` |   8    | size of node circles                                      |
| `force-strength`|                     | `Number` |   -80   | [force](https://github.com/d3/d3-force#many-body) causing nodes to repel each other                   |

#### Events
| Event        | Location       | Value Emitted     |  Description                                                                      |
|--            | --------       |------             |                                                                                 --|
| `click`      |   Circle       | `Object`          |  The entire node object is emitted containing node name, x, y, and any other keys |

### Choropleth

[Leaflet](https://leafletjs.com/) is an open-source JavaScript library for creating interactive maps. One common
visualization that leverages Leaflet is a choropleth, which involves coloring different geographic areas based on some
statistic associated with the area.

#### Example

```html
<choropleth
    :map-data="{ VA: 100, MD: 150, DC: 200 }"
    :center="[37.43, -78.66]"
    :zoom="6"
    :colors="'Greens'"
    :num-classes="3"
    style="height: 300px;"
></choropleth>
```

<div>
    <choropleth
        :map-data="{ VA: 100, MD: 150, DC: 200 }"
        :center="[37.43, -78.66]"
        :zoom="6"
        :colors="'Greens'"
        :num-classes="3"
         style="height: 300px;">
    </choropleth>
</div>

#### Props

| Name          | Required             | Type      | Default                                      | Description                                                                                      |
|--             | :------------------: | -------   | -------------------------------------------- |                                                                                                --|
| `map-data`    | :heavy_check_mark:   | `Object`  |                                              | Object mapping geography codes to values                                                         |
| `geographies` |                      | `Object`  | US States                                    | [GeoJSON](https://geojson.org/) definition of the geographical regions to be outlined in the map |
| `center`      |                      | `Array`   | `[38, -95.1]`                                | Two-dimensional Array containing the latitude and longitude of the center of the map display     |
| `zoom`        |                      | `Number`  | `5`                                          | Number between 3 and 10 specifying the default zoom level                                        |
| `colors`      |                      | `String`  | `Blues`                                      | [Color Brewer](https://colorbrewer2.org) color scheme name                                       |
| `num-classes` |                      | `Number`  | `5`                                          | The number of different colors in the color scale                                                |
| `tile-url`    |                      | `String`  | ArcGIS Light Grey Tiles                      | URL of the desired Leaflet tile layer                                                            |
| `hide-legend` |                      | `Boolean` | `false`                                      | Hides the legend in the lower right corner                                                       |                                             |

## Additional useful components

### Basic Legend

Legends are useful for many charts and we provide a simple one in our library. Here is an example that shows how to use a simple legend component in both the vertical and horizontal alignments.

#### Example

<base-legend-example></base-legend-example>

```html
<template>
    <div>
        <p>Horiztonal</p>
        <BaseLegend :legend-data="legendData" :alignment="'horizontal'">
        </BaseLegend>
        <p>Vertical</p>
        <BaseLegend :legend-data="legendData" :alignment="'vertical'">
        </BaseLegend>
    </div>
</template>

<script>
import BaseLegend from "./BaseLegend";

export default {
    name: "BaseLegendExample",
    components: {
        BaseLegend
    },
    data() {
        return {
            legendData: {
                "Veteran's Benefit Administration": '#717e9b',
                "Veteran's Health Administration": '#b6b6db',
                "National Cemetery Administration": '#bcd8f1'
            }
        }
    }
}
</script>
```

#### Props
| Name         | Required             | Type     | Default     | Description                                            |
|--            | :------------------: | -------  | --          |                                                      --|
| `legend-data`| :heavy_check_mark:   | `Object` |             | data necessary to create the legend                    |
| `alignment`  |                      | `String` | 'horizontal'| Two options for alignment: 'vertical' or 'horizontal'  |

#### Format of Data

The legend component takes in a simple object with key value pairs in the form of label:color. 

```json
{
  "Veteran's Benefit Administration": "#717e9b",
  "Veteran's Health Administration": "#b6b6db",
  "National Cemetery Administration": "#bcd8f1"

}
```


### Loading Spinner

The loading spinner is useful when data is being fetched from an API and there is some lag before the GUI receives it.

<div style="display: flex; justify-content: center">
<loader-spinning></loader-spinning>
</div>

## Component Parts

### Tooltips

We provide default tooltips for some of the charts, which make it easy to get up and running quickly. However, it is
common for users to want to define a slightly more custom tooltip that might better fit their needs. This can be done
with [Slots](https://vuejs.org/v2/guide/components-slots.html)
and [Scoped Slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots). Each chart that has a
default tooltip will also have a slot that passes up data about the part of the chart that is hovered on. Here is an
example that defines a custom tooltip for the same stacked bar chart using the x_label, y_label, x_value, and y_value of
the bar that is hovered over, which
are [destructured](https://vuejs.org/v2/guide/components-slots.html#Destructuring-Slot-Props) from the `bar` slot

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example :tooltip="true"></stacked-bar-chart-example>
</div>

```html
<template>
    <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" :x_key="'date'"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
        <template v-slot:tooltip="{ bar }">
            <h2>Hello from inside the tooltip. Here are values when you hover over a bar</h2>
            <p>{{ bar.x_label }}, {{ bar.y_label }}, {{ bar.x_value }}, {{ bar.y_value }}</p>
        </template>
    </StackedBarChart>
</template>

<script>
import StackedBarChart from "./StackedBarChart";
import SBCdata from './BarChartData.json'

export default {
    name: "StackedBarChartExample",
    components: {
        StackedBarChart
    },
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>
```

### Annotations

Most of the plots that contain x and y axes also have the ability to add annotations. Annotations need to be an array of objects, even if it is only one object. The chart below shows this

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example :annotation="true"></stacked-bar-chart-example>
</div>

```html
<template>
    <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" :x_key="'date'"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </StackedBarChart>
</template>

<script>
import StackedBarChart from "./StackedBarChart";
import SBCdata from './BarChartData.json'

export default {
    name: "StackedBarChartExample",
    components: {
        StackedBarChart
    },
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20},
            annotations: [{type: "line", axis: "y", color: "#ef0202", value: 8000}]
        }
    }
}
</script>
```

#### Format

The annotation object requires the following properties

| Name         | Required             | Type     | Default     | Description                                            |
|--            | :------------------: | -------  | --          |                                                      --|
| `type`       | :heavy_check_mark:   | `String` |             | type of annotation, current options: 'line'            |
| `axis`       | :heavy_check_mark:   | `String` |             | options: "x" or "y"                                    |
| `value`      | :heavy_check_mark:   | `Number` |             | value on the x or y axis                               |
| `color`      |  :heavy_check_mark:  | `String` |             | color name, hex code, or rgb value                     |
# Vuesalize

## What's the point?

Building interactive visualizations on the web can be hard, and it can be even harder when you would like to leverage
existing visualization libraries inside of a Vue.js project. The goal of `Vuesalize` is to simplify this process by
providing a set of chart components (and a couple others) that are commonly used in building interactive visualizations
on the web. The charts are built using a combination of [Vue.js](https://vuejs.org/v2/guide/)
and [D3.js](https://d3js.org/). The main rationale for this approach is to fully embrace the Vue paradigm and move the
SVG definitions to the template (HTML), which allows Vue to handle creating and removing elements on the page. 
This is analogous to the "enter/update/exit" strategy used in D3 but specifically taking advantage of the virtual DOM.
By building charts where the SVG is defined in Vue's template, we can not only send down props to update the chart, but
can also emit events on interactions (e.g. click, mousover, etc.) and offer scoped slots for custom tooltips!

## Installation

Any Vue.js based project will be able to take advantage of this library. The library is currently available on npm, and
it is possible to use it with Vue CLI (recommended) or directly with the CDN version in a `<script>` tag.

### Vue CLI
The steps to use is it in a project created using the Vue CLI are as follows: 

1. Install from npm using `npm install vuesalize`
2. In `main.js`, add the components that are going to be used in the project. Here is an example below for a project
using the `BaseLegend` and `LoaderSpinning` components
   
```js
import LoaderSpinning from 'vuesalize'
import BaseLegend from 'vuesalize'
import 'vuesalize/dist/vuesalize.css'

Vue.use(LoaderSpinning, BaseLegend)
```

3. Start using the components in templates. For example, if the `BaseLegend` and `LoaderSpinning` components were going 
   to be used in a default `App.vue` file, this is how it would be setup:

```html
<template>
    <div id="app">
        <BaseLegend :legend-data="sampleLegendData"></BaseLegend>
        <LoaderSpinning></LoaderSpinning>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            sampleLegendData: [{name: 'hello', color: 'red'}, {name: 'bue', color: 'blue'}],
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
```

### CDN

It is quite simple to get started with the CDN. The vuesalize [javascript](https://unpkg.com/vuesalize) and [css](https://unpkg.com/vuesalize@0.0.29/dist/vuesalize.css) files need to be linked (lines 5 and 7), 
and the components that will be used must be declared using `Vue.use()` (line 16). It is also necessary to link the 
official Vue package as well (line 6).

```html {5,7,16}
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Browser test</title>
    <link rel="stylesheet" href="https://unpkg.com/vuesalize@0.0.29/dist/vuesalize.css">
    <script src="http_cdn.jsdelivr.net_npm_vue@2.6.12_dist_vue.js"></script>
    <script src="https://unpkg.com/vuesalize@0.0.29/dist/vuesalize.umd.min.js"></script>
</head>
<body>
<div id="app">
    <loader-spinning></loader-spinning>
    <base-legend :legend-data="testlegend"></base-legend>
</div>

<script>
    Vue.use('loader-spinning', 'base-legend')
    
    new Vue({
        el: '#app',
        data() {
            return {
                testlegend: [{name: 'hello', color: 'red'}, {name: 'bue', color: 'blue'}],
            }
        }
    })
</script>
</body>
</html>
```

Examples of how each of the components can be used is in each of the sections.

Additionally, the SFC component templates can be retrieved from [gitlab](https://gitlab.mitre.org/full-stack-interactive-visualizations/components/-/tree/master/documentation/.vuepress/components)

## Charts


### Stacked Bar Chart

Stacked bar charts are one of the most popular chart types. 

#### Example
Here is a simple example that constructs a stacked bar chart representing different budgets for VA.

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example></stacked-bar-chart-example>
</div>

```html
<template>
    <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" x-key="date"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </StackedBarChart>
</template>

<script>
import SBCdata from './Budget3Groups.json'

export default {
    name: "StackedBarChartExample",
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 35, left: 55, right: 20},
        }
    }
}
</script>
```

Alternatively, it's possible to get a horizontal bar chart by passing in 'horizontal' for the `direction` prop.

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example :horizontal="true"></stacked-bar-chart-example>
</div>

```html
<template>
    <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" x-key="date" direction="horizontal"
                     x-axis-label="VA Budget" y-axis-label="Year"
                     :x-axis-label-shift="{ dx: 0, dy: -2}" :y-axis-label-shift="{ dx: 0, dy: 5}"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </StackedBarChart>
</template>

<script>
import SBCdata from './Budget3Groups.json'

export default {
    name: "StackedBarChartExample",
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 35, left: 55, right: 20},
        }
    }
}
</script>
```


In order for the stacked bar chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example stacked bar chart has "date" for the x value, and "Veteran's Benefit Administration",
"Veteran's Health Administration", and "National Cemetery Administration" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.

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

| Name                | Required             | Type     | Default | Description                                               |
|--                   | :------------------: | -------  | --      |                                                         --|
| `plot-data`         | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `x-key`             |  :heavy_check_mark:   | `String` |         | string that is the key of the x value in plotdata        |
| `width`             | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`            | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `colors`            |  :heavy_check_mark:  | `Array`  |         | array of colors used for each bar, must match number of bar in a group|
| `direction`         |                      | `String` |'vertical' | direction of the chart. can be 'vertical' or 'horizontal'     |
| `bar-axis-location` |                      | `String`| 'bottom' | placement of the x-axis for horizontal layout. can be 'bottom' or 'top'|
| `margin`            |                      | `Object` |         | object that contains the top, bottom, right, and left margins|
|`enable-tooltip`     |                    |`Boolean` | True    | Turn default tooltip on or off                               |
|`padding-between-bars`|              | `Number` | 0.10    | padding between the bars in a group. Must be between `0` and `1`         |
| `x-axis-label`      |                      | `String` |         | Label for the x-axis                                      |
| `y-axis-label`      |                      | `String` |         | Label for the y-axis                                      |
| `x-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label     |
| `y-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label     |

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

Here is an example using the same VA budget data as the stacked bar chart above but the bars are instead grouped.

<div style="display: flex; justify-content: center">
    <grouped-bar-chart-example></grouped-bar-chart-example>
</div>

```html
<template>
    <GroupedBarChart :plot-data="plotdata" x-key="date"
                     :width="450" :height="300" :margin="margin"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </GroupedBarChart>
</template>

<script>
import GBCdata from "./Budget3Groups.json"

export default {
    name: "GroupedBarChartExample",
    data() {
        return {
            plotdata: GBCdata,
            margin: {top: 20, bottom: 35, left: 55, right: 20}
        }
    }
}
</script>
```

And, again, it's possible to get a horizontal bar chart by passing in 'horizontal' for the direction prop.

<div style="display: flex; justify-content: center">
    <grouped-bar-chart-example :horizontal="true">
</grouped-bar-chart-example>
</div>

```html
<template>
    <GroupedBarChart :plot-data="plotdata" x-key="date"
                     :width="450" :height="300" :margin="margin"
                     x-axis-label="VA Budget" y-axis-label="Year"
                     :x-axis-label-shift="{ dx: 0, dy: -2 }" :y-axis-label-shift="{ dx: 0, dy: 5 }"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </GroupedBarChart>
</template>

<script>
import GBCdata from "./Budget3Groups.json"

export default {
    name: "GroupedBarChartExample",
    data() {
        return {
            plotdata: GBCdata,
            margin: {top: 20, bottom: 35, left: 55, right: 20}
        }
    }
}
</script>
```

#### Format of Data

In order for the grouped bar chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example grouped bar chart has "date" for the x value, and "Veteran's Benefit Administration",
"Veteran's Health Administration", and "National Cemetery Administration" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.


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

| Name           | Required            | Type     | Default | Description                                               |
|--              | :-----------------: | -------  | --      |                                                         --|
| `plot-data`    | :heavy_check_mark:  | `Array`  |         | data necessary to create the chart                        |
| `x-key`        | :heavy_check_mark:  | `String` |         | string that is the key of the x value in plotdata        |
| `width`        | :heavy_check_mark:  | `Number` |         | chart width in pixels                                     |
| `height`       | :heavy_check_mark:  | `Number` |         | chart height in pixels                                    |
| `colors`       |  :heavy_check_mark: | `Array`  |         | array of colors used for each bar, must match number of bar in a group |
| `direction`    |                     |`String` |'vertical'| direction of the chart. can be 'vertical' or 'horizontal'     |
| `padding-between-bars`|              | `Number` | 0.15    | padding between the bars in a group. Must be between `0` and `1`         |
| `padding-between-groups`|            | `Number` | 0.15    | padding between the groups of bars. Must be between `0` and `1`         |
| `margin`       |                     | `Object` |         | object that contains the top, bottom, right, and left margins|
|`enable-tooltip`|                    |`Boolean` | True    | Turn default tooltip on or off                               |
| `x-axis-label`      |                      | `String` |         | Label for the x-axis                                      |
| `y-axis-label`      |                      | `String` |         | Label for the y-axis                                      |
| `x-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label     |
| `y-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label     |

#### Events Emitted

### Line Chart

The line chart component allows for one or more lines to be plotted.

#### Example

<div style="display: flex; justify-content: center">
    <line-chart-example></line-chart-example>
</div>

```html
<template>
    <LineChart :plot-data="plotData" x-key="date"
               :width="450" :height="250" :margin="margin"
               x-axis-label="Year" y-axis-label="VA Budget"
               :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </LineChart>
</template>

<script>
import LCdata from "./Budget3Groups.json"

export default {
    name: "LineChartExample",
    data() {
        return {
            plotData: LCdata,
            margin: {top: 20, bottom: 30, left: 50, right: 20}
        }
    }
}
</script>
```

#### Format of Data

In order for the line chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example line chart has "date" for the x value, and "Veteran's Benefit Administration",
"Veteran's Health Administration", and "National Cemetery Administration" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.


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

| Name                | Required             | Type     | Default | Description                                                   |
|--                   | :------------------: | -------  | --      |                                                             --|
| `plot-data`         | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                            |
| `x-key`             |  :heavy_check_mark:  | `String` |         | string that is the key of the x value in plotdata             |
| `width`             | :heavy_check_mark:   | `Number` |         | chart width in pixels                                         |
| `height`            | :heavy_check_mark:   | `Number` |         | chart height in pixels                                        |
| `colors`            |  :heavy_check_mark:  | `Array`  |         | array of colors used for each line, must match number of lines |
| `margin`            |                      | `Object` |         | object that contains the top, bottom, right, and left margins |
|`enable-tooltip`     |                      |`Boolean` | True    | Turn default tooltip on or off                                |
|`stroke-width`       |                      | `Number` |  2      | stroke-width for areas                                        |
| `x-axis-label`      |                      | `String` |         | Label for the x-axis                                        |
| `y-axis-label`      |                      | `String` |         | Label for the y-axis                                        |
| `x-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |
| `y-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |

#### Events Emitted

#### Slots

The default tooltip that gives all of the values for the x value hovered over. If you want to define a slightly
more [custom tooltip](#tooltips), then we pass up the line's info in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Name         | Value    |  Description                                                                      |
|--            | -------  |                                                                                 --|
| `lines`      | `Object` | contains the x key and all of the y keys for the x value that is hovered over     |


### Area Chart

Area charts are similar to line charts except the area under the curve is filled in. A normal area chart with two
groups is displayed below

<div style="display: flex; justify-content: center">
    <area-chart-example></area-chart-example>
</div>

```html
<template>
        <AreaChart :plot-data="plotData" :width="500" :height="300" x-key="date"
                   :margin="margin" :colors="['#ac58e5','#E0488B']"
                   x-axis-label="Year" y-axis-label="VA Budget">
        </AreaChart>
</template>

<script>
   import ACdata from './Budget2Groups.json'

   export default {
      name: "AreaChartExample",
      data() {
         return {
            plotData: ACdata,
            margin: {top: 20, bottom: 30, left: 55, right: 20}
         }
      }
   }
</script>
```

In order to get a stacked area chart, the `stacked` prop can be set to true

<div style="display: flex; justify-content: center">
    <area-chart-example :stacked="true"></area-chart-example>
</div>

```html
<template>
        <AreaChart :plot-data="plotData" :width="500" :height="300" x-key="date"
                   :margin="margin" :stacked="true" :colors="['#ac58e5','#E0488B']"
                   x-axis-label="Year" y-axis-label="VA Budget">
        </AreaChart>
</template>

<script>
   import ACdata from './Budget2Groups.json'

   export default {
      name: "AreaChartExample",
      data() {
         return {
            plotData: ACdata,
            margin: {top: 20, bottom: 30, left: 55, right: 20}
         }
      }
   }
</script>
```

#### Format of Data

In order for the area chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example area chart has "date" for the x value, and "Veteran's Benefit Administration",
"Veteran's Health Administration", and "National Cemetery Administration" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.


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

| Name          | Required             | Type     | Default | Description                                                    |
|--             | :------------------: | -------  | --      |                                                              --|
| `plot-data`   | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                             |
| `x-key`       | :heavy_check_mark:   | `String` |         | string that is the key of the x value in plotdata              |
| `width`       | :heavy_check_mark:   | `Number` |         | chart width in pixels                                          |
| `height`      | :heavy_check_mark:   | `Number` |         | chart height in pixels                                         |
| `colors`      |  :heavy_check_mark:  | `Array`  |         | array of colors used for areas                                 |
| `margin`      |                      | `Object` |         | object that contains the top, bottom, right, and left margins  |
| `stacked`     |                      | `Boolean`|         | changes to stacked area chart                                  |
|`fill-opacity` |                      | `Number` |  0.65   | fill opacity for each path, must be between 0 and 1            |
|`stroke-width` |                      | `Number` |  2      | stroke-width for areas                                         |

#### Events Emitted

#### Slots

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
    <HierarchicalEdgeBundling :plot-data="plotdata" :width="600" :height="600">
    </HierarchicalEdgeBundling>
</template>

<script>
import HEBdata from "./HierarchicalEdgeBundlingData.json"

export default {
    name: "HierarchicalEdgeBundlingExample",
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
| `plot-data`      | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
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
    <Network :width="500" :height="400" :plot-data="plotData"></Network>
</template>

<script>
import NetworkData from "./NetworkData.json"

export default {
    name: "NetworkExample",
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
don't conflict with any the required keys. Here is the data used to create the network above.

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
| `plot-data`      | :heavy_check_mark:  | `Array`  |         | data necessary to create the chart                        |
| `width`         | :heavy_check_mark:  | `Number` |         | chart width in pixels                                     |
| `height`        | :heavy_check_mark:  | `Number` |         | chart height in pixels                                    |
| `node-radius`   |                     | `Number` |   8    | size of node circles                                      |
| `force-strength`|                     | `Number` |   -80   | [force](https://github.com/d3/d3-force#many-body) causing nodes to repel each other                   |

#### Events
| Event        | Location       | Value Emitted     |  Description                                                                      |
|--            | --------       |------             |                                                                                 --|
| `click`      |   Circle       | `Object`          |  The entire node object is emitted containing node name, x, y, and any other keys |


## Additional useful components

### Basic Legend

Legends are useful for many charts and we provide a simple one in our library. Here is an example that shows how to use a simple legend component in both the vertical and horizontal alignments.

#### Example

<base-legend-example></base-legend-example>

```html
<template>
    <div>
        <p>Horizontal</p>
        <BaseLegend :legend-data="legendData" :alignment="'horizontal'"></BaseLegend>
        <p>Vertical</p>
        <BaseLegend :legend-data="legendData" :alignment="'vertical'"></BaseLegend>
    </div>
</template>

<script>
export default {
    name: "BaseLegendExample",
    data() {
        return {
            legendData: [
                {name: "Veteran's Benefit Administration", color: '#717e9b'},
                {name: "Veteran's Health Administration", color: '#b6b6db'},
                {name: "National Cemetery Administration", color: '#bcd8f1'}
            ]
        }
    }
}
</script>
```

#### Format of Data

The legend component takes in a simple array of objects that contains name and color keys.

```json
[
  {
    "name": "Veteran's Benefit Administration",
    "color": "#717e9b"
  },
  {
    "name": "Veteran's Health Administration",
    "color": "#b6b6db"
  },
  {
    "name": "National Cemetery Administration",
    "color": "#bcd8f1"
  }
]
```

#### Props
| Name            | Required             | Type     | Default     | Description                                            |
|--               | :------------------: | -------  | --          |                                                      --|
| `legend-data`   | :heavy_check_mark:   | `Object` |             | data necessary to create the legend                    |
| `alignment`     |                      | `String` | 'horizontal'| Two options for alignment: 'vertical' or 'horizontal'  |
| `enable-toggle` |                      | `Boolean` | false      | allows the items in the legend to be clickable and emits the object on click|

#### Events
| Event        | Location       | Value Emitted     |  Description                                                                         |
|--            | --------       |------             |                                                                                    --|
| `click`      | Marker or text | `Object`          | If `enable-toggle` prop is true, the entire item object (name and color) is emitted                    |

### Loading Spinner

The loading spinner is useful when data is being fetched from an API and there is some lag before the GUI receives it.

#### Example 

<div style="display: flex; justify-content: center">
<loader-spinning></loader-spinning>
</div>


```html
<template>
    <LoaderSpinning></LoaderSpinning>
</template>

<script>
export default {
    name: "StackedBarChartExample",
}
</script>
```


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
                     :margin="margin" x-key="date"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
        <template v-slot:tooltip="{ bar }">
            <h2>Hello from inside the tooltip. Here are values when you hover over a bar</h2>
            <p>{{ bar.x_label }}, {{ bar.y_label }}, {{ bar.x_value }}, {{ bar.y_value }}</p>
        </template>
    </StackedBarChart>
</template>

<script>
import SBCdata from './Budget3Groups.json'

export default {
    name: "StackedBarChartExample",
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

Most of the plots that contain x and y axes also have the ability to add annotations. The chart below shows adding
a horizontal dashed line to stacked bar chart which might indicate, for example, a max budget line.

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example :annotation="true"></stacked-bar-chart-example>
</div>

```html
<template>
    <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" x-key="date"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']"
                     :annotations="annotations">
    </StackedBarChart>
</template>

<script>
import SBCdata from './Budget3Groups.json'

export default {
   name: "StackedBarChartExample",
   data() {
      return {
         plotData: SBCdata,
         margin: {top: 20, bottom: 20, left: 40, right: 20},
         annotations: [{
            type: "line", axis: "y", color: "#ef0202",
            value: 8000, dash: true
         }]
      }
   }
}
</script>
```

#### Format

Annotations need to be an array of objects, even if it is only one object. The annotation object requires the following
properties

| Name         | Required             | Type     | Default     | Description                                            |
|--            | :------------------: | -------  | --          |                                                      --|
| `type`       | :heavy_check_mark:   | `String` |             | type of annotation, current options: 'line'            |
| `axis`       | :heavy_check_mark:   | `String` |             | options: "x" or "y"                                    |
| `value`      | :heavy_check_mark:   | `Number` |             | value on the x or y axis                               |
| `color`      |                      | `String` |   Black     | color name, hex code, or rgb value                     |
| `dash`       |                      | `Boolean`|  False      | whether line should have dashes or not                 |

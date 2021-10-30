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
            sampleLegendData: [
               {name: 'finance', color: 'red'},
               {name: 'accounting', color: 'blue'}
            ],
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

It is quite simple to get started with the CDN. The vuesalize [javascript](https://unpkg.com/vuesalize) 
and [css](https://unpkg.com/vuesalize@0.0.37/dist/vuesalize.css) files need to be linked (lines 5 and 7), 
and the components that will be used must be declared using `Vue.use()` (line 16). It is also necessary to link the 
official Vue package (line 6) before vuesalize since it relies on base Vue.

```html
<html lang="en">
<head>
   <meta charset="utf-8">
   <title>Browser test</title>
   <link rel="stylesheet" href="https://unpkg.com/vuesalize@0.0.x/dist/vuesalize.css">
   <script src="http_cdn.jsdelivr.net_npm_vue@2.6.12_dist_vue.js"></script>
   <script src="https://unpkg.com/vuesalize@0.0.x/dist/vuesalize.umd.min.js"></script>
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
            sampleLegendData: [
               {name: 'finance', color: 'red'},
               {name: 'accounting', color: 'blue'}
            ],
         }
      }
   })
</script>
</body>
</html>
```

Examples of how each of the components can be used is in each of the sections.

Additionally, the SFC component templates can be retrieved
from [github](https://github.com/haroutboujakjian/Vuesalize/tree/master/src)

## Charts


### Stacked Bar Chart

Stacked bar charts are one of the most popular chart types. 

#### Example
Here is a simple example that constructs a stacked bar chart representing a set of generic expenses.

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example></stacked-bar-chart-example>
</div>

```html
<template>
    <StackedBarChart :plot-data="plotData" x-key="date"
                     :margin="margin" x-axis-label="Year" 
                     y-axis-label="Expenses" :y-tick-format="d => `$${d}`">
    </StackedBarChart>
</template>

<script>
import SBCdata from './Budget3Groups.json'

export default {
    name: "StackedBarChartExample",
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 35, left: 60, right: 20},
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
   <StackedBarChart :plot-data="plotData" x-key="date"
                    :margin="margin" direction="horizontal"
                    x-axis-label="Expenses" y-axis-label="Year"
                    :x-axis-label-shift="{ dx: 0, dy: -2}" :y-axis-label-shift="{ dx: 0, dy: 5}"
                    :x-tick-format="d => `$${d}`">
   </StackedBarChart>
</template>

<script>
   import SBCdata from './Budget3Groups.json'

   export default {
    name: "StackedBarChartExample",
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 35, left: 60, right: 20},
        }
    }
}
</script>
```


In order for the stacked bar chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example stacked bar chart has "date" for the x value, and "Utilities",
"Rent", and "Insurance" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.

```json
[
   {
      "date": "2019",
      "Utilities": 5921,
      "Rent": 1026,
      "Insurance": 2324
   },
   {
      "date": "2020",
      "Utilities": 1539,
      "Rent": 1560,
      "Insurance": 1257
   },
   ...
]
```

#### Props

| Name                 | Required            | Type     | Default | Description                                                       |
|--                    | :-----------------: | -------  | --      |                                                                 --|
| `plot-data`          | :heavy_check_mark:  | `Array`  |         | data necessary to create the chart                                |
| `x-key`              |  :heavy_check_mark: | `String` |         | string that is the key of the x value in plotdata                 |
| `width`              |                     | `Number` |  350px  | chart width in pixels                                             |
| `height`             |                     | `Number` |  250px  | chart height in pixels                                            |
| `colors`             |                     | `Array`  |         | array of colors used for each bar                                 |
| `direction`          |                     | `String` |'vertical'| direction of the chart. can be 'vertical' or 'horizontal'        |
| `bar-axis-location`  |                     | `String` |'bottom' | placement of the x-axis for horizontal layout. can be 'bottom' or 'top'|
| `margin`             |                     | `Object` |         | object that contains the top, bottom, right, and left margins     |
|`enable-tooltip`      |                     |`Boolean` | True    | Turn default tooltip on or off                                    |
|`padding-between-bars`|                     | `Number` | 0.10    | padding between the bars in a group. Must be between `0` and `1`  |
| `x-axis-label`       |                     | `String` |         | Label for the x-axis                                              |
| `y-axis-label`       |                     | `String` |         | Label for the y-axis                                              |
| `x-axis-label-shift` |                     | `Object` |         | Takes `dx` and `dy` keys that move the location label             |
| `y-axis-label-shift` |                     | `Object` |         | Takes `dx` and `dy` keys that move the location label             |
| `x-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis    |
| `y-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis    |

#### Events

| Event     | Location          | Value Emitted  |  Description                                                                      |
|--         | --------          |------          |                                                                                 --|
| `click`   |   Rectangle       | `Object`       |  `x_label`, `y_label`, `x_value`, and `y_value` of the bar in the stack that is clicked on|

#### Slots

We provide a default tooltip that gives the x and y value for the bar that is hovered over. If you want to define a
slightly more [custom tooltip](#tooltips), then the bar's data is passed up in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Slot name  | Value    | Type   |  Description                                                                                        |
|--          | -------  |  ----  |                                                                                                   --|
| `tooltip`  | `bar`    | Object | contains `x_label`, `y_label`, `x_value`, and `y_value` keys of the bar in the stack that is hovered over  |

### Grouped Bar Chart

Grouped bar charts are useful in comparing values together in and between groups.

#### Example

Here is an example using the same expenses data as the stacked bar chart above. In this case, the bars are grouped.

<div style="display: flex; justify-content: center">
    <grouped-bar-chart-example></grouped-bar-chart-example>
</div>

```html
<template>
   <GroupedBarChart :plot-data="plotdata" x-key="date"
                    :width="450" :height="300" :margin="margin"
                    x-axis-label="Year" y-axis-label="Expenses"
                    :y-tick-format="d => `$${d}`">
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
                    x-axis-label="Expenses" y-axis-label="Year"
                    :x-axis-label-shift="{ dx: 0, dy: -2 }" :y-axis-label-shift="{ dx: 0, dy: 5 }"
                    :x-tick-format="d => `$${d}`">
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

In order for the stacked bar chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example stacked bar chart has "date" for the x value, and "Utilities",
"Rent", and "Insurance" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.

```json
[
   {
      "date": "2019",
      "Utilities": 5921,
      "Rent": 1026,
      "Insurance": 2324
   },
   {
      "date": "2020",
      "Utilities": 1539,
      "Rent": 1560,
      "Insurance": 1257
   },
   ...
]
```

#### Props

| Name                  | Required            | Type     | Default | Description                                                       |
|--                     | :-----------------: | -------  | --      |                                                                 --|
| `plot-data`           | :heavy_check_mark:  | `Array`  |         | data necessary to create the chart                                |
| `x-key`               | :heavy_check_mark:  | `String` |         | string that is the key of the x value in plotdata                 |
| `width`               |                     | `Number` |  350px  | chart width in pixels                                             |
| `height`              |                     | `Number` |  250px  | chart height in pixels                                            |
| `colors`              |                     | `Array`  |         | array of colors used for each bar                                 |
| `direction`           |                     |`String`  |'vertical'| direction of the chart. can be 'vertical' or 'horizontal'        |
| `bar-axis-location`   |                     | `String` |'bottom' | placement of the x-axis for horizontal layout. can be 'bottom' or 'top'|
| `padding-between-bars`|                 | `Number` | 0.15    | padding between the bars in a group. Must be between `0` and `1`  |
| `padding-between-groups`|               | `Number` | 0.15    | padding between the groups of bars. Must be between `0` and `1`   |
| `margin`              |                     | `Object` |         | object that contains the top, bottom, right, and left margins     |
|`enable-tooltip`       |                     |`Boolean` | True    | Turn default tooltip on or off                                  |
| `x-axis-label`        |                      | `String` |         | Label for the x-axis                                        |
| `y-axis-label`        |                      | `String` |         | Label for the y-axis                                        |
| `x-axis-label-shift`  |                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |
| `y-axis-label-shift`  |                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |
| `x-tick-format`       |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis    |
| `y-tick-format`       |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis    |

#### Events

#### Slots

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
              x-axis-label="Year" y-axis-label="Expenses"
              :y-tick-format="d => `$${d}`">
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

In order for the stacked bar chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example stacked bar chart has "date" for the x value, and "Utilities",
"Rent", and "Insurance" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.

```json
[
   {
      "date": "2019",
      "Utilities": 5921,
      "Rent": 1026,
      "Insurance": 2324
   },
   {
      "date": "2020",
      "Utilities": 1539,
      "Rent": 1560,
      "Insurance": 1257
   },
   ...
]
```

#### Props

| Name                | Required             | Type     | Default | Description                                                   |
|--                   | :------------------: | -------  | --      |                                                             --|
| `plot-data`         | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                            |
| `x-key`             |  :heavy_check_mark:  | `String` |         | string that is the key of the x value in plotdata             |
| `width`              |                     | `Number` |  350px  | chart width in pixels                                         |
| `height`             |                     | `Number` |  250px  | chart height in pixels                                        |
| `colors`            |                      | `Array`  |         | array of colors used for each line                            |
| `margin`            |                      | `Object` |         | object that contains the top, bottom, right, and left margins |
|`enable-tooltip`     |                      |`Boolean` | True    | Turn default tooltip on or off                                |
|`stroke-width`       |                      | `Number` |  2      | stroke-width for areas                                        |
| `x-axis-label`      |                      | `String` |         | Label for the x-axis                                        |
| `y-axis-label`      |                      | `String` |         | Label for the y-axis                                        |
| `x-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |
| `y-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |
| `x-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis    |
| `y-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis    |

#### Events

#### Slots

The default tooltip that gives all of the values for the x value hovered over. If you want to define a slightly
more [custom tooltip](#tooltips), then the line's data is passed up in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Slot name  | Value    | Type   |  Description                                                                      |
|--          | -------  |  ----  |                                                                                 --|
| `tooltip`  | `row`    | Object | contains the x key and all of the y keys for the x value that is hovered over     |


### Area Chart

#### Example

Area charts are similar to line charts except the area under the curve is filled in. A normal area chart with two
groups is rendered below

<div style="display: flex; justify-content: center">
    <area-chart-example></area-chart-example>
</div>

```html
<template>
   <AreaChart :plot-data="plotData" :width="500" :height="300" x-key="date"
              :margin="margin" :colors="['#ac58e5','#E0488B']"
              x-axis-label="Year" y-axis-label="Expenses"
              :y-tick-format="d => `$${d}`">
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

In order to get a stacked area chart, set the `stacked` prop to true

<div style="display: flex; justify-content: center">
    <area-chart-example :stacked="true"></area-chart-example>
</div>

```html
<template>
   <AreaChart :plot-data="plotData" :width="500" :height="300" x-key="date"
              :margin="margin" :stacked="true" :colors="['#ac58e5','#E0488B']"
              x-axis-label="Year" y-axis-label="Expenses"
              :y-tick-format="d => `$${d}`">
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

In order for the stacked bar chart to render properly, `plotdata` needs to be as an array of objects. There should be one
key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file that populates
the example stacked bar chart has "date" for the x value, and "Utilities",
"Rent", and "Insurance" for the y values. All of the axis charts
(bar charts, line charts, area charts) use the same format for data, making it easier to switch between them.

```json
[
   {
      "date": "2019",
      "Utilities": 5921,
      "Rent": 1026,
      "Insurance": 2324
   },
   {
      "date": "2020",
      "Utilities": 1539,
      "Rent": 1560,
      "Insurance": 1257
   },
   ...
]
```

#### Props

| Name          | Required             | Type     | Default | Description                                                    |
|--             | :------------------: | -------  | --      |                                                              --|
| `plot-data`   | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                             |
| `x-key`       | :heavy_check_mark:   | `String` |         | string that is the key of the x value in plotdata              |
| `width`              |                     | `Number` |  350px  | chart width in pixels                                    |
| `height`             |                     | `Number` |  250px  | chart height in pixels                                   |
| `colors`      |                      | `Array`  |         | array of colors used for areas                                 |
| `margin`      |                      | `Object` |         | object that contains the top, bottom, right, and left margins  |
| `stacked`     |                      | `Boolean`|         | changes to stacked area chart                                  |
|`fill-opacity` |                      | `Number` |  0.65   | fill opacity for each path, must be between 0 and 1            |
|`stroke-width` |                      | `Number` |  2      | stroke-width for areas                                         |
| `x-axis-label`      |                      | `String` |         | Label for the x-axis                                        |
| `y-axis-label`      |                      | `String` |         | Label for the y-axis                                        |
| `x-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |
| `y-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label       |
| `x-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis    |
| `y-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis    |

#### Events

#### Slots

The default tooltip that gives all of the values for the x value hovered over. If you want to define a slightly
more [custom tooltip](#tooltips), then the area's data is passed up in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Slot name  | Value    | Type   |  Description                                                                      |
|--          | -------  |  ----  |                                                                                 --|
| `tooltip`  | `row`    | Object | contains the x key and all of the y keys for the x value that is hovered over     |

### Donut Chart

Under construction...

### Scatter Plot

#### Example

A scatter plot helps displays relationships between two variables in a plot. Transitions are also built in for moving the
points around, as well transition the fill, radius, etc. Click the update data button below to see this in action!

<div style="display: flex; justify-content: center">
<ScatterPlotExample></ScatterPlotExample>
</div>

```html
<template>
   <ScatterPlot :plotData="plotData" xKey="profit" yKey="utility"
                :margin="margin" :width="400"
                y-axis-label="Utility" x-axis-label="Profit" :x-axis-label-shift="{ dx: 5, dy: -5}"
                :stroke="'#ff3000'" :fill="'#ff3000'" :fill-opacity="0.60"
                :x-tick-format="d => `$${d}`">
   </ScatterPlot>
</template>

<script>
   import plotData from "./ScatterPlotData.json"

   export default {
      name: "ScatterPlotExample",
      data() {
         return {
            plotData: plotData,
            margin: {top: 20, bottom: 40, right: 20, left: 50}
         }
      }
   }
</script>
```

#### Format of Data

The data that needs to be passed in as an array of objects. Each object should contain the x and y values for each point, and
these can be specified by the `xKey` and `yKey` keys. Passing in the values in the data allows for more fine-grained control
as opposed to setting one consistent style in the props (e.g. passing in different fill values for each point instead of
passing in one fill value as a prop). The table below has all of the possible keys that can be included for an objects

| Name         | Required           |  Type     |  Description                                            |
|--            | :-----------:      |  -------  |                                                       --|
| `x-key`      | :heavy_check_mark: |  `String` |  x value for the point                                  |
| `y-key`      | :heavy_check_mark: |`String`   |  y value for the point                                  |
| `radius`     |                    | `Number`  |  radius of the point                                    |
| `fill`       |                    |`String`   |  fill of the point                                      |
| `stroke`     |                    | `String`  |  stroke of the point                                    |

Here is an example below that the scatterplot above uses

```json
[
  {
    "profit": 103,
    "utility": 9,
    "radius": 5,
    "fill": "#ff3000"
  },
  {
    "profit": 359,
    "utility": 54,
    "radius": 5,
    "fill": "#ff3000"
  },
   ...
]
```

#### Props

| Name                | Required             | Type     | Default | Description                                                    |
|--                   | :------------------: | -------  | --      |                                                              --|
| `plot-data`         | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                             |
| `x-key`             | :heavy_check_mark:   | `String` |         | string that is the key of the x values in plotdata             |
| `y-key`             | :heavy_check_mark:   | `String` |         | string that is the key of the y values in plotdata             |
| `width`             |                      | `Number` |  350px  | chart width in pixels                                          |
| `height`            |                      | `Number` |  250px  | chart height in pixels                                         |
| `margin`            |                      | `Object` |         | object that contains the top, bottom, right, and left margins  |
|`radius`             |                      | `Number` |  5      | radius for all points                                          |
|`fill`               |                      | `String` |  black  | fill for all points                                            |
|`fill-opacity`       |                      | `Number` |  1      | fill opacity for all points, must be between 0 and 1          |
|`stroke`             |                      | `String` |  black  | stroke for all points                                         |
|`stroke-opacity`     |                      | `Number` |  1      | stroke opacity for all points, must be between 0 and 1        |
| `x-axis-label`      |                      | `String` |         | Label for the x-axis                                          |
| `y-axis-label`      |                      | `String` |         | Label for the y-axis                                          |
| `x-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label         |
| `y-axis-label-shift`|                      | `Object` |         | Takes `dx` and `dy` keys that move the location label         |
| `x-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis    |
| `y-tick-format`      |                     |`Function`|  `null`   | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis    |

#### Events

| Event     | Location    | Value Emitted  |  Description                                                                      |
|--         | --------    |------          |                                                                                 --|
| `click`   |   Circle    | `Object`       |  the object in the array that is clicked on for the circle will be emitted        |

#### Slots

| Slot name  | Value    | Type   |  Description                                                                      |
|--          | -------  |  ----  |                                                                                 --|
| `tooltip`  | `row`    | Object | contains `point` and `event` objects for point that is hovered over               |

### Hierarchical Edge Bundling

A hierarchical edge bundling chart shows relationships between different entities radially to avoid very long or wide 
hierarchical charts. 

#### Example

<div style="display: flex; justify-content: center">
    <hierarchical-edge-bundling-example></hierarchical-edge-bundling-example>
</div>

```html
<template>
    <HierarchicalEdgeBundling :plot-data="plotdata"
                              :width="500" :height="500" :radial-margin="140">
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
| `plot-data`     | :heavy_check_mark:   | `Array`  |         | data necessary to create the chart                        |
| `width`         | :heavy_check_mark:   | `Number` |         | chart width in pixels                                     |
| `height`        | :heavy_check_mark:   | `Number` |         | chart height in pixels                                    |
| `radial-margin` |                      | `Number` | 70      | margin (in pixels) between the text label and edge of svg |
|`highlight-event`|                      | `String` | 'click' | Event that hightlights connections for a specific node and has two options: 'click' or 'mouseover'|

#### Events

#### Slots

### Network

Networks are useful in displaying relationships between groups. The sticky force layout below provides an easy way to
implement one. A few features are available that are quite useful: 

1. Individual nodes can be dragged
2. The entire graph of nodes and links can be panned (e.g. dragged around)
3. Nodes and links can be added or removed without having to rerender the entire component

#### Example 

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

| Name            | Required           | Type     | Default | Description                                               |
|--               | :----------------: | -------  | --      |                                                         --|
| `plot-data`     | :heavy_check_mark: | `Array`  |         | data necessary to create the chart                        |
| `width`         | :heavy_check_mark: | `Number` |         | chart width in pixels                                     |
| `height`        | :heavy_check_mark: | `Number` |         | chart height in pixels                                    |
| `node-radius`   |                    | `Number` |   8     | size of node circles                                      |
| `force-strength`|                    | `Number` |   -80   | [force](https://github.com/d3/d3-force#many-body) causing nodes to repel each other   |

#### Events
| Event        | Location       | Value Emitted     |  Description                                                                      |
|--            | --------       |------             |                                                                                 --|
| `click`      |   Circle       | `Object`          |  The entire node object is emitted containing node name, x, y, and any other keys |

#### Slots

## Additional Components

### Basic Legend

Legends are useful for many charts and we provide a simple one in our library. Here is an example that shows how to use a
simple legend component in both the vertical and horizontal alignments.

#### Example

<base-legend-example></base-legend-example>

```html
<template>
    <div>
        <p>Horizontal</p>
        <BaseLegend :legend-data="legendData" alignment="'horizontal'"></BaseLegend>
        <p>Vertical</p>
        <BaseLegend :legend-data="legendData" alignment="'vertical'"></BaseLegend>
    </div>
</template>

<script>
export default {
    name: "BaseLegendExample",
    data() {
        return {
            legendData: [
                {name: "Utilities", color: '#717e9b'},
                {name: "Rent", color: '#b6b6db'},
                {name: "Insurance", color: '#bcd8f1'}
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
    "name": "Utilities", "color": "#717e9b"
  },
  {
    "name": "Rent", "color": "#b6b6db"
  },
  {
    "name": "Insurance", "color": "#bcd8f1"
  }
]
```

#### Props
| Name            | Required           | Type     | Default     | Description                                            |
|--               | :----------------: | -------  | --          |                                                      --|
| `legend-data`   | :heavy_check_mark: | `Object` |             | data necessary to create the legend                    |
| `alignment`     |                    | `String` | 'horizontal'| Two options for alignment: 'vertical' or 'horizontal'  |
| `enable-toggle` |                    | `Boolean`| false       | allows the items in the legend to be clickable and emits the object on click|

#### Events
| Event    | Location       | Value Emitted   |  Description                                                            |
|--        | --------       |------           |                                                                       --|
| `click`  | Marker or text | `Object`        | If `enable-toggle` prop is true, the entire item object (name and color) is emitted  |

### Loading Spinner

The loading spinner is useful when data is being fetched from an API and there is some lag before the GUI receives it.

#### Example 

<div style="display: flex; justify-content: center">
<loader-spinning></loader-spinning>
</div>


```html
<template>
    <LoaderSpinning/>
</template>
```


## Component Parts

### Tooltips

We provide default tooltips for some of the charts, which make it easy to get up and running quickly. However, it is
common for users to want to define a slightly more custom tooltip that might better fit their needs. This can be done
with [Slots](https://vuejs.org/v2/guide/components-slots.html)
and [Scoped Slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots). Each chart that has a
default tooltip will also have a slot that passes up data about the part of the chart that is hovered on.

#### Example 
Here is an example that defines a custom tooltip for the same stacked bar chart using the x_label, y_label, x_value,
and y_value of the bar that is hovered over, which
are [destructured](https://vuejs.org/v2/guide/components-slots.html#Destructuring-Slot-Props) from the `tooltip` slot

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example :tooltip="true"></stacked-bar-chart-example>
</div>

```html
<template>
   <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                    :margin="margin" x-key="date"
                    x-axis-label="Year" y-axis-label="Expenses"
                    :y-tick-format="d => `$${d}`">
      <template v-slot:tooltip="{ bar }">
         <p>Here are values when you hover over a bar</p>
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
            margin: {top: 20, bottom: 35, left: 60, right: 20},
        }
    }
}
</script>
```

### Annotations

The plots that contain x and y axes also have the ability to add annotations.

#### Example 

The chart below shows adding a horizontal dashed line to stacked bar chart which might indicate, for example, a max
budget line.

<div style="display: flex; justify-content: center">
<stacked-bar-chart-example :annotation="true"></stacked-bar-chart-example>
</div>

```html
<template>
   <StackedBarChart :plot-data="plotData" x-key="date"
                    :margin="margin" x-axis-label="Year" y-axis-label="Expenses"
                    :annotations="annotations" :y-tick-format="d => `$${d}`">
   </StackedBarChart>
</template>

<script>
import SBCdata from './Budget3Groups.json'

export default {
   name: "StackedBarChartExample",
   data() {
      return {
         plotData: SBCdata,
         margin: {top: 20, bottom: 35, left: 55, right: 70},
         annotations: [
            {
               type: "line", axis: "y", color: "#ef0202", value: 8000, dash: true,
               label: 'Max Budget', labeldx: 35, labeldy: -6
            }]
      }
   }
}
</script>
```

Another example here adds two vertical lines to a line chart indicating specific start and end times for funding

<div style="display: flex; justify-content: center">
<line-chart-example :annotation="true"></line-chart-example>
</div>

```html
<template>
   <LineChart :plot-data="plotData" x-key="date"
              :width="450" :height="250" :margin="margin"
              x-axis-label="Year" y-axis-label="Expenses"
              :annotations="annotations" :y-tick-format="d => `$${d}`">
   </LineChart>
</template>

<script>
import LCdata from "./Budget3Groups.json"

export default {
   name: "LineChartExample",
   data() {
      return {
         plotData: LCdata,
         margin: {top: 20, bottom: 30, left: 50, right: 20},
         annotations: [
            {
               type: "line", axis: "x", color: "#b3080e",
               label: "Start Date", labeldy: -5,
               value: new Date(2019, 6, 0)
            },
            {
               type: "line", axis: "x", color: "#b3080e",
               label: "End Date", labeldy: -5,
               value: new Date(2020, 9, 0)
            },
         ]
      }
   }
}
</script>

```

#### Format

Annotations need to be an array of objects, even if it is only one object. The annotation object requires the following
properties

| Name         | Required             | Type     | Default    | Description                                                      |
|--            | :------------------: | -------  | --         |                                                                --|
| `type`       | :heavy_check_mark:   | `String` |            | type of annotation, current options: 'line'                      |
| `axis`       | :heavy_check_mark:   | `String` |            | options: "x" or "y"                                              |
| `value`      | :heavy_check_mark:   | `Number` |            | value on the x or y axis                                         |
| `color`      |                      | `String` |   Black    | color name, hex code, or rgb value                               |
| `dash`       |                      | `Boolean`|  False     | whether line should have dashes or not                           |
| `label`      |                      | `String` |            | label used for annotation                                        |
| `labelAnchor`|                      | `String` |  'middle'  | text-anchor property for label. can be 'start', 'end' or 'middle'|
| `labeldx`    |                      | `Number` |            | shift label in x direction                                       |
| `labeldy`    |                      | `Number` |            | shift label in y direction                                       |


<small>Copyright 2021 MITRE Corporation. Approved for Public Release - Distribution Unlimited. Case #21-0751</small>
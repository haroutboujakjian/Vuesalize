# Vuesalize

## What's the point?

Building interactive visualizations on the web can be hard, and it can be even harder when you would like to leverage
existing visualization libraries inside a Vue.js project. The goal of `Vuesalize` is to simplify this process by
providing a set of chart components (and a couple other components) that are commonly used in building interactive
visualizations
on the web. The charts are built using a combination of [Vue.js](https://vuejs.org/v2/guide/)
and [D3.js](https://d3js.org/). The main rationale for this approach is to fully embrace the Vue paradigm and move the
SVG definitions to the template (HTML), which allows Vue to handle creating and removing elements on the page.
This is analogous to the "enter/update/exit" strategy used in D3 but specifically taking advantage of the virtual DOM.
By building charts where the SVG is defined in Vue's template, we can not only send down props to update the chart, but
can also emit events on interactions (e.g. click, mousover, etc.) and offer scoped slots for custom tooltips!

## Installation

::: warning
Starting with version 1.0.1, Vuesalize will only support Vue 3. If you'd like to use Vuesalize with Vue 2, use the last
available version 0.2.0.
:::

The library is currently available on npm, and
it is possible to use it with Vue CLI (recommended) or directly with the CDN version in a `<script>` tag.

### Vue CLI

The steps to use is it in a project created using the Vue CLI are as follows:

1. Install from npm using `npm install vuesalize`
2. In `main.js`, import the Vuesalize plugin and install it using `use()`. Here is an example below for a project

```js
import { createApp } from 'vue'
import App from './App.vue'

import 'vuesalize/dist/vuesalize.css'
import Vuesalize from 'vuesalize'

createApp(App).use(Vuesalize).mount('#app')
```

3. Start using the components in templates. For example, if the `StackedBarChart` and `LoaderSpinning` components were
   going to be used in a default `App.vue` file, this is how it would be setup:

```html

<script setup>
  const barchartdata = [
    { "date": 2019, "Utilities": 21, "Rent": 16, "Insurance": 22 },
    { "date": 2020, "Utilities": 19, "Rent": 10, "Insurance": 17 },
  ]
</script>

<template>
  <loader-spinning />
  <StackedBarChart :plot-data="barchartdata" x-key="date"></StackedBarChart>
</template>

<style scoped></style>
```

### CDN

It is quite simple to get started with the CDN. The vuesalize javascript and css files need to be linked (lines 5 and
7 below). Then after creating an app instance `app = createApp({...})`, you can call `app.use(Vuesalize)` to install the
plugin. As with other packages, it is also necessary to link the official Vue 3 package (line 6) before vuesalize.

```html

<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Browser test</title>
  <link rel="stylesheet" href="https://unpkg.com/vuesalize@1.0.1/dist/vuesalize.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/vuesalize@1.0.1/dist/vuesalize.umd.js"></script>
</head>
<body>
<div id="app">
  <loader-spinning></loader-spinning>
  <stacked-bar-chart :plot-data="barchartdata" x-key="date"></stacked-bar-chart>
</div>

<script>
  const { createApp } = Vue

  const app = createApp({
    data() {
      return {
        barchartdata: [
          { "date": 2019, "Utilities": 21, "Rent": 16, "Insurance": 22 },
          { "date": 2020, "Utilities": 19, "Rent": 10, "Insurance": 17 },
        ]
      }
    }
  })

  app.use(Vuesalize)

  app.mount('#app')

</script>
</body>
</html>
```

Examples of how each of the chart components can be used can be found in the sections below. Additionally, the SFC
component templates can be retrieved from [github](https://github.com/haroutboujakjian/Vuesalize/tree/master/src)

## Charts

### Stacked Bar Chart

#### Example

Here is a simple example that constructs a stacked bar chart representing a set of generic expenses.

<div style="display: flex; justify-content: center">
<ClientOnly>
<stacked-bar-chart-example></stacked-bar-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 35, left: 60, right: 20 },
      }
    }
  }
</script>
```

Alternatively, it's possible to get a horizontal bar chart by passing in 'horizontal' for the `direction` prop.

<div style="display: flex; justify-content: center">
<ClientOnly>
<stacked-bar-chart-example :horizontal="true"></stacked-bar-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 35, left: 60, right: 20 },
      }
    }
  }
</script>
```

In order for the stacked bar chart to render properly, `plot-data` needs to be as an array of objects. There should be
one key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file (snippet below)
that populates the example stacked bar chart has "date" for the x value, and "Utilities",
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

| Name                   |      Required      | Type       | Default    | Description                                                                                          |
|------------------------|:------------------:|------------|------------|------------------------------------------------------------------------------------------------------|
| `plot-data`            | :heavy_check_mark: | `Array`    |            | data necessary to create the chart                                                                   |
| `x-key`                | :heavy_check_mark: | `String`   |            | string that is the key of the x value in plotdata                                                    |
| `width`                |                    | `Number`   | 350px      | chart width in pixels                                                                                |
| `height`               |                    | `Number`   | 250px      | chart height in pixels                                                                               |
| `colors`               |                    | `Array`    |            | array of colors used for each bar                                                                    |
| `direction`            |                    | `String`   | 'vertical' | direction of the chart. can be 'vertical' or 'horizontal'                                            |
| `bar-axis-location`    |                    | `String`   | 'bottom'   | placement of the x-axis for horizontal layout. can be 'bottom' or 'top'                              |
| `margin`               |                    | `Object`   |            | object that contains the top, bottom, right, and left margins                                        |
| `enable-tooltip`       |                    | `Boolean`  | True       | Turn default tooltip on or off                                                                       |
| `padding-between-bars` |                    | `Number`   | 0.10       | padding between the bars in a group. Must be between `0` and `1`                                     |
| `x-axis-label`         |                    | `String`   |            | Label for the x-axis                                                                                 |
| `y-axis-label`         |                    | `String`   |            | Label for the y-axis                                                                                 |
| `x-axis-label-shift`   |                    | `Object`   |            | Takes `dx` and `dy` keys that move the location label                                                |
| `y-axis-label-shift`   |                    | `Object`   |            | Takes `dx` and `dy` keys that move the location label                                                |
| `x-tick-format`        |                    | `Function` | `null`     | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis |
| `y-tick-format`        |                    | `Function` | `null`     | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis |
| `x-min`                |                    | `Number`   |            | Minimum value used for x scale                                                                       |
| `x-max`                |                    | `Number`   |            | Maximum value used for x scale                                                                       |
| `y-min`                |                    | `Number`   |            | Minimum value used for y scale                                                                       |
| `y-max`                |                    | `Number`   |            | Maximum value used for y scale                                                                       |
| `x-ticks`              |                    | `Number`   | 5          | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the x-axis           |
| `y-ticks`              |                    | `Number`   | 5          | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the y-axis           |

#### Events

| Event   | Location  | Value Emitted | Description                                                                               |
|---------|-----------|---------------|-------------------------------------------------------------------------------------------|
| `click` | Rectangle | `Object`      | `x_label`, `y_label`, `x_value`, and `y_value` of the bar in the stack that is clicked on |

#### Slots

We provide a default tooltip that gives the x and y value for the bar that is hovered over. If you want to define a
slightly more [custom tooltip](#tooltips), then the bar's data is passed up in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Slot name | Value | Type   | Description                                                                                               |
|-----------|-------|--------|-----------------------------------------------------------------------------------------------------------|
| `tooltip` | `bar` | Object | contains `x_label`, `y_label`, `x_value`, and `y_value` keys of the bar in the stack that is hovered over |

### Grouped Bar Chart

#### Example

Here is an example using the same expenses data as the stacked bar chart above. In this case, the bars are grouped.

<div style="display: flex; justify-content: center">
<ClientOnly>
    <grouped-bar-chart-example></grouped-bar-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 35, left: 55, right: 20 }
      }
    }
  }
</script>
```

And, again, it's possible to get a horizontal bar chart by passing in 'horizontal' for the direction prop.

<div style="display: flex; justify-content: center">
<ClientOnly>
    <grouped-bar-chart-example :horizontal="true"></grouped-bar-chart-example> 
</ClientOnly>
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
        margin: { top: 20, bottom: 35, left: 55, right: 20 }
      }
    }
  }
</script>
```

#### Format of Data

In order for the stacked bar chart to render properly, `plot-data` needs to be as an array of objects. There should be
one key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file (snippet below)
that populates the example grouped bar chart has "date" for the x value, and "Utilities",
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

| Name                     |      Required      | Type       | Default    | Description                                                                                          |
|--------------------------|:------------------:|------------|------------|------------------------------------------------------------------------------------------------------|
| `plot-data`              | :heavy_check_mark: | `Array`    |            | data necessary to create the chart                                                                   |
| `x-key`                  | :heavy_check_mark: | `String`   |            | string that is the key of the x value in plotdata                                                    |
| `width`                  |                    | `Number`   | 350px      | chart width in pixels                                                                                |
| `height`                 |                    | `Number`   | 250px      | chart height in pixels                                                                               |
| `colors`                 |                    | `Array`    |            | array of colors used for each bar                                                                    |
| `direction`              |                    | `String`   | 'vertical' | direction of the chart. can be 'vertical' or 'horizontal'                                            |
| `bar-axis-location`      |                    | `String`   | 'bottom'   | placement of the x-axis for horizontal layout. can be 'bottom' or 'top'                              |
| `padding-between-bars`   |                    | `Number`   | 0.15       | padding between the bars in a group. Must be between `0` and `1`                                     |
| `padding-between-groups` |                    | `Number`   | 0.15       | padding between the groups of bars. Must be between `0` and `1`                                      |
| `margin`                 |                    | `Object`   |            | object that contains the top, bottom, right, and left margins                                        |
| `enable-tooltip`         |                    | `Boolean`  | True       | Turn default tooltip on or off                                                                       |
| `x-axis-label`           |                    | `String`   |            | Label for the x-axis                                                                                 |
| `y-axis-label`           |                    | `String`   |            | Label for the y-axis                                                                                 |
| `x-axis-label-shift`     |                    | `Object`   |            | Takes `dx` and `dy` keys that move the location label                                                |
| `y-axis-label-shift`     |                    | `Object`   |            | Takes `dx` and `dy` keys that move the location label                                                |
| `x-tick-format`          |                    | `Function` | `null`     | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis |
| `y-tick-format`          |                    | `Function` | `null`     | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis |
| `x-min`                  |                    | `Number`   |            | Minimum value used for x scale                                                                       |
| `x-max`                  |                    | `Number`   |            | Maximum value used for x scale                                                                       |
| `y-min`                  |                    | `Number`   |            | Minimum value used for y scale                                                                       |
| `y-max`                  |                    | `Number`   |            | Maximum value used for y scale                                                                       |
| `x-ticks`                |                    | `Number`   | 5          | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the x-axis           |
| `y-ticks`                |                    | `Number`   | 5          | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the y-axis           |

#### Events

#### Slots

### Line Chart

The line chart component allows for one or more lines to be plotted.

#### Example

<div style="display: flex; justify-content: center">
<ClientOnly>
    <line-chart-example></line-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 30, left: 50, right: 20 }
      }
    }
  }
</script>
```

Using a linear scale instead of a time scale is as simple as passing the prop `:use-time-scale-x-axis="false"` and you
can even show the points that create the line chart by passing in `:show-points=true`

<div style="display: flex; justify-content: center">
<ClientOnly>
    <line-chart-example :linear-scale="true"></line-chart-example>
</ClientOnly>
</div>

```html

<template>
  <LineChart :plot-data="plotDataLinear" x-key="days"
             :use-time-scale-x-axis="false" :x-axis-label-shift="{dy: -5}"
             :width="450" :height="250" :margin="margin"
             x-axis-label="Days Since Start of New Program" y-axis-label="Expenses"
             :show-points="true" :point-radius="3"
             :y-tick-format="d => `$${d}`">
  </LineChart>
</template>
```

#### Format of Data

In order for the stacked bar chart to render properly, `plot-data` needs to be as an array of objects. There should be
one key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file (snippet below)
that populates the example line chart has "date" for the x value, and "Utilities",
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

| Name                    |      Required      | Type       | Default | Description                                                                                                                                            |
|-------------------------|:------------------:|------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `plot-data`             | :heavy_check_mark: | `Array`    |         | data necessary to create the chart                                                                                                                     |
| `x-key`                 | :heavy_check_mark: | `String`   |         | string that is the key of the x value in plotdata                                                                                                      |
| `use-time-scale-x-axis` |                    | `Boolean`  | true    | used to indicate whether a time scale or linear scale is used for x axis. if set to `true` pass in strings that can be converted to dates for x values |
| `width`                 |                    | `Number`   | 350px   | chart width in pixels                                                                                                                                  |
| `height`                |                    | `Number`   | 250px   | chart height in pixels                                                                                                                                 |
| `colors`                |                    | `Array`    |         | array of colors used for each line                                                                                                                     |
| `margin`                |                    | `Object`   |         | object that contains the top, bottom, right, and left margins                                                                                          |
| `enable-tooltip`        |                    | `Boolean`  | True    | Turn default tooltip on or off                                                                                                                         |
| `stroke-width`          |                    | `Number`   | 2       | stroke-width for areas                                                                                                                                 |
| `x-axis-label`          |                    | `String`   |         | Label for the x-axis                                                                                                                                   |
| `y-axis-label`          |                    | `String`   |         | Label for the y-axis                                                                                                                                   |
| `x-axis-label-shift`    |                    | `Object`   |         | Takes `dx` and `dy` keys that move the location label                                                                                                  |
| `y-axis-label-shift`    |                    | `Object`   |         | Takes `dx` and `dy` keys that move the location label                                                                                                  |
| `x-tick-format`         |                    | `Function` | `null`  | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis                                                   |
| `y-tick-format`         |                    | `Function` | `null`  | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis                                                   |
| `y-min`                 |                    | `Number`   |         | Minimum value used for y scale                                                                                                                         |
| `y-max`                 |                    | `Number`   |         | Maximum value used for y scale                                                                                                                         |
| `x-ticks`               |                    | `Number`   | 5       | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the x-axis                                                             |
| `y-ticks`               |                    | `Number`   | 5       | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the y-axis                                                             |
| `show-points`           |                    | `Boolean`  | `false` | Show points that construct the line chart                                                                                                              |
| `point-radius`          |                    | `Number`   | 4       | Radius of points if there shown with `show-points=true`                                                                                                |

#### Events

#### Slots

The default tooltip that gives all of the values for the x value hovered over. If you want to define a slightly
more [custom tooltip](#tooltips), then the line's data is passed up in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Slot name | Value | Type   | Description                                                                   |
|-----------|-------|--------|-------------------------------------------------------------------------------|
| `tooltip` | `row` | Object | contains the x key and all of the y keys for the x value that is hovered over |

### Area Chart

#### Example

Area charts are similar to line charts except the area under the curve is filled in. A simple area chart with two
groups is rendered below

<div style="display: flex; justify-content: center">
<ClientOnly>
    <area-chart-example></area-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 30, left: 55, right: 20 }
      }
    }
  }
</script>
```

In order to get a stacked area chart, set the `stacked` prop to true

<div style="display: flex; justify-content: center">
<ClientOnly>
    <area-chart-example :stacked="true"></area-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 30, left: 55, right: 20 }
      }
    }
  }
</script>
```

#### Format of Data

In order for the stacked bar chart to render properly, `plot-data` needs to be as an array of objects. There should be
one key for the x value, and all the other keys will be for y values. The `Budget3Groups.json` data file (snippet below)
that populates the example area chart has "date" for the x value, and "Utilities",
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

| Name                 |      Required      | Type       | Default | Description                                                                                          |
|----------------------|:------------------:|------------|---------|------------------------------------------------------------------------------------------------------|
| `plot-data`          | :heavy_check_mark: | `Array`    |         | data necessary to create the chart                                                                   |
| `x-key`              | :heavy_check_mark: | `String`   |         | string that is the key of the x value in plotdata                                                    |
| `width`              |                    | `Number`   | 350px   | chart width in pixels                                                                                |
| `height`             |                    | `Number`   | 250px   | chart height in pixels                                                                               |
| `colors`             |                    | `Array`    |         | array of colors used for areas                                                                       |
| `margin`             |                    | `Object`   |         | object that contains the top, bottom, right, and left margins                                        |
| `stacked`            |                    | `Boolean`  |         | changes to stacked area chart                                                                        |
| `fill-opacity`       |                    | `Number`   | 0.65    | fill opacity for each path, must be between 0 and 1                                                  |
| `stroke-width`       |                    | `Number`   | 2       | stroke-width for areas                                                                               |
| `x-axis-label`       |                    | `String`   |         | Label for the x-axis                                                                                 |
| `y-axis-label`       |                    | `String`   |         | Label for the y-axis                                                                                 |
| `x-axis-label-shift` |                    | `Object`   |         | Takes `dx` and `dy` keys that move the location label                                                |
| `y-axis-label-shift` |                    | `Object`   |         | Takes `dx` and `dy` keys that move the location label                                                |
| `x-tick-format`      |                    | `Function` | `null`  | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis |
| `y-tick-format`      |                    | `Function` | `null`  | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis |
| `x-ticks`            |                    | `Number`   | 5       | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the x-axis           |
| `y-ticks`            |                    | `Number`   | 5       | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the y-axis           |

#### Events

#### Slots

The default tooltip that gives all of the values for the x value hovered over. If you want to define a slightly
more [custom tooltip](#tooltips), then the area's data is passed up in
a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

| Slot name | Value | Type   | Description                                                                   |
|-----------|-------|--------|-------------------------------------------------------------------------------|
| `tooltip` | `row` | Object | contains the x key and all of the y keys for the x value that is hovered over |

### Scatter Plot

#### Example

A scatter plot helps display relationships between two variables in a plot. Transitions are built in for moving the
points around, as well transitioning the fill, radius, etc. Click the update data button below to see this in action!

<div style="display: flex; justify-content: center">
<ClientOnly>
<ScatterPlotExample></ScatterPlotExample>
</ClientOnly>
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
        margin: { top: 20, bottom: 40, right: 20, left: 50 }
      }
    }
  }
</script>
```

#### Format of Data

The data format required for the `plot-data` prop is an array of objects. each object should contain the x and y values
for each point, and these can be specified by the `x-key` and `y-key` keys. Additionally, passing in styling values in
each object offers more fine-grained control as opposed to setting one consistent style in the props (e.g. passing in
different fill values for each point instead of passing in one fill value as a prop). The table below has all the
possible keys that can be included for an objects

| Name            |      Required      | Type     | Description                                |
|-----------------|:------------------:|----------|--------------------------------------------|
| `[x-key]`       | :heavy_check_mark: | `String` | x value for the point                      |
| `[y-key]`       | :heavy_check_mark: | `String` | y value for the point                      |
| `radius`        |                    | `Number` | radius of the point                        |
| `fill`          |                    | `String` | fill of the point                          |
| `fillOpacity`   |                    | `Number` | fill opacity of the point                  |
| `stroke`        |                    | `String` | stroke of the point                        |
| `strokeOpacity` |                    | `Number` | stroke opacity of the point                |
| `strokeWidth`   |                    | `Number` | stroke width of the point                  |
| `label`         |                    | `String` | text that can be added on top of the point |
| `labelColor`    |                    | `String` | text color of label                        |
| `labelSize`     |                    | `Number` | size of label                              |

Here is a snippet of the data that the example scatterplot above uses

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

| Name                 |      Required      | Type       | Default | Description                                                                                           |
|----------------------|:------------------:|------------|---------|-------------------------------------------------------------------------------------------------------|
| `plot-data`          | :heavy_check_mark: | `Array`    |         | data necessary to create the chart                                                                    |
| `x-key`              | :heavy_check_mark: | `String`   |         | string that is the key of the x values in plotdata                                                    |
| `y-key`              | :heavy_check_mark: | `String`   |         | string that is the key of the y values in plotdata                                                    |
| `width`              |                    | `Number`   | 350px   | chart width in pixels                                                                                 |
| `height`             |                    | `Number`   | 250px   | chart height in pixels                                                                                |
| `margin`             |                    | `Object`   |         | object that contains the top, bottom, right, and left margins                                         |
| `radius`             |                    | `Number`   | 5       | radius for all points                                                                                 |
| `fill`               |                    | `String`   | black   | fill for all points                                                                                   |
| `fill-opacity`       |                    | `Number`   | 1       | fill opacity for all points, must be between 0 and 1                                                  |
| `stroke`             |                    | `String`   | black   | stroke for all points                                                                                 |
| `stroke-opacity`     |                    | `Number`   | 1       | stroke opacity for all points, must be between 0 and 1                                                |
| `stroke-width`       |                    | `Number`   | 1       | stroke width for all points                                                                           |
| `x-axis-label`       |                    | `String`   |         | Label for the x-axis                                                                                  |
| `y-axis-label`       |                    | `String`   |         | Label for the y-axis                                                                                  |
| `x-axis-label-shift` |                    | `Object`   |         | Takes `dx` and `dy` keys that move the location label                                                 |
| `y-axis-label-shift` |                    | `Object`   |         | Takes `dx` and `dy` keys that move the location label                                                 |
| `x-axis-translate`   |                    | `Number`   | 0       | Value that translates the x-axis starting from bottom                                                 |
| `y-axis-translate`   |                    | `Number`   | 0       | Value that translates the y-axis starting from left                                                   |
| `x-tick-format`      |                    | `Function` | `null`  | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the x-axis  |
| `y-tick-format`      |                    | `Function` | `null`  | Function passed into d3's [tickFormat](https://github.com/d3/d3-axis#axis_tickFormat) for the y-axis  |
| `x-min`              |                    | `Number`   |         | Minimum value used for x scale                                                                        |
| `x-max`              |                    | `Number`   |         | Maximum value used for x scale                                                                        |
| `y-min`              |                    | `Number`   |         | Minimum value used for y scale                                                                        |
| `y-max`              |                    | `Number`   |         | Maximum value used for y scale                                                                        |
| `x-tick-values`      |                    | `Array`    | `null`  | Argument passed into d3's [ticksValues](https://github.com/d3/d3-axis#axis_tickValues) for the x-axis |
| `y-tick-values`      |                    | `Array`    | `null`  | Argument passed into d3's [ticksValues](https://github.com/d3/d3-axis#axis_tickValues) for the y-axis |
| `x-ticks`            |                    | `Number`   | 5       | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the x-axis            |
| `y-ticks`            |                    | `Number`   | 5       | Argument passed into d3's [ticks](https://github.com/d3/d3-axis#axis_ticks) for the y-axis            |
| `label-color`        |                    | `String`   | black   | Text color of all labels                                                                              |
| `label-size`         |                    | `Number`   | 10      | Size of all labels                                                                                    |

#### Events

| Event   | Location | Value Emitted | Description                                                               |
|---------|----------|---------------|---------------------------------------------------------------------------|
| `click` | Circle   | `Object`      | the object in the array that is clicked on for the circle will be emitted |

#### Slots

| Slot name | Value | Type   | Description                                                         |
|-----------|-------|--------|---------------------------------------------------------------------|
| `tooltip` | `row` | Object | contains `point` and `event` objects for point that is hovered over |

### Contour Plot

#### Example

Contour plots display relationships between 3 variables by plotting the "surface" on a 2d plane. The component actually
performs a 2D KDE (using the [fast-kde](https://github.com/uwdata/fast-kde) package) under the hood
on the points passed in. Play with the width and height sliders below to see the plot change size while maintaining its
aspect ratio!

<div style="display: flex; justify-content: center">
<ClientOnly>
<ContourPlotExample></ContourPlotExample>
</ClientOnly>
</div>

```html

<template>
  <ContourPlot
    x-key="profit"
    y-key="utility"
    :width="width"
    :height="height"
    :use-thresholds="false"
    :plot-data="plotData">
  </ContourPlot>
</template>

<script>
  import plotData from "./ScatterPlotData.json"

  export default {
    name: "ContourPlotExample",
    data() {
      return {
        plotData,
        width: 300,
        height: 300,
      }
    },
  }
</script>
```

#### Format of Data

The data format required for the `plot-data` prop is an array of objects. each object should contain the x and y values
for each point, and these can be specified by the `x-key` and `y-key` keys. The table below has all the possible keys
that can be included for an objects

| Name      |      Required      | Type     | Description           |
|-----------|:------------------:|----------|-----------------------|
| `[x-key]` | :heavy_check_mark: | `String` | x value for the point |
| `[y-key]` | :heavy_check_mark: | `String` | y value for the point |

Here is a snippet of the data that the example scatterplot above uses

```json
[
  {
    "profit": 103,
    "utility": 9
  },
  {
    "profit": 359,
    "utility": 54
  },
  ...
]
``` 

#### Props

| Name             |      Required      | Type       | Default   | Description                                                                                                                                                                       |
|------------------|:------------------:|------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `plot-data`      | :heavy_check_mark: | `Array`    |           | data necessary to create the chart                                                                                                                                                |
| `x-key`          | :heavy_check_mark: | `String`   |           | string that is the key of the x values in plotdata                                                                                                                                |
| `y-key`          | :heavy_check_mark: | `String`   |           | string that is the key of the y values in plotdata                                                                                                                                |
| `width`          |                    | `Number`   | 256px     | chart width in pixels                                                                                                                                                             |
| `height`         |                    | `Number`   | 256px     | chart height in pixels                                                                                                                                                            |
| `stroke-width`   |                    | `Number`   | 1         | stroke width of each contour polygon                                                                                                                                              |
| `stroke-opacity` |                    | `Number`   | 1         | stroke opacity of each contour polygon                                                                                                                                            |
| `bins`           |                    | `Array`    | [256,256] | number of bins used for internal grid and is passed into [fast-kde](https://github.com/uwdata/fast-kde#2d-density-estimation-1) bins argument                                     |
| `bandwidth`      |                    | `Array`    | undefined | requires array of two numbers (e.g. [1, 1]). bandwidth passed in to [fast-kde](https://github.com/uwdata/fast-kde#2d-density-estimation-1) bandwidth argument.                    |
| `color-scale`    |                    | `Function` | black     | d3 [scale](https://github.com/d3/d3-scale) that is used for coloring the contours                                                                                                 |
| `use-thresholds` |                    | `Boolean`  | true      | determines whether to use exact thresholds from color scale. does not require an explicit `color-scale` prop to be passed in. setting to `false` will result in smoother contours |

#### Events

#### Slots

### Donut Chart

Under construction...

## Additional Components

### Basic Legend

#### Example

Legends are useful for many charts and a simple component is provided in the library. The examples below show how to use
the component in both the vertical and horizontal alignments. The vertical legend also has the `enable-toggle` prop
added, which allows the legend to be used like a set of checkboxes by emitting a click event with the selected objects'
data.

<base-legend-example></base-legend-example>

```html

<template>
  <div>
    <p>Horiztonal</p>
    <BaseLegend :legend-data="legendData" :alignment="'horizontal'"></BaseLegend>
    <p>Vertical</p>
    <BaseLegend :legend-data="legendDataToggleEnabled" :alignment="'vertical'"
                enable-toggle>
    </BaseLegend>
  </div>
</template>

<script>
  export default {
    name: "BaseLegendExample",
    data() {
      return {
        legendData: [
          { name: "Utilities", color: '#717e9b' },
          { name: "Rent", color: '#b6b6db' },
          { name: "Insurance", color: '#bcd8f1' }
        ],
        legendDataToggleEnabled: [
          { name: "Utilities", color: '#717e9b', selected: true },
          { name: "Rent", color: '#b6b6db' },
          { name: "Insurance", color: '#bcd8f1', selected: true }
        ]
      }
    }
  }
</script>
```

#### Format of Data

The legend component takes in a simple array of objects that contains name and color keys. If `enable-toggle` is set to
true, then a selected key can also be passed in with `true` or `false` values.

```json
[
  {
    "name": "Utilities",
    "color": "#717e9b"
  },
  {
    "name": "Rent",
    "color": "#b6b6db"
  },
  {
    "name": "Insurance",
    "color": "#bcd8f1"
  }
]
```

#### Props

| Name            |      Required      | Type      | Default      | Description                                                                  |
|-----------------|:------------------:|-----------|--------------|------------------------------------------------------------------------------|
| `legend-data`   | :heavy_check_mark: | `Object`  |              | data necessary to create the legend                                          |
| `alignment`     |                    | `String`  | 'horizontal' | Two options for alignment: 'vertical' or 'horizontal'                        |
| `enable-toggle` |                    | `Boolean` | false        | allows the items in the legend to be clickable and emits the object on click |

#### Events

| Event            | Location       | Value Emitted | Description                                                                                                                     |
|------------------|----------------|---------------|---------------------------------------------------------------------------------------------------------------------------------|
| `click`          | Marker or text | `Object`      | If `enable-toggle` prop is true, the entire item object (name and color) is emitted                                             |
| `keypress.space` | Marker         | `Object`      | If `enable-toggle` prop is true and the marker to tabbed to on the keyboard, the entire item object (name and color) is emitted |

### Loading Spinner

The loading spinner is useful when data is being fetched from an API and there is some lag before the GUI receives it.

#### Example

<div style="display: flex; justify-content: center; margin-bottom: 2rem">
<ClientOnly>
<loader-spinning></loader-spinning>
</ClientOnly>
</div>

```html

<template>
  <LoaderSpinning />
</template>
```

#### Props

| Name     | Required | Type     | Default | Description                           |
|----------|:--------:|----------|---------|---------------------------------------|
| `radius` |          | `Number` | 64      | radius (in px) of the loading spinner |
| `color`  |          | `String` | `#fff`  | color of the loading spinner borders  |

## Component Parts

### Tooltips

Default tooltips are provided for some of the charts, which make it easy to get up and running quickly. However, it is
common for users to want to define a slightly more custom tooltip that might better fit their needs. This can be done
with [Slots](https://vuejs.org/v2/guide/components-slots.html)
and [Scoped Slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots). Each chart that has a
default tooltip will also have a slot that passes up data about the part of the chart that is hovered on.

#### Example

Here is an example that defines a custom tooltip for the same stacked bar chart using the x_label, y_label, x_value,
and y_value of the bar that is hovered over, which
are [destructured](https://vuejs.org/v2/guide/components-slots.html#Destructuring-Slot-Props) from the `tooltip` slot

<div style="display: flex; justify-content: center">
<ClientOnly>
<stacked-bar-chart-example :tooltip="true"></stacked-bar-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 35, left: 60, right: 20 },
      }
    }
  }
</script>
```

### Annotations

The axis based plots also have the ability to add annotations.

#### Example

The chart below shows adding a horizontal dashed line to stacked bar chart which might indicate, for example, a max
budget line.

<div style="display: flex; justify-content: center">
<ClientOnly>
<stacked-bar-chart-example :annotation="true"></stacked-bar-chart-example>
</ClientOnly>
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
        margin: { top: 20, bottom: 35, left: 55, right: 70 },
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

Another example here adds two vertical lines to a line chart indicating specific start and end dates of money allocated
to marketing expenses, and the point at which sales peaked in 2022.

<div style="display: flex; justify-content: center">
<ClientOnly>
<line-chart-example :annotation="true"></line-chart-example>
</ClientOnly>
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
  import LCdata from "./Budget3Groups.json";

  export default {
    name: "LineChartExample",
    data() {
      return {
        plotData: LCdata,
        margin: { top: 20, bottom: 30, left: 50, right: 20 },
        annotations: [
          {
            type: "line",
            axis: "x",
            color: "#b3080e",
            label: "Start Date",
            labeldy: -5,
            value: new Date(2019, 6, 0)
          },
          {
            type: "line",
            axis: "x",
            color: "#b3080e",
            label: "End Date",
            labeldy: -5,
            value: new Date(2020, 6, 0)
          },
          {
            type: "circle",
            center: [new Date(2022, 0, 0), 4900],
            radius: 17,
            dash: true,
            color: "purple",
            label: "Peak Sales",
            labeldy: -25
          }
        ]
      };
    }
  };
</script>

```

#### Format

Annotations need to be an array of objects, even if it is only one object. The annotation object requires the following
properties given each annotation type

##### Lines

| Name          |      Required      | Type      | Default  | Description                                                       |
|---------------|:------------------:|-----------|----------|-------------------------------------------------------------------|
| `type`        | :heavy_check_mark: | `String`  |          | type of annotation, current options: 'line', 'rect', 'circle'     |
| `axis`        | :heavy_check_mark: | `String`  |          | options: "x" or "y"                                               |
| `value`       | :heavy_check_mark: | `Number`  |          | value on the x or y axis                                          |
| `color`       |                    | `String`  | black    | color name, hex code, or rgb value                                |
| `dash`        |                    | `Boolean` | False    | whether line should have dashes or not                            |
| `label`       |                    | `String`  |          | label used for annotation                                         |
| `labelAnchor` |                    | `String`  | 'middle' | text-anchor property for label. can be 'start', 'end' or 'middle' |
| `labeldx`     |                    | `Number`  |          | shift label in x direction                                        |
| `labeldy`     |                    | `Number`  |          | shift label in y direction                                        |

##### Circles

| Name          |      Required      | Type      | Default  | Description                                                       |
|---------------|:------------------:|-----------|----------|-------------------------------------------------------------------|
| `type`        | :heavy_check_mark: | `String`  |          | type of annotation, current options: 'line', 'rect', 'circle'     |
| `center`      | :heavy_check_mark: | `Array`   |          | center of rect. array of [x, y], e.g. [150, 200]                  |
| `radius`      | :heavy_check_mark: | `Number`  |          | radius of circle                                                  |
| `color`       |                    | `String`  | black    | color name, hex code, or rgb value                                |
| `dash`        |                    | `Boolean` | False    | whether line should have dashes or not                            |
| `label`       |                    | `String`  |          | label used for annotation                                         |
| `labelAnchor` |                    | `String`  | 'middle' | text-anchor property for label. can be 'start', 'end' or 'middle' |
| `labeldx`     |                    | `Number`  |          | shift label in x direction                                        |
| `labeldy`     |                    | `Number`  |          | shift label in y direction                                        |

##### Rectangles

| Name          |      Required      | Type      | Default  | Description                                                       |
|---------------|:------------------:|-----------|----------|-------------------------------------------------------------------|
| `type`        | :heavy_check_mark: | `String`  |          | type of annotation, current options: 'line', 'rect', 'circle'     |
| `center`      | :heavy_check_mark: | `Array`   |          | center of rect. array of [x, y], e.g. [150, 200]                  |
| `width`       | :heavy_check_mark: | `Number`  |          | width of rect.                                                    |
| `height`      | :heavy_check_mark: | `Number`  |          | height of rect                                                    |
| `color`       |                    | `String`  | black    | color name, hex code, or rgb value                                |
| `dash`        |                    | `Boolean` | False    | whether line should have dashes or not                            |
| `label`       |                    | `String`  |          | label used for annotation                                         |
| `labelAnchor` |                    | `String`  | 'middle' | text-anchor property for label. can be 'start', 'end' or 'middle' |
| `labeldx`     |                    | `Number`  |          | shift label in x direction                                        |
| `labeldy`     |                    | `Number`  |          | shift label in y direction                                        |

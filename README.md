# Vuesalize

Visit our [interactive docs page](https://haroutboujakjian.github.io/Vuesalize/)!

<a href="https://www.npmjs.com/package/vuesalize"><img src="https://img.shields.io/npm/dm/vuesalize?label=npm%20downloads&style=plastic" alt="Weekly downloads"></a>

<a href="https://bundlephobia.com/package/vuesalize"><img src="https://img.shields.io/bundlephobia/minzip/vuesalize?style=plastic" alt="Bundle Size"></a>

## What's the point?

Building interactive visualizations on the web can be hard, and it can be even harder when you would like to leverage
existing visualization libraries inside a Vue.js project. The goal of `Vuesalize` is to simplify this process by
providing a set of chart components (and a couple other components) that are commonly used in building interactive visualizations
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
    {"date": 2019, "Utilities": 21, "Rent": 16, "Insurance": 22},
    {"date": 2020, "Utilities": 19, "Rent": 10, "Insurance": 17},
]
</script>

<template>
    <loader-spinning/>
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
    <link rel="stylesheet" href="https://unpkg.com/vuesalize@2.1.0/dist/vuesalize.css">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/vuesalize@2.1.0/dist/vuesalize.umd.js"></script>
</head>
<body>
<div id="app">
   <loader-spinning></loader-spinning>
   <stacked-bar-chart :plot-data="barchartdata" x-key="date"></stacked-bar-chart>
</div>

<script>
    const {createApp} = Vue

    const app = createApp({
        data() {
            return {
                barchartdata: [
                    {"date": 2019, "Utilities": 21, "Rent": 16, "Insurance": 22},
                    {"date": 2020, "Utilities": 19, "Rent": 10, "Insurance": 17},
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
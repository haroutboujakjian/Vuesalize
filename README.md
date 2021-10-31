# Vuesalize

Visit our [interactive docs page](https://haroutboujakjian.github.io/Vuesalize/)!

<a href="https://www.npmjs.com/package/vuesalize"><img src="https://img.shields.io/npm/dm/vuesalize?label=npm%20downloads&style=plastic" alt="Weekly downloads"></a>

<a href="https://bundlephobia.com/package/vuesalize"><img src="https://img.shields.io/bundlephobia/minzip/vuesalize?style=plastic" alt="Bundle Size"></a>

## What's the point?

Building interactive visualizations on the web can be hard, and it can be even harder when you would like to leverage
existing visualization libraries inside of a Vue.js project. The goal of `Vuesalize` is to simplify this process by providing
a set of chart components (and a couple others) that are commonly used in building interactive visualizations on the web. The
charts are built using a combination of [Vue.js](https://vuejs.org/v2/guide/)
and [D3.js](https://d3js.org/). The main rationale for this approach is to fully embrace the Vue paradigm and move the SVG
definitions to the template (HTML), which allows Vue to handle creating and removing elements on the page. This is analogous
to the "enter/update/exit" strategy used in D3 but specifically taking advantage of the virtual DOM. By building charts where
the SVG is defined in Vue's template, we can not only send down props to update the chart, but can also emit events on
interactions (e.g. click, mousover, etc.) and offer scoped slots for custom tooltips!

## Installation

Any Vue.js based project will be able to take advantage of this library. The library is currently available on npm, and it is
possible to use it with Vue CLI (recommended) or directly with the CDN version in a `<script>` tag.

### Vue CLI

The steps to use is it in a project created using the Vue CLI are as follows:

1. Install from npm using `npm install vuesalize`
2. In `main.js`, add the components that are going to be used in the project. Here is an example below for a project using
   the `BaseLegend` and `LoaderSpinning` components

```js
import LoaderSpinning from 'vuesalize'
import BaseLegend from 'vuesalize'
import 'vuesalize/dist/vuesalize.css'

Vue.use(LoaderSpinning, BaseLegend)
```

3. Start using the components in templates. For example, if the `BaseLegend` and `LoaderSpinning` components were going to be
   used in a default `App.vue` file, this is how it would be setup:

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

<small>Copyright 2021 MITRE Corporation. Approved for Public Release - Distribution Unlimited. Case #21-0751</small>


# Directory of Components

This directory contains chart components and other basic components used in building interactive visualizations on the
web. The charts are built using a combination of [Vue.js](https://vuejs.org/v2/guide/) and [D3.js](https://d3js.org/).
The main rationale for this approach is to move the SVG definitions to the template (HTML) and let Vue actually control
creating/destroying elements on the page. This is analagous to the "enter/update/exit" strategy used in D3 but without
all of the pain. Additionally, the scales that control the layouts points, bar, axes, etc. are used in computed
properties in Vue. This allows for automatic updating of the chart purely based on changes in the data without having to
define an additional function to handle updates. A full explanation of the method used can be
found [here](./rationale.md)

## Charts

### Hierarchical Edge Bundling

<chart-selector :chart="'HierarchicalEdgeBundling'"></chart-selector>

### Grouped Bar Chart

### Stacked Bar Chart

### Donut Chart

### Scatter Plot

### Chloropleth

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
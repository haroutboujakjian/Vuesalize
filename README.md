# Directory of Components

This directory contains chart components and other basic components used in building interactive visualizations on the
web. The charts are built using a combination of [Vue.js](https://vuejs.org/v2/guide/) and [D3.js](https://d3js.org/).
The main rationale for doing this is to move the SVG definitions to the template (HTML) and let Vue actually control the
creating/destroying elements on the page. This is analagous to the enter/update/exit strategy used in D3 but without all
of the pain. Additionally, the scales that control the layouts points, bar, axes, etc. are used in computed properties
in Vue. This allows for automatic updating of the chart purely based on changes in the data without having to define an
additional function to handle updates.

## Components

something here to try [here](components.md)

## Hierarchical Edge Bundling

```json
{
  "first": "black",
  "second": "blue"
}
```

<base-legend v-bind:legend-data="{'first': 'black', 'second': 'blue'}"></base-legend>

## Grouped Bar Chart
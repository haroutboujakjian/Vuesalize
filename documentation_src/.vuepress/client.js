import Components from "./../../src/main"
import { defineClientConfig } from "@vuepress/client"
import AreaChartExample from "./components/AreaChartExample.vue"
import BaseLegendExample from "./components/BaseLegendExample.vue"
import GroupedBarChartExample from "./components/GroupedBarChartExample.vue"
import LineChartExample from "./components/LineChartExample.vue"
import ScatterPlotExample from "./components/ScatterPlotExample.vue"
import StackedBarChartExample from "./components/StackedBarChartExample.vue"
import ContourPlotExample from "./components/ContourPlotExample.vue"

const {
    StackedBarChart,
    BaseLegend,
    LineChart,
    GroupedBarChart,
    LoaderSpinning,
    AreaChart,
    ScatterPlot,
    ContourPlot,
} = Components

export default defineClientConfig({
    enhance({ app }) {
        app.component(StackedBarChart.name, StackedBarChart)
        app.component(BaseLegend.name, BaseLegend)
        app.component(GroupedBarChart.name, GroupedBarChart)
        app.component(LineChart.name, LineChart)
        app.component(LoaderSpinning.name, LoaderSpinning)
        app.component(AreaChart.name, AreaChart)
        app.component(ScatterPlot.name, ScatterPlot)
        app.component(ContourPlot.name, ContourPlot)

        app.component(AreaChartExample.name, AreaChartExample)
        app.component(StackedBarChartExample.name, StackedBarChartExample)
        app.component(GroupedBarChartExample.name, GroupedBarChartExample)
        app.component(ScatterPlotExample.name, ScatterPlotExample)
        app.component(LineChartExample.name, LineChartExample)
        app.component(BaseLegendExample.name, BaseLegendExample)
        app.component(ContourPlotExample.name, ContourPlotExample)
    },
})

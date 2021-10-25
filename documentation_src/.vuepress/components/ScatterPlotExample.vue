<template>
    <ScatterPlot :plotData="plotData" xKey="profit" yKey="utility" :margin="margin" :width="400"
                 y-axis-label="Utility" x-axis-label="Profit" :x-axis-label-shift="{ dx: 5, dy: -5}"
                 :stroke="'#ff3000'" :fill="'#ff3000'" :fill-opacity="0.60">
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

<style scoped>

</style>
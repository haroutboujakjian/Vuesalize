<template>
    <ScatterPlot :plotData="plotData" xKey="profit" yKey="utility">
    </ScatterPlot>
</template>

<script>
export default {
    name: "ScatterPlotExample",
    data() {
        return {
            plotData: [
                {profit: 100, utility: 0.9},
                {profit: 350, utility: 0.55},
                {profit: 400, utility: 0.40},
                {profit: 260, utility: 0.75},
                {profit: 50, utility: 0.5},
            ]
        }
    }
}
</script>

<style scoped>

</style>
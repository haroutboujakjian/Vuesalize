<template>
    <div>
        <ScatterPlot
            :plotData="plotData"
            xKey="profit"
            yKey="utility"
            :margin="margin"
            :height="height"
            :width="width"
            y-axis-label="Utility"
            x-axis-label="Profit"
            :x-axis-label-shift="{ dx: 5, dy: -5 }"
            :stroke="'#ff3000'"
            :fill="'#ff3000'"
            :fill-opacity="0.6"
            :x-tick-format="(d) => `$${d}`">
        </ScatterPlot>
        <button @click="changeData()" class="updateDataButton">
            Update Data!
        </button>
    </div>
</template>

<script>
import plotData from "./ScatterPlotData.json"

export default {
    name: "ScatterPlotExample",
    data() {
        return {
            plotData: plotData,
            initialData: plotData,
            width: 400,
            height: 300,
            updatedData: [
                { profit: 30, utility: 92, radius: 5, fill: "#1751c9" },
                { profit: 319, utility: 50, radius: 10, fill: "#1751c9" },
                { profit: 19, utility: 410, radius: 5, fill: "#1751c9" },
                { profit: 463, utility: 55, radius: 10, fill: "#ff3000" },
                { profit: 220, utility: 60, radius: 10, fill: "#ff3000" },
                { profit: 97, utility: 305, radius: 5, fill: "#ff3000" },
                { profit: 227, utility: 192, radius: 5, fill: "#ff3000" },
                { profit: 81, utility: 18, radius: 5, fill: "#ff3000" },
            ],
            margin: { top: 20, bottom: 40, right: 20, left: 50 },
            change: false,
        }
    },
    methods: {
        changeData() {
            this.plotData = this.change ? this.initialData : this.updatedData
            this.change = !this.change
        },
    },
}
</script>

<style scoped>
.updateDataButton {
    outline: none;
    border: none;
    background-color: rgb(239, 239, 239);
    color: rgb(44, 141, 98);
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 4rem;
    cursor: pointer;
}
</style>

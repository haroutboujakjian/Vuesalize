<template>
    <LineChart :plot-data="plotData" x-key="date"
               :width="450" :height="250" :margin="margin"
               x-axis-label="Year" y-axis-label="VA Budget"
               :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </LineChart>
</template>

<script>
import LCdata from "./BarChartData.json"

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

<style scoped>

</style>
<template>
    <LineChart :plot-data="plotData" :x_key="'date'"
               :width="450" :height="250"
               :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']"
               :margin="margin">
    </LineChart>
</template>

<script>
import LineChart from "./LineChart";
import LCdata from "./BarChartData.json"

export default {
    name: "LineChartExample",
    components: {
        LineChart
    },
    data() {
        return {
            plotData: LCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>

<style scoped>

</style>
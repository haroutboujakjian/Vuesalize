<template>
    <LineChart v-if="annotation" :plot-data="plotData" x-key="date"
               :width="450" :height="250" :margin="margin"
               x-axis-label="Year" y-axis-label="VA Budget"
               :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']"
               :annotations="annotations" :y-tick-format="d => `$${d}`">
    </LineChart>
    <LineChart v-else :plot-data="plotData" x-key="date"
               :width="450" :height="250" :margin="margin"
               x-axis-label="Year" y-axis-label="VA Budget"
               :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']"
               :y-tick-format="d => `$${d}`">
    </LineChart>
</template>

<script>
import LCdata from "./Budget3Groups.json"

export default {
    name: "LineChartExample",
    props: ['annotation'],
    data() {
        return {
            plotData: LCdata,
            margin: {top: 20, bottom: 30, left: 50, right: 20},
            annotations: [
                {
                    type: "line", axis: "x", color: "#b3080e", label: "Start Date", labeldy: -5,
                    value: new Date(2019, 6, 0)
                },
                {
                    type: "line", axis: "x", color: "#b3080e", label: "End Date", labeldy: -5,
                    value: new Date(2020, 9, 0)
                },
            ]
        }
    }
}
</script>

<style scoped>

</style>
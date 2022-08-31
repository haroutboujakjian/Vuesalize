<template>
    <LineChart v-if="annotation" :plot-data="plotData" x-key="date"
               :width="450" :height="250" :margin="margin"
               x-axis-label="Year" y-axis-label="Expenses"
               :annotations="annotations" :y-tick-format="d => `$${d}`">
    </LineChart>
    <LineChart v-else-if="linearScale" :plot-data="plotDataLinear" x-key="days"
               :use-time-scale-x-axis="false"
               :x-axis-label-shift="{dy: -5}"
               :width="450" :height="250" :margin="margin"
               x-axis-label="Days Since Start of New Program" y-axis-label="Expenses"
               :show-points="true" :point-radius="3"
               :y-tick-format="d => `$${d}`">
    </LineChart>
    <LineChart v-else :plot-data="plotData" x-key="date"
               :width="450" :height="250" :margin="margin"
               x-axis-label="Year" y-axis-label="Expenses"
               :y-tick-format="d => `$${d}`">
    </LineChart>
</template>

<script>
import LCdata from "./Budget3Groups.json"
import LinearData from "./Budget2GroupsLinear.json"

export default {
    name: "LineChartExample",
    props: ['annotation', 'linearScale'],
    data() {
        return {
            plotData: LCdata,
            plotDataLinear: LinearData,
            margin: {top: 20, bottom: 35, left: 50, right: 20},
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
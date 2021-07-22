<template>
    <GroupedBarChart v-if="horizontal" direction="horizontal"
                     :plot-data="plotdata" x-key="date"
                     :width="450" :height="300" :margin="margin"
                     x-axis-label="VA Budget" y-axis-label="Year"
                     :x-axis-label-shift="{ dx: 0, dy: -2 }" :y-axis-label-shift="{ dx: 0, dy: 5 }"
                     :x-tick-format="d => `$${d}`">
    </GroupedBarChart>
    <GroupedBarChart v-else
                     :plot-data="plotdata" x-key="date"
                     :width="450" :height="300" :margin="margin"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :y-tick-format="d => `$${d}`">
    </GroupedBarChart>
</template>

<script>
import GBCdata from './Budget3Groups.json'

export default {
    name: "GroupedBarChartExample",
    props: ['horizontal'],
    data() {
        return {
            plotdata: GBCdata,
            margin: {top: 20, bottom: 35, left: 55, right: 20}
        }
    }
}
</script>

<style scoped>
</style>
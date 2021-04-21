<template>
    <GroupedBarChart v-if="horizontal" direction="horizontal"
                     :plot-data="plotdata" x-key="date"
                     :width="450" :height="300" :margin="margin"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </GroupedBarChart>
    <GroupedBarChart v-else
                     :plot-data="plotdata" x-key="date"
                     :width="450" :height="300" :margin="margin"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </GroupedBarChart>
</template>

<script>
import GBCdata from "./BarChartData.json"

export default {
    name: "GroupedBarChartExample",
    props: ['horizontal'],
    data() {
        return {
            plotdata: GBCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>

<style scoped>
</style>
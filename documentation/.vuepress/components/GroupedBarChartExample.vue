<template>
    <GroupedBarChart :plotdata="plotdata"
                     :x_key="'date'"
                     :width="450"
                     :height="300"
                     :margin="margin"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </GroupedBarChart>
</template>

<script>
import GroupedBarChart from "./GroupedBarChart";
import GBCdata from "./BarChartData.json"

export default {
    name: "GroupedBarChartExample",
    components: {
        GroupedBarChart
    },
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
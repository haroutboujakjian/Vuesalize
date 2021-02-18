<template>
    <GroupedBarChart :plotdata="plotdata"
                     :x_key="'date'"
                     :width="450"
                     :height="300"
                     :margin="margin"
                     :colors="['#F8CBAD', '#C5E0B4', '#BDD7EE', '#D5B8EA']">
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
<template>
    <GroupedBarChart :plotdata="plotdata"
                     :width="500"
                     :height="300"
                     :colors="['#F8CBAD', '#C5E0B4', '#BDD7EE', '#D5B8EA']">
    </GroupedBarChart>
</template>

<script>
import GroupedBarChart from "./GroupedBarChart";
import GBCdata from "./GroupedBarChartData.json"

export default {
    name: "GroupedBarChartExample",
    components: {
        GroupedBarChart
    },
    data() {
        return {
            plotdata: GBCdata
        }
    }
}
</script>

<style scoped>
</style>
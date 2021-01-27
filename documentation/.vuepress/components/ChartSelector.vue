<template>
    <component :is="chartSelected.type" :plotdata="chartSelected.data"
               :width="600" :height="600"
               :radial-margin="100"
               :colors="['#F8CBAD', '#C5E0B4', '#BDD7EE', '#D5B8EA']">
    </component>
</template>

<script>
import HierarchicalEdgeBundling from "./HierarchicalEdgeBundling";
import HEBdata from './HierarchicalEdgeBundlingData.json'
import GBdata from './GroupedBarChart.json'

export default {
    name: "ChartSelector",
    props: ['chart'],
    components: {
        HierarchicalEdgeBundling,
    },
    data() {
        return {
            HierarchicalEdgeBundlingData: HEBdata,
            GroupedBarChartData: GBdata,
        }
    },
    computed: {
        chartSelected() {
            if (this.chart === 'HierarchicalEdgeBundling') {
                return {
                    type: 'HierarchicalEdgeBundling',
                    data: this.HierarchicalEdgeBundlingData
                }
            } else if (this.chart === 'GroupedBarChart') {
                return {
                    type: 'GroupedBarChart',
                    data: this.GroupedBarChartData
                }
            }
            return 1
        }
    }

}
</script>

<style scoped>

</style>
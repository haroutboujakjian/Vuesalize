<template>
    <div>
        <component :is="chartSelected.type" :plotdata="chartSelected.data"
                   :width="chartSelected.width" :height="chartSelected.height"
                   :radial-margin="140"
                   :colors="['#F8CBAD', '#C5E0B4', '#BDD7EE', '#D5B8EA']">
        </component>
    </div>
</template>

<script>
import HierarchicalEdgeBundling from "./HierarchicalEdgeBundling";
import HEBdata from './HierarchicalEdgeBundlingData.json'
import GBdata from './GroupedBarChartData.json'

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
                    data: this.HierarchicalEdgeBundlingData,
                    width: 600,
                    height: 600
                }
            } else if (this.chart === 'GroupedBarChart') {
                return {
                    type: 'GroupedBarChart',
                    data: this.GroupedBarChartData,
                    width: 550,
                    height: 350,
                }
            }
            return 1
        }
    }

}
</script>

<style scoped>
div {
    display: flex;
    justify-content: center;
}
</style>
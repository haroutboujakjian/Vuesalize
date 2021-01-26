<template>
    <div>
        <component :is="chartSelected.type" :plotdata="chartSelected.data" :width="600" :height="600"></component>
    </div>
</template>

<script>
import HierarchicalEdgeBundling from "./HierarchicalEdgeBundling";
import HEBdata from './HierarchicalEdgeBundlingData.json'

export default {
    name: "ChartSelector",
    props: ['chart'],
    components: {
        HierarchicalEdgeBundling,
    },
    data() {
        return {
            HierarchicalEdgeBundlingData: HEBdata
        }
    },
    computed: {
        chartSelected() {
            if (this.chart === 'HierarchicalEdgeBundling') {
                return {
                    type: 'HierarchicalEdgeBundling',
                    data: this.HierarchicalEdgeBundlingData
                }
            }
            return 1
        }
    }

}
</script>

<style scoped>

</style>
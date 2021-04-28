<template>
    <HierarchicalEdgeBundling :plot-data="plotdata"
                              :width="500" :height="500" :radial-margin="120">
    </HierarchicalEdgeBundling>
</template>

<script>
import HEBdata from "./HierarchicalEdgeBundlingData.json"

export default {
    name: "HierarchicalEdgeBundlingExample",
    data() {
        return {
            plotdata: HEBdata
        }
    }
}
</script>

<style scoped>
</style>
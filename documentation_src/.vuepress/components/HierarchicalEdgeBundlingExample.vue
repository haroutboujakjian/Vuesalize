<template>
    <HierarchicalEdgeBundling :plot-data="plotdata"
                              :width="600" :height="600" :radial-margin="130">
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
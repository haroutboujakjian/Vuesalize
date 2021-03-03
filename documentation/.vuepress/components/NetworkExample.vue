<template>
    <div>
        <Network :width="500" :height="400" :plot-data="plotData"></Network>
    </div>
</template>

<script>
import Network from "./Network";
import NetworkData from "./NetworkData.json"

export default {
    name: "NetworkExample",
    components: {
        Network
    },
    data() {
        return {
            plotData: NetworkData
        }
    },
}
</script>

<style scoped>
div {
    display: flex;
    justify-content: center;
    border: solid 1px black;
}
</style>
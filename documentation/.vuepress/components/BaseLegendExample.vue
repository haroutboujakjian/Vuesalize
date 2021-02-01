<template>
    <BaseLegend :legend-data="legendData"></BaseLegend>
</template>

<script>
import BaseLegend from "./BaseLegend";

export default {
    name: "BaseLegendExample",
    components: {
        BaseLegend
    },
    data() {
        return {
            legendData: {
                "first": "black",
                "second": "blue",
                "third": "red"
            }
        }
    }
}
</script>

<style scoped>

</style>
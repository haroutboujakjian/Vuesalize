<template>
    <div>
        <p>Horiztonal</p>
        <BaseLegend :legend-data="legendData" :alignment="'horizontal'"></BaseLegend>
        <p>Vertical</p>
        <BaseLegend :legend-data="legendData" :alignment="'vertical'"></BaseLegend>
    </div>
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
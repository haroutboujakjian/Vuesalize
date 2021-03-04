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
            legendData: [
                {name: "Veteran's Benefit Administration", color: '#717e9b'},
                {name: "Veteran's Health Administration", color: '#b6b6db'},
                {name: "National Cemetery Administration", color: '#bcd8f1'}
            ]
        }
    }
}
</script>

<style scoped>

</style>
<template>
    <div>
        <p>Horiztonal</p>
        <BaseLegend :legend-data="legendData" :alignment="'horizontal'"></BaseLegend>
        <p>Vertical</p>
        <BaseLegend :legend-data="legendData" :alignment="'vertical'"></BaseLegend>
    </div>
</template>

<script>
export default {
    name: "BaseLegendExample",
    data() {
        return {
            legendData: [
                {name: "Utilities", color: '#717e9b'},
                {name: "Rent", color: '#b6b6db'},
                {name: "Insurance", color: '#bcd8f1'}
            ]
        }
    }
}
</script>

<style scoped>

</style>
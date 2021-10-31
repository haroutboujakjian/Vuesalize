<template>
    <div>
        <p>Horiztonal</p>
        <BaseLegend :legend-data="legendData" :alignment="'horizontal'"></BaseLegend>
        <p>Vertical</p>
        <BaseLegend :legend-data="legendDataToggleEnabled" :alignment="'vertical'"
                    enable-toggle>
        </BaseLegend>
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
            ],
            legendDataToggleEnabled: [
                {name: "Utilities", color: '#717e9b', selected: true},
                {name: "Rent", color: '#b6b6db'},
                {name: "Insurance", color: '#bcd8f1', selected: true}
            ]
        }
    }
}
</script>

<style scoped>

</style>
<template>
    <div>
        <StackedAreaChart v-if="stacked" :plot-data="plotData" :width="500" :height="300" x-key="date"
                          :margin="margin" :stacked="true"
                          :colors="['#ac58e5','#E0488B']">
        </StackedAreaChart>
        <StackedAreaChart v-else :plot-data="plotData" :width="500" :height="300" x-key="date"
                          :margin="margin"
                          :colors="['#ac58e5','#E0488B']">
        </StackedAreaChart>
    </div>
</template>

<script>
import ACdata from './Budget2Groups.json'

export default {
    name: "AreaChartExample",
    props: ['stacked'],
    data() {
        return {
            plotData: ACdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>

<style scoped>

</style>
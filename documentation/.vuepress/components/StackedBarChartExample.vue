<template>
    <StackedBarChart v-if="tooltip" :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" :x_key="'date'"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
        <template v-slot:tooltip="{ bar }">
            <p>Hello from inside the tooltip. Here are values when you hover over this bar</p>
            <p>{{ bar.x_label }}, {{ bar.y_label }}, {{ bar.x_value }}, {{ bar.y_value }}</p>
        </template>
    </StackedBarChart>
    <StackedBarChart v-else :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" :x_key="'date'"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </StackedBarChart>

</template>

<script>
import StackedBarChart from "./StackedBarChart";
import SBCdata from './StackedBarChartData.json'

export default {
    name: "StackedBarChartExample",
    components: {
        StackedBarChart
    },
    props: ['tooltip'],
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    }
}
</script>
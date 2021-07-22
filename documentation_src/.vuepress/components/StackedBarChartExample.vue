<template>
    <StackedBarChart v-if="tooltip" :plot-data="plotData"
                     :margin="margin" x-key="date"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :y-tick-format="d => `$${d}`">
        <template v-slot:tooltip="{ bar }">
            <p>Here are values when you hover over this bar</p>
            <p>{{ bar.x_label }}, {{ bar.y_label }}, {{ bar.x_value }}, {{ bar.y_value }}</p>
        </template>
    </StackedBarChart>
    <StackedBarChart v-else-if="annotation" :width="400" :height="250" :plot-data="plotData"
                     :margin="annoation_margin" x-key="date"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :annotations="annotations"
                     :y-tick-format="d => `$${d}`">
    </StackedBarChart>
    <StackedBarChart v-else-if="horizontal" :plot-data="plotData"
                     :margin="margin" x-key="date" direction="horizontal"
                     x-axis-label="VA Budget" y-axis-label="Year"
                     :x-axis-label-shift="{ dx: 0, dy: -2}" :y-axis-label-shift="{ dx: 0, dy: 5}"
                     :x-tick-format="d => `$${d}`">
    </StackedBarChart>
    <StackedBarChart v-else :plot-data="plotData"
                     :margin="margin" x-key="date"
                     x-axis-label="Year" y-axis-label="VA Budget"
                     :y-tick-format="d => `$${d}`">
    </StackedBarChart>

</template>

<script>
import SBCdata from './Budget3Groups.json'

export default {
    name: "StackedBarChartExample",
    props: ['tooltip', 'annotation', 'horizontal'],
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 35, left: 60, right: 20},
            annoation_margin: {top: 20, bottom: 35, left: 60, right: 70},
            annotations: [
                {
                    type: "line", axis: "y", color: "#ef0202", value: 8000, dash: true,
                    label: 'Max Budget', labeldx: 35, labeldy: -6
                }]
        }
    }
}
</script>
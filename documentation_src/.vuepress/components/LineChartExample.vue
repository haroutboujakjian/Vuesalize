<template>
    <LineChart
        v-if="annotation"
        :plot-data="plotData"
        x-key="date"
        :width="450"
        :height="250"
        :margin="margin"
        x-axis-label="Year"
        y-axis-label="Expenses"
        :annotations="annotations"
        :y-tick-format="(d) => `$${d}`">
    </LineChart>
    <LineChart
        v-else-if="linearScale"
        :plot-data="plotDataLinear"
        x-key="days"
        :use-time-scale-x-axis="false"
        :x-axis-label-shift="{ dy: -5 }"
        :width="450"
        :height="250"
        :margin="margin"
        x-axis-label="Days Since Start of New Program"
        y-axis-label="Expenses"
        :show-points="true"
        :point-radius="3"
        :y-tick-format="(d) => `$${d}`">
    </LineChart>
    <LineChart
        v-else-if="uncertainty"
        :plot-data="UncertaintyData"
        x-key="days"
        :width="450"
        :height="250"
        :margin="margin"
        x-axis-label="Days Since Launch"
        :x-axis-label-shift="{ dy: -6 }"
        y-axis-label="Revenue"
        :use-time-scale-x-axis="false"
        :y-tick-format="(d) => `$${d}`"
        :area-fill-opacity="0.5"
        :stroke-width="2.5">
    </LineChart>
    <LineChart
        v-else
        :plot-data="plotData"
        x-key="date"
        :width="450"
        :height="250"
        :margin="margin"
        x-axis-label="Year"
        y-axis-label="Expenses"
        :y-tick-format="(d) => `$${d}`">
    </LineChart>
</template>

<script>
import LCdata from "./Budget3Groups.json"
import LinearData from "./Budget2GroupsLinear.json"
import UncertaintyData from "./LineChartUncertaintyData.json"

export default {
    name: "LineChartExample",
    props: ["annotation", "linearScale", "uncertainty"],
    data() {
        return {
            plotData: LCdata,
            plotDataLinear: LinearData,
            UncertaintyData,
            margin: { top: 20, bottom: 35, left: 50, right: 20 },
            annotations: [
                {
                    type: "line",
                    axis: "x",
                    color: "#b3080e",
                    label: "Start Date",
                    labeldy: -5,
                    value: new Date(2019, 6, 0),
                },
                {
                    type: "line",
                    axis: "x",
                    color: "#b3080e",
                    label: "End Date",
                    labeldy: -5,
                    value: new Date(2020, 6, 0),
                },
                {
                    type: "circle",
                    center: [new Date(2022, 0, 0), 4900],
                    radius: 17,
                    dash: true,
                    color: "purple",
                    label: "Peak Sales",
                    labeldy: -25,
                },
            ],
        }
    },
}
</script>

<style scoped></style>

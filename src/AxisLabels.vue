<template>
    <g class="axislabels">
        <text
            class="yAxisLabel"
            :x="-chartMargin.top"
            :dx="yAxisLabelShift.dx"
            :y="10"
            :dy="yAxisLabelShift.dy">
            {{ yAxisLabel }}
        </text>
        <text
            class="xAxisLabel"
            :x="width - chartMargin.right"
            :y="height"
            :dx="xAxisLabelShift.dx"
            :dy="xAxisLabelShift.dy">
            {{ xAxisLabel }}
        </text>
    </g>
</template>

<script>
export default {
    name: "AxisLabels",
    props: {
        xAxisLabel: {
            type: String,
        },
        yAxisLabel: {
            type: String,
        },
        yAxisLabelShift: {
            type: Object,
            default: function () {
                return {}
            },
        },
        xAxisLabelShift: {
            type: Object,
            default: function () {
                return {}
            },
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        chartMargin: {
            type: Object,
        },
    },
}
</script>

<style scoped>
.yAxisLabel {
    transform: rotate(-90deg);
    text-anchor: end;
    font-size: 0.8rem;
    fill: currentColor;
}

.xAxisLabel {
    text-anchor: end;
    font-size: 0.8rem;
    fill: currentColor;
}
</style>

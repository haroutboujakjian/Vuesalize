<template>
    <g>
        <text
            class="yAxisLabel"
            :x="-chartMargin.top"
            :dx="yaxis_dx"
            :y="10"
            :dy="yaxis_dy">
            {{ yAxisLabel }}
        </text>
        <text
            class="xAxisLabel"
            :x="width - chartMargin.right"
            :y="height"
            :dx="xaxis_dx"
            :dy="xaxis_dy">
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
    computed: {
        xaxis_dx() {
            return "dx" in this.xAxisLabelShift
                ? this.xAxisLabelShift.dx
                : undefined
        },
        xaxis_dy() {
            return "dy" in this.xAxisLabelShift
                ? this.xAxisLabelShift.dy
                : undefined
        },
        yaxis_dx() {
            return "dx" in this.yAxisLabelShift
                ? this.yAxisLabelShift.dx
                : undefined
        },
        yaxis_dy() {
            return "dy" in this.yAxisLabelShift
                ? this.yAxisLabelShift.dy
                : undefined
        },
    },
}
</script>

<style scoped>
.yAxisLabel {
    transform: rotate(-90deg);
    text-anchor: end;
    font-size: 0.8rem;
    fill: #2c3e50;
}

.xAxisLabel {
    text-anchor: end;
    font-size: 0.8rem;
    fill: #2c3e50;
}
</style>

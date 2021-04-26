<template>
    <g>
        <text class="yAxisLabel" :x="-chartMargin.top" :dx="yaxis_dx"
              :y="10" :dy="yaxis_dy">
            {{ yAxisLabel }}
        </text>
        <text class="xAxisLabel" :x="width - chartMargin.right" :y="height"
              :dx="xaxis_dx" :dy="xaxis_dy">
            {{ xAxisLabel }}
        </text>
    </g>
</template>

<script>
export default {
    name: "AxisLabels",
    props: {
        xAxisLabel: {
            type: String
        },
        yAxisLabel: {
            type: String
        },
        yAxisLabelShift: {
            type: Object
        },
        xAxisLabelShift: {
            type: Object
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        chartMargin: {
            type: Object
        }
    },
    computed: {
        xaxis_dx() {
            return this.xAxisLabelShift?.dx
        },
        xaxis_dy() {
            return this.xAxisLabelShift?.dy
        },
        yaxis_dx() {
            return this.yAxisLabelShift?.dx
        },
        yaxis_dy() {
            return this.yAxisLabelShift?.dy
        }
    }
}
</script>

<style scoped>
.yAxisLabel {
    transform: rotate(-90deg);
    text-anchor: end;
    font-size: 0.80rem;
    fill: #2c3e50;
}

.xAxisLabel {
    text-anchor: end;
    font-size: 0.80rem;
    fill: #2c3e50;
}

</style>
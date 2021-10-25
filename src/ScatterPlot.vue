<template>
    <svg :width="width" :height="height">
        <circle v-for="(point,i) in plotData" :key="i"
                :cx="xScale(point[xKey])" :cy="yScale(point[yKey])" :r="radius">
        </circle>
    </svg>
</template>

<script>
import {scaleLinear} from "d3-scale"
import {min, max} from "d3-array"

export default {
    name: "ScatterPlot",
    props: {
        plotData: Array,
        width: {
            type: Number,
            default: 350,
        },
        height: {
            type: Number,
            default: 250,
        },
        margin: {
            type: Object,
            default: function () {
                return {top: 20, bottom: 20, left: 20, right: 20}
            }
        },
        radius: {
            type: Number,
            default: 5
        },
        xKey: String,
        yKey: String,
        enableTooltip: {
            type: Boolean,
            default: true,
        },
        xAxisLabel: String,
        yAxisLabel: String,
        xAxisLabelShift: Object,
        yAxisLabelShift: Object,
        xTickFormat: {
            type: Function,
            default: null,
        },
        yTickFormat: {
            type: Function,
            default: null,
        }
    },
    data() {
        return {
            showTooltip: false,
            tooltip: {
                x: 0,
                y: 0,
                values: {}
            },
        }
    },
    computed: {
        xValues() {
            const xVals = this.plotData.map(point => point[this.xKey])
            const minVal = min(xVals) < 0 ? min(xVals) : 0
            const maxVal = max(xVals)
            return {min: minVal, max: maxVal}
        },
        yValues() {
            const yVals = this.plotData.map(point => point[this.xKey])
            const minVal = min(yVals) < 0 ? min(yVals) : 0
            const maxVal = max(yVals)
            return {min: minVal, max: maxVal}
        },
        xScale() {
            return scaleLinear()
                .domain([this.xValues.min, this.xValues.max])
                .range([this.margin.left, this.width - this.margin.right])
        },
        yScale() {
            return scaleLinear()
                .domain([this.yValues.min, this.yValues.max])
                .range([this.height - this.margin.bottom, this.margin.top])
        }
    }
}
</script>

<style scoped>

</style>
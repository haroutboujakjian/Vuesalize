<template>
    <svg :width="width" :height="height">
        <circle v-for="(point,i) in points" :key="i"
                :cx="xScale(point[xKey])" :cy="yScale(point[yKey])" :r="point.radius"
                :fill="point.fill" :fill-opacity="fillOpacity"
                :stroke="point.stroke" :stroke-opacity="strokeOpacity"
                @click="$emit('click', point)">
        </circle>
        <g v-xaxis="{ scale: xScale }" :transform="`translate(0, ${height - margin.bottom})`"></g>
        <g v-yaxis="{ scale: yScale }" :transform="`translate(${margin.left}, 0)`"></g>
        <AxisLabels :width="width" :height="height" :chart-margin="margin"
                    :x-axis-label="xAxisLabel" :y-axis-label="yAxisLabel"
                    :x-axis-label-shift="xAxisLabelShift" :y-axis-label-shift="yAxisLabelShift">
        </AxisLabels>
    </svg>
</template>

<script>
import {scaleLinear} from "d3-scale"
import {min, max} from "d3-array"
import {select} from "d3-selection";
import {axisBottom, axisLeft} from "d3-axis";
// eslint-disable-next-line no-unused-vars
import {transition} from "d3-transition"
import AxisLabels from "./AxisLabels";

export default {
    name: "ScatterPlot",
    components: {AxisLabels},
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
        fill: {
            type: String,
            default: 'black'
        },
        fillOpacity: {
            type: Number,
            default: 1,
        },
        stroke: {
            type: String,
            default: 'black'
        },
        strokeOpacity: {
            type: Number,
            default: 1
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
        points() {
            return this.plotData.map(point => ({
                ...point,
                radius: point.radius ? point.radius : this.radius,
                fill: point.fill ? point.fill : this.fill,
                stroke: point.stroke ? point.stroke : this.stroke,
            }))
        },
        xValues() {
            const xVals = this.plotData.map(point => point[this.xKey])
            const minVal = min(xVals) < 0 ? min(xVals) : 0
            const maxVal = max(xVals)
            return {min: minVal, max: maxVal}
        },
        yValues() {
            const yVals = this.plotData.map(point => point[this.yKey])
            const minVal = min(yVals) < 0 ? min(yVals) : 0
            const maxVal = max(yVals)
            return {min: minVal, max: maxVal}
        },
        xScale() {
            return scaleLinear()
                .domain([this.xValues.min, this.xValues.max])
                .range([this.margin.left, this.width - this.margin.right])
                .nice()
        },
        yScale() {
            return scaleLinear()
                .domain([this.yValues.min, this.yValues.max])
                .range([this.height - this.margin.bottom, this.margin.top])
                .nice()
        }
    },
    directives: {
        xaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const xTickFormat = vnode.context._props.xTickFormat

            select(el).transition().duration(500)
                .call(axisBottom(scale).tickPadding(5).ticks(6).tickFormat(xTickFormat))
        },
        yaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const yTickFormat = vnode.context._props.yTickFormat

            select(el).transition().duration(500)
                .call(axisLeft(scale).ticks(5).tickFormat(yTickFormat))
        }
    }
}
</script>

<style scoped>

</style>
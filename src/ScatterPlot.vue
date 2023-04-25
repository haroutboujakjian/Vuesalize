<template>
    <figure>
        <svg :width="width" :height="height" class="scatterplot">
            <ContourPlot
                v-if="summary === 'contour'"
                class="summary"
                :plot-data="plotData"
                :xKey="xKey"
                :yKey="yKey"
                :x-scale="xScale"
                :y-scale="yScale"
                :width="width - margin.left - margin.right"
                :height="height - margin.top - margin.bottom"
                :transform="`translate(${margin.left}, ${margin.top})`"
                :color-scale="summaryOptions?.colorScale"
                :bins="summaryOptions?.bins"
                :bandwidth="summaryOptions?.bandwidth"
                :use-thresholds="summaryOptions?.useThresholds"></ContourPlot>
            <g
                v-xaxis="{
                    scale: xScale,
                    height: height - margin.top - margin.bottom,
                }"
                class="xaxis"
                :transform="`translate(0, ${xAxisTranslation})`"></g>
            <g
                v-yaxis="{
                    scale: yScale,
                    width: width - margin.left - margin.right,
                }"
                class="yaxis"
                :transform="`translate(${yAxisTranslation}, 0)`"></g>
            <transition-group name="list" tag="g" v-if="showPoints">
                <g v-for="(point, i) in points" :key="i">
                    <circle
                        :cx="xScale(point[xKey])"
                        :cy="yScale(point[yKey])"
                        :r="point.radius"
                        :fill="point.fill"
                        :fill-opacity="point.fillOpacity"
                        :stroke="point.stroke"
                        :stroke-opacity="point.strokeOpacity"
                        :stroke-width="point.strokeWidth"
                        @click="$emit('click', point)"
                        @mouseover="populateTooltip($event, point)"
                        @mouseout="showTooltip = false"></circle>
                    <text
                        :x="xScale(point[xKey])"
                        :y="yScale(point[yKey])"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        :font-size="point.labelSize"
                        :fill="point.labelColor"
                        @click="$emit('click', point)"
                        @mouseover="populateTooltip($event, point)"
                        @mouseout="showTooltip = false">
                        {{ point.label }}
                    </text>
                </g>
            </transition-group>

            <AxisLabels
                :width="width"
                :height="height"
                :chart-margin="margin"
                :x-axis-label="xAxisLabel"
                :y-axis-label="yAxisLabel"
                :x-axis-label-shift="xAxisLabelShift"
                :y-axis-label-shift="yAxisLabelShift"></AxisLabels>
            <Annotations
                :annotations="annotations"
                :margin="margin"
                :linear-scale="yScale"
                :bar-scale="xScale"
                :width="width"
                :height="height"
                direction="vertical"></Annotations>
        </svg>
        <div
            v-if="enableTooltip && showTooltip"
            class="tooltipContainer"
            :class="{ activeTooltip: showTooltip }"
            :style="`top: ${tooltip.y + 10}px; left: ${tooltip.x + 10}px`">
            <slot name="tooltip" :point="tooltip">
                <span
                    >{{ xKey }}: {{ tooltip.point[xKey] }}, {{ yKey }}:
                    {{ tooltip.point[yKey] }}</span
                >
            </slot>
        </div>
    </figure>
</template>

<script>
import { scaleLinear } from "d3-scale"
import { min, max } from "d3-array"
import { select } from "d3-selection"
import { axisBottom, axisLeft } from "d3-axis"
import AxisLabels from "./AxisLabels.vue"
import Annotations from "./Annotations.vue"

export default {
    name: "ScatterPlot",
    components: { AxisLabels, Annotations },
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
                return { top: 20, bottom: 20, left: 20, right: 20 }
            },
        },
        radius: {
            type: Number,
            default: 5,
        },
        fill: {
            type: String,
            default: "black",
        },
        fillOpacity: {
            type: Number,
            default: 1,
        },
        stroke: {
            type: String,
            default: "black",
        },
        strokeOpacity: {
            type: Number,
            default: 1,
        },
        strokeWidth: {
            type: Number,
            default: 1,
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
        },
        annotations: {
            type: Array,
            default: function () {
                return []
            },
        },
        xMin: {
            type: Number,
            default: null,
        },
        xMax: {
            type: Number,
            default: null,
        },
        yMin: {
            type: Number,
            default: null,
        },
        yMax: {
            type: Number,
            default: null,
        },
        xTicks: {
            // number sent into d3.ticks function for x-axis
            type: Number,
            default: 5,
        },
        yTicks: {
            // number sent into d3.ticks function for y-axis
            type: Number,
            default: 5,
        },
        xTickValues: {
            // array sent into d3.tickValues function for x-axis
            type: Array,
            default: null,
        },
        yTickValues: {
            // array sent into d3.tickValues function for y-axis
            type: Array,
            default: null,
        },
        xAxisTranslate: {
            // value that translates the x-axis starting from bottom
            type: Number,
            default: 0,
        },
        yAxisTranslate: {
            // value that translates the y-axis starting from left
            type: Number,
            default: 0,
        },
        showPoints: {
            // this option can be useful if only to display summary with scales
            type: Boolean,
            default: true,
        },
        labelSize: {
            type: Number,
            default: 10,
        },
        labelColor: {
            type: String,
            default: "black",
        },
        summary: {
            type: String,
        },
        summaryOptions: {
            type: Object,
        },
    },
    data() {
        return {
            showTooltip: false,
            tooltip: {
                point: {},
                event: {},
            },
        }
    },
    computed: {
        points() {
            return this.plotData.map((point) => ({
                ...point,
                radius: point.radius || this.radius,
                fill: point.fill || this.fill,
                stroke: point.stroke || this.stroke,
                fillOpacity: point.fillOpacity || this.fillOpacity,
                strokeOpacity: point.strokeOpacity || this.strokeOpacity,
                strokeWidth: point.strokeWidth || this.strokeWidth,
                labelColor: point.labelColor || this.labelColor,
                labelSize: point.labelSize || this.labelSize,
            }))
        },
        xValues() {
            // compute min and max values for x scale if xMin/xMax props are not passed in
            const xVals = this.plotData.map((point) => point[this.xKey])
            const minVal = min(xVals) < 0 ? min(xVals) : 0
            const maxVal = max(xVals)
            return {
                min: this.xMin || minVal,
                max: this.xMax || maxVal,
            }
        },
        yValues() {
            // compute min and max values for y scale if yMin/yMax props are not passed in
            const yVals = this.plotData.map((point) => point[this.yKey])
            const minVal = min(yVals) < 0 ? min(yVals) : 0
            const maxVal = max(yVals)
            return {
                min: this.yMin || minVal,
                max: this.yMax || maxVal,
            }
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
        },
        xAxisTranslation() {
            return this.height - this.margin.bottom - this.xAxisTranslate
        },
        yAxisTranslation() {
            return this.margin.left + this.yAxisTranslate
        },
    },
    methods: {
        populateTooltip(e, point) {
            this.showTooltip = true
            this.tooltip.event = e
            this.tooltip.point = point
            this.tooltip.x = this.xScale(point[this.xKey])
            this.tooltip.y = this.yScale(point[this.yKey])
        },
    },
    directives: {
        xaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const height = binding.value.height
            const xTickFormat = vnode.ctx.props.xTickFormat
            const xTicks = vnode.ctx.props.xTicks
            const xTickValues = vnode.ctx.props.xTickValues

            select(el)
                .transition()
                .duration(500)
                .call(
                    axisBottom(scale)
                        .tickSize(-height)
                        .tickSizeOuter(0)
                        .ticks(xTicks)
                        .tickFormat(xTickFormat)
                        .tickValues(xTickValues)
                )
                .selectAll(".tick line")
                .style("stroke-width", "0.3px")
        },
        yaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const width = binding.value.width
            const yTickFormat = vnode.ctx.props.yTickFormat
            const yTicks = vnode.ctx.props.yTicks
            const yTickValues = vnode.ctx.props.yTickValues

            select(el)
                .transition()
                .duration(500)
                .call(
                    axisLeft(scale)
                        .tickSize(-width)
                        .tickSizeOuter(0)
                        .ticks(yTicks)
                        .tickFormat(yTickFormat)
                        .tickValues(yTickValues)
                )
                .selectAll(".tick line")
                .style("stroke-width", "0.3px")
        },
    },
}
</script>

<style scoped>
figure {
    position: relative;
}

circle {
    transition: all 0.5s;
}

.tooltipContainer {
    position: absolute;
    font-size: 0.8rem;
    padding: 10px;
    border: solid 1px black;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    background-color: #ffffff;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
}

.activeTooltip {
    opacity: 0.9;
    transition: opacity 0.3s;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}

.summary {
    position: absolute;
    z-index: 1;
}
</style>

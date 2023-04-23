<template>
    <figure>
        <svg :width="width" :height="height" ref="svgContainer">
            <g
                v-if="stacked"
                @mousemove="populateTooltip($event)"
                @mouseleave="removeTooltip()">
                <path
                    v-for="row in series"
                    :key="row.key"
                    :d="areaCalc(row)"
                    :stroke="color(row.key)"
                    :fill="color(row.key)"
                    :fill-opacity="fillOpacity"
                    :stroke-width="strokeWidth"
                    @click="$emit('click', row.key)"></path>
            </g>
            <g
                v-else
                @mousemove="populateTooltip($event)"
                @mouseleave="removeTooltip()">
                <path
                    v-for="row in series"
                    :key="row.name"
                    :d="areaCalc(row.values)"
                    :stroke="color(row.name)"
                    :stroke-width="strokeWidth"
                    :fill="color(row.name)"
                    :fill-opacity="fillOpacity"></path>
            </g>
            <g
                v-xaxis="{ scale: xScale }"
                class="xaxis"
                :transform="`translate(0, ${height - margin.bottom})`"></g>
            <g
                v-yaxis="{ scale: yScale }"
                class="yaxis"
                :transform="`translate(${margin.left}, 0)`"></g>
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
            v-if="showTooltip"
            class="tooltipContainer"
            :class="{ activeTooltip: showTooltip }"
            :style="{ top: tooltip.y, left: tooltip.x }">
            <slot name="tooltip" :row="tooltip.values">
                <span v-for="(value, key) in tooltip.values" :key="key"
                    >{{ key }}: {{ value }}</span
                >
            </slot>
        </div>
    </figure>
</template>

<script>
import { scaleLinear, scaleOrdinal, scaleTime } from "d3-scale"
import { area, stack } from "d3-shape"
import { bisector, extent, max } from "d3-array"
import { axisBottom, axisLeft } from "d3-axis"
import { select } from "d3-selection"
// eslint-disable-next-line no-unused-vars
import Annotations from "./Annotations.vue"
import AxisLabels from "./AxisLabels.vue"
import colors from "./colors"

export default {
    name: "AreaChart",
    components: { Annotations, AxisLabels },
    props: {
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
        plotData: Array,
        colors: {
            type: Array,
            default: function () {
                return colors
            },
        },
        xKey: String,
        stacked: {
            type: Boolean,
            default: false,
        },
        annotations: Array,
        fillOpacity: {
            type: Number,
            default: 0.65,
        },
        strokeWidth: {
            type: Number,
            default: 2,
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
        xTicks: {
            /*
            number sent into d3.ticks function for x-axis
             */
            type: Number,
            default: 5,
        },
        yTicks: {
            /*
            number sent into d3.ticks function for y-axis
            */
            type: Number,
            default: 5,
        },
    },
    data() {
        return {
            showTooltip: false,
            tooltip: {
                x: 0,
                y: 0,
                values: {},
            },
        }
    },
    computed: {
        yValueKeys() {
            return Object.keys(this.plotData[0]).filter(
                (item) => item !== this.xKey
            )
        },
        xValues() {
            return this.plotData.map((item) => item[this.xKey])
        },
        series() {
            const dataUnstacked = this.yValueKeys.map((key) => ({
                name: key,
                values: this.plotData.map((year) => year[key]),
            }))

            const dataStacked = stack().keys(this.yValueKeys)(this.plotData)

            return this.stacked ? dataStacked : dataUnstacked
        },
        xScale() {
            return scaleTime()
                .domain(extent(this.plotData, (d) => new Date(d[this.xKey])))
                .range([this.margin.left, this.width - this.margin.right])
        },
        yScale() {
            let maxVal
            if (this.stacked) {
                maxVal = max(this.series, (d) => max(d, (d) => d[1]))
            } else {
                maxVal = max(this.series.flatMap((row) => row.values))
            }
            return scaleLinear()
                .domain([0, maxVal])
                .range([this.height - this.margin.bottom, this.margin.top])
                .nice()
        },
        areaCalc() {
            const areaStacked = area()
                .x((d) => this.xScale(new Date(d.data[this.xKey])))
                .y0((d) => this.yScale(d[0]))
                .y1((d) => this.yScale(d[1]))

            const areaUnstacked = area()
                .x((d, i) => this.xScale(new Date(this.xValues[i])))
                .y0(() => this.yScale(0))
                .y1((d) => this.yScale(d))

            return this.stacked ? areaStacked : areaUnstacked
        },
        color() {
            return scaleOrdinal().domain(this.yValueKeys).range(this.colors)
        },
        xBisector() {
            return bisector((d) => new Date(d[this.xKey])).left
        },
    },
    methods: {
        populateTooltip(evt) {
            this.tooltip.x = `${evt.pageX + 5}px`
            this.tooltip.y = `${evt.pageY + 5}px`

            let container_start =
                this.$refs.svgContainer.getBoundingClientRect().left

            let date = this.xScale.invert(evt.x - container_start)
            let index = this.xBisector(this.plotData, date, 1)
            this.tooltip.values = this.plotData[index]

            this.showTooltip = true
        },
        removeTooltip() {
            this.showTooltip = false
        },
    },
    directives: {
        xaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const xTickFormat = vnode.ctx.props.xTickFormat
            const xTicks = vnode.ctx.props.xTicks

            select(el)
                .transition()
                .duration(500)
                .call(axisBottom(scale).ticks(xTicks).tickFormat(xTickFormat))
        },
        yaxis(el, binding, vnode) {
            let scale = binding.value.scale
            const yTickFormat = vnode.ctx.props.yTickFormat
            const yTicks = vnode.ctx.props.yTicks

            select(el)
                .transition()
                .duration(500)
                .call(axisLeft(scale).ticks(yTicks).tickFormat(yTickFormat))
        },
    },
}
</script>

<style scoped>
path {
    cursor: pointer;
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

.tooltipContainer span {
    display: block;
}
</style>

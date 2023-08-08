<template>
    <figure>
        <svg
            :width="width"
            :height="height"
            ref="svgContainer"
            @mousemove="populateTooltip($event)"
            @mouseleave="removeTooltip()">
            <g v-if="boundsIncluded" class="areas">
                <path
                    v-for="area in areas"
                    :key="area.name"
                    :d="area.path"
                    :fill="color(area.key)"
                    :fill-opacity="areaFillOpacity" />
            </g>

            <g v-if="showPoints" class="points">
                <g v-for="line in y_values" :key="line.name" :class="line.name">
                    <circle
                        v-for="(values, i) in line.values"
                        :key="i"
                        :cx="xScale(new Date(x_values[i]))"
                        :cy="yScale(values)"
                        :r="pointRadius"
                        :fill="color(line.name)"></circle>
                </g>
            </g>

            <g class="lines">
                <path
                    v-for="line in lines"
                    :key="line.key"
                    :d="line.path"
                    fill="transparent"
                    :stroke="color(line.key)"
                    :stroke-width="strokeWidth"></path>
            </g>

            <g
                v-xaxis="{
                    scale: xScale,
                    height: height - margin.bottom - margin.top,
                }"
                class="xaxis"
                :transform="`translate(0 ${height - margin.bottom})`"></g>
            <g
                v-yaxis="{
                    scale: yScale,
                    width: width - margin.left - margin.right,
                }"
                class="yaxis"
                :transform="`translate(${margin.left} 0)`"></g>

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
            :style="{ top: tooltip.y, left: tooltip.x }">
            <slot name="tooltip" :lines="tooltip.values">
                <span
                    v-for="(value, key) in tooltip.values"
                    :key="key"
                    class="tooltipRow">
                    <span
                        v-if="key !== xKey"
                        class="dot"
                        :style="`color: ${color(key)}`"
                        >&#x2022;</span
                    >
                    {{ key }}: {{ value }}
                </span>
            </slot>
        </div>
    </figure>
</template>

<script>
import { scaleLinear, scaleOrdinal, scaleTime } from "d3-scale"
import { line, area } from "d3-shape"
import { bisector, extent, max } from "d3-array"
import { axisBottom, axisLeft } from "d3-axis"
import { select } from "d3-selection"
import Annotations from "./Annotations.vue"
import AxisLabels from "./AxisLabels.vue"
import colors from "./colors"

export default {
    name: "LineChart",
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
        colors: {
            type: Array,
            default: function () {
                return colors
            },
        },
        xKey: String,
        enableTooltip: {
            type: Boolean,
            default: true,
        },
        strokeWidth: {
            type: Number,
            default: 1.5,
        },
        annotations: {
            type: Array,
            default: function () {
                return []
            },
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
        useTimeScaleXAxis: {
            type: Boolean,
            default: true,
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
            /**
             * number sent into d3.ticks function for x-axis
             */
            type: Number,
            default: 5,
        },
        yTicks: {
            /**
             * number sent into d3.ticks function for y-axis
             */
            type: Number,
            default: 5,
        },
        showPoints: {
            /**
             * show each of the points that construct the line chart
             */
            type: Boolean,
            default: false,
        },
        pointRadius: {
            /**
             * if showPoints is set to true, use this for radius of points on line
             */
            type: Number,
            default: 4,
        },
        areaFillOpacity: {
            type: Number,
            default: 0.6,
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
            return Object.keys(this.plotData[0])
                .filter((item) => item !== this.xKey)
                .sort()
        },
        x_values() {
            return this.plotData.map((item) => item[this.xKey])
        },
        y_values() {
            return this.yValueKeys.map((key) => ({
                name: key,
                values: this.plotData.map((year) => year[key]),
            }))
        },
        boundsIncluded() {
            /**
             * if the first value is an object then it is assumed the upper and lower bounds are passed in for areas
             * if the first value is an integer, then only lines are plotted
             */
            return typeof this.y_values[0]?.values[0] == "object"
        },
        xScale() {
            let scale
            if (this.useTimeScaleXAxis) {
                scale = scaleTime().domain(
                    extent(this.plotData, (d) => new Date(d[this.xKey]))
                )
            } else {
                scale = scaleLinear().domain(
                    extent(this.plotData, (d) => d[this.xKey])
                )
            }

            return scale
                .range([this.margin.left, this.width - this.margin.right])
                .nice()
        },
        yScale() {
            // set y scale min and max values based on props if they exist, else default to 0 and max of values
            const yMin = this.yMin ? this.yMin : 0
            const yMax = this.calculateMax()

            return scaleLinear()
                .domain([yMin, yMax])
                .range([this.height - this.margin.bottom, this.margin.top])
                .nice()
        },
        color() {
            return scaleOrdinal().domain(this.yValueKeys).range(this.colors)
        },
        lineGenerator() {
            return line()
                .x((d, i) => this.xScale(new Date(this.x_values[i])))
                .y((d) => this.yScale(d))
        },
        xBisector() {
            return bisector((d) => new Date(d[this.xKey])).left
        },
        lines() {
            if (this.boundsIncluded) {
                return this.y_values.map((item) => {
                    const values = item.values.map((d) => d.value)
                    return {
                        key: item.name,
                        path: this.lineGenerator(values),
                    }
                })
            } else {
                return this.y_values.map((item) => ({
                    key: item.name,
                    path: this.lineGenerator(item.values),
                }))
            }
        },
        areaGenerator() {
            return area()
                .x((d, i) => this.xScale(new Date(this.x_values[i])))
                .y0((d) => this.yScale(d.lower))
                .y1((d) => this.yScale(d.upper))
        },
        areas() {
            if (this.boundsIncluded) {
                return this.y_values.map((item) => {
                    const values = item.values
                    console.log(values)
                    return {
                        key: item.name,
                        path: this.areaGenerator(values),
                    }
                })
            }
            return []
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
        calculateMax() {
            if (this.yMax) return this.yMax

            if (this.boundsIncluded) {
                const all_values = this.y_values
                    .flatMap((d) => d.values)
                    .flatMap((d) => Object.values(d))
                return max(all_values)
            } else {
                return max(this.y_values, (d) => max(d.values))
            }
        },
    },
    directives: {
        xaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const height = binding.value.height
            const xTickFormat = vnode.ctx.props.xTickFormat
            const xTicks = vnode.ctx.props.xTicks

            select(el)
                .transition()
                .duration(500)
                .call(
                    axisBottom(scale)
                        .tickSize(-height)
                        .tickSizeOuter(0)
                        .tickPadding(5)
                        .ticks(xTicks)
                        .tickFormat(xTickFormat)
                )
                .selectAll(".tick line")
                .style("stroke-width", "0.3px")
        },
        yaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const width = binding.value.width
            const yTickFormat = vnode.ctx.props.yTickFormat
            const yTicks = vnode.ctx.props.yTicks

            select(el)
                .transition()
                .duration(500)
                .call(
                    axisLeft(scale)
                        .tickSize(-width)
                        .tickSizeOuter(0)
                        .ticks(yTicks)
                        .tickFormat(yTickFormat)
                )
                .selectAll(".tick line")
                .style("stroke-width", "0.3px")
        },
    },
}
</script>

<style scoped>
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

.tooltipRow {
    display: flex;
    align-items: center;
}

.tooltipRow .dot {
    font-size: 1.15rem;
}
</style>

<template>
    <figure>
        <svg :width="width" :height="height" ref="svgContainer">
            <g v-if="stacked" @mousemove="populateTooltip($event)" @mouseleave="removeTooltip()">
                <path v-for="row in series" :key="row.key"
                      :d="areaCalc(row)" :stroke="color(row.key)"
                      :fill="color(row.key)" :fill-opacity="fillOpacity" :stroke-width="strokeWidth"
                      @click="$emit('click',row.key)">
                </path>
            </g>
            <g v-else @mousemove="populateTooltip($event)" @mouseleave="removeTooltip()">
                <path v-for="row in series" :key="row.name"
                      :d="areaCalc(row.values)" :stroke="color(row.name)" :stroke-width="strokeWidth"
                      :fill="color(row.name)" :fill-opacity="fillOpacity">
                </path>
            </g>
            <line v-for="(line, i) in annotation_lines" :key="`l${i}}`"
                  :x1="line.x1" :x2="line.x2" :y1="line.y1" :y2="line.y2"
                  class="annotation" :stroke="line.color" stroke-dasharray="5 5">
            </line>
            <g v-xaxis="{scale: xScale}" :transform="`translate(0, ${height - margin.bottom})`"></g>
            <g v-yaxis="{scale: yScale}" :transform="`translate(${margin.left}, 0)`"></g>
            <AxisLabels :width="width" :height="height" :chart-margin="margin"
                        :x-axis-label="xAxisLabel" :y-axis-label="yAxisLabel"
                        :x-axis-label-shift="xAxisLabelShift" :y-axis-label-shift="yAxisLabelShift">
            </AxisLabels>
        </svg>
        <div v-if="showTooltip" class="tooltipContainer"
             :class="{activeTooltip: showTooltip}"
             :style="{top: tooltip.y, left: tooltip.x}">
            <slot name="tooltip" :row="tooltip.values">
                <p v-for="(value, key) in tooltip.values" :key="key">{{ key }}: {{ value }}</p>
            </slot>
        </div>
    </figure>

</template>

<script>
import {scaleLinear, scaleOrdinal, scaleTime} from 'd3-scale';
import {area, stack} from 'd3-shape';
import {bisector, extent, max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {select} from 'd3-selection';
// eslint-disable-next-line no-unused-vars
import AxisLabels from "./AxisLabels";

export default {
    name: "AreaChart",
    components: {AxisLabels},
    props: {
        width: Number,
        height: Number,
        margin: {
            type: Object,
            default: function () {
                return {top: 20, bottom: 20, left: 20, right: 20}
            }
        },
        plotData: Array,
        colors: Array,
        xKey: String,
        stacked: {
            type: Boolean,
            default: false,
        },
        annotations: Array,
        fillOpacity: {
            type: Number,
            default: 0.65
        },
        strokeWidth: {
            type: Number,
            default: 2
        },
        xAxisLabel: String,
        yAxisLabel: String,
        xAxisLabelShift: Object,
        yAxisLabelShift: Object,
    },
    data() {
        return {
            showTooltip: false,
            tooltip: {
                x: 0,
                y: 0,
                values: {}
            }
        }
    },
    computed: {
        yValueKeys() {
            return Object.keys(this.plotData[0]).filter(item => item !== this.xKey)
        },
        xValues() {
            return this.plotData.map(item => item[this.xKey])
        },
        series() {
            const dataUnstacked = this.yValueKeys.map(key => ({
                name: key,
                values: this.plotData.map(year => year[key])
            }))

            const dataStacked = stack().keys(this.yValueKeys)(this.plotData)

            return this.stacked ? dataStacked : dataUnstacked
        },
        xScale() {
            return scaleTime()
                .domain(extent(this.plotData, d => new Date(d[this.xKey])))
                .range([this.margin.left, this.width - this.margin.right])
        },
        yScale() {
            let maxVal
            if (this.stacked) {
                maxVal = max(this.series, d => max(d, d => d[1]))
            } else {
                maxVal = max(this.series.flatMap(row => row.values))
            }
            return scaleLinear()
                .domain([0, maxVal])
                .range([this.height - this.margin.bottom, this.margin.top])
                .nice()
        },
        areaCalc() {
            const areaStacked = area()
                .x(d => this.xScale(new Date(d.data[this.xKey])))
                .y0(d => this.yScale(d[0]))
                .y1(d => this.yScale(d[1]))

            const areaUnstacked = area()
                .x((d, i) => this.xScale(new Date(this.xValues[i])))
                .y0(() => this.yScale(0))
                .y1(d => this.yScale(d))

            return this.stacked ? areaStacked : areaUnstacked

        },
        color() {
            return scaleOrdinal().domain(this.yValueKeys).range(this.colors)
        },
        xBisector() {
            return bisector(d => new Date(d[this.xKey])).left
        },
        annotation_lines() {
            if (this.annotations === undefined) {
                return []
            }
            return this.annotations.filter(annotation => annotation.type === 'line').map(item => ({
                x1: item.axis === 'y' ? this.margin.left : this.xScale(item.value),
                x2: item.axis === 'y' ? this.width - this.margin.right : this.xScale(item.value),
                y1: item.axis === 'y' ? this.yScale(item.value) : this.margin.top,
                y2: item.axis === 'y' ? this.yScale(item.value) : this.height - this.margin.bottom,
                color: item.color
            }))
        }
    },
    methods: {
        populateTooltip(evt) {
            this.tooltip.x = `${evt.x + 5}px`
            this.tooltip.y = `${evt.y + 5}px`

            let container_start = this.$refs.svgContainer.getBoundingClientRect().left

            let date = this.xScale.invert(evt.x - container_start)
            let index = this.xBisector(this.plotData, date, 1)
            this.tooltip.values = this.plotData[index]

            this.showTooltip = true
        },
        removeTooltip() {
            this.showTooltip = false
        }
    },
    directives: {
        xaxis(el, binding) {
            let scale = binding.value.scale
            select(el).transition().duration(500).call(axisBottom(scale).ticks(6))
        },
        yaxis(el, binding) {
            let scale = binding.value.scale
            select(el).transition().duration(500).call(axisLeft(scale).ticks(5))
        }
    }
}
</script>

<style scoped>
path {
    cursor: pointer;
}

.annotation {
    stroke-width: 1;
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

</style>
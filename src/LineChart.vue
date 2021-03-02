<template>
    <figure>
        <svg :width="width" :height="height" ref="svgContainer">
            <g @mousemove="populateTooltip($event)" @mouseleave="removeTooltip()">
                <path v-for="line in y_values" :key="line.name"
                      :d="lineCalc(line.values)" :stroke="color(line.name)">
                    <title>{{ line.name }}</title>
                </path>
            </g>
            <g v-xaxis="{ scale: xScale, height: height - margin.bottom - margin.top}"
               :transform="`translate(0 ${height - margin.bottom})`">
            </g>
            <g v-yaxis="{ scale: yScale, width: width - margin.left - margin.right}"
               :transform="`translate(${margin.left} 0)`">
            </g>
        </svg>

        <div v-if="enable_tooltip && showTooltip" class="tooltipContainer"
             :class="{ activeTooltip: showTooltip}"
             :style="{top: tooltip.y, left: tooltip.x}">
            <slot name="tooltip" :lines="tooltip.values">
                <p v-for="(value, key) in tooltip.values" :key="key">{{ key }}: {{ value }}</p>
            </slot>
        </div>
    </figure>

</template>

<script>
import {scaleTime, scaleLinear, scaleOrdinal} from 'd3-scale';
import {line} from 'd3-shape';
import {extent, max, bisector} from 'd3-array';
import {axisLeft, axisBottom} from 'd3-axis';
import {select} from 'd3-selection';
// eslint-disable-next-line no-unused-vars
import {transition} from 'd3-transition';

export default {
    name: "LineChart",
    props: {
        plotData: Array,
        width: Number,
        height: Number,
        margin: {
            type: Object,
            default: function () {
                return {top: 20, bottom: 20, left: 20, right: 20}
            }
        },
        colors: Array,
        x_key: String,
        enable_tooltip: {
            type: Boolean,
            default: true,
        }
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
        object_keys() {
            return Object.keys(this.plotData[0]).filter(item => item !== this.x_key).sort()
        },
        x_values() {
            return this.plotData.map(item => item[this.x_key])
        },
        y_values() {
            return Object.keys(this.plotData[0])
                .filter(key => key !== this.x_key)
                .sort()
                .map(key => ({name: key, values: this.plotData.map(year => year[key])}))
        },
        max_y_value() {
            return max(this.y_values, d => max(d.values))
        },
        xScale() {
            return scaleTime()
                .domain(extent(this.plotData, d => new Date(d[this.x_key])))
                .range([this.margin.left, this.width - this.margin.right])
                .nice()
        },
        yScale() {
            return scaleLinear()
                .domain([0, this.max_y_value])
                .range([this.height - this.margin.bottom, this.margin.top])
                .nice()
        },
        color() {
            return scaleOrdinal().domain(this.object_keys).range(this.colors)
        },
        lineCalc() {
            return line()
                .x((d, i) => this.xScale(new Date(this.x_values[i])))
                .y(d => this.yScale(d))
        },
        xBisector() {
            return bisector(d => new Date(d[this.x_key])).left
        }
    },
    methods: {
        populateTooltip(evt) {
            this.tooltip.x = `${evt.pageX + 5}px`
            this.tooltip.y = `${evt.pageY + 5}px`

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
            const scale = binding.value.scale
            const height = binding.value.height
            select(el).transition().duration(500)
                .call(axisBottom(scale).tickSize(-height).tickSizeOuter(0).ticks(6))
                .selectAll(".tick line").style("stroke-width", "0.3px")
        },
        yaxis(el, binding) {
            const scale = binding.value.scale
            const width = binding.value.width
            select(el).transition().duration(500)
                .call(axisLeft(scale).tickSize(-width).tickSizeOuter(0).ticks(5))
                .selectAll(".tick line").style("stroke-width", "0.3px")
        }
    }
}
</script>

<style scoped>
path {
    stroke-width: 1.5;
    fill: transparent;
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
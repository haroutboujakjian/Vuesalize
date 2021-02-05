<template>
    <svg :width="width" :height="height">
        <transition-group tag="g" v-for="row in series" :key="row.key" :fill="color(row.key)">
            <rect class="animate" v-for="(bar, i) in row" :key="i"
                  :x="xScale(bar.data[x_key])" :y="yScale(bar[1])"
                  :width="xScale.bandwidth()" :height="yScale(bar[0])-yScale(bar[1])">
            </rect>
            <title :key="row.key">{{ row.key }}</title>
        </transition-group>
        <g v-xaxis="{scale: xScale}" :transform="`translate(0, ${height - margin.bottom})`"></g>
        <g v-yaxis="{scale: yScale}" :transform="`translate(${margin.left}, 0)`"></g>
    </svg>
</template>

<script>
import {stack} from 'd3-shape';
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import {axisBottom, axisLeft} from 'd3-axis';

export default {
    name: "StackedBarChart",
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
        x_key: String,
    },
    computed: {
        object_keys() {
            return Object.keys(this.plotData[0]).filter(item => item !== this.x_key)
        },
        series() {
            return stack()
                .keys(this.object_keys)(this.plotData)
                .map(e => (e.forEach(v => v.key = e.key), e))
        },
        xScale() {
            return scaleBand()
                .domain(this.plotData.map(d => d[this.x_key]))
                .range([this.margin.left, this.width - this.margin.right])
                .padding(0.1)
        },
        yScale() {
            return scaleLinear()
                .domain([0, max(this.series, d => max(d, d => d[1]))])
                .range([this.height - this.margin.bottom, this.margin.top])
        },
        color() {
            return scaleOrdinal()
                .domain(this.series.map(d => d.key))
                .range(this.colors)
        }
    },
    directives: {
        xaxis(el, binding) {
            let scale = binding.value.scale
            select(el).call(axisBottom(scale).ticks())
        },
        yaxis(el, binding) {
            let scale = binding.value.scale
            select(el).call(axisLeft(scale).ticks())
        }
    }
}
</script>

<style scoped>
.animate {
    transition: all 0.5s;
}
</style>
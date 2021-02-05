<template>
    <div ref="donutChartContainer">
        <svg :width="size" :height="size" v-if="chartData.length">
            <transition-group tag="g">
                <path class="animate" v-for="slice in slices"
                    :key="slice.index"
                    :d="arc(slice)"
                    :fill="colorScale(slice.data.name)"
                    :transform="'translate('+size/2+','+size/2+')'"></path>
            </transition-group>
            <transition-group tag="g" font-family="sans-serif" font-size="12" text-anchor="middle">
                <text class="animate" v-for="slice in slices"
                      :key="slice.index"
                      :transform="textTransform(slice)"
                      >
                    <tspan y="-0.4em" font-weight="bold">{{slice.data.name}}</tspan>
                    <tspan x="0" y="0.7em" fill-opacity="0.7">{{slice.data[valueKey]}}</tspan>
                </text>
            </transition-group>
            <g v-if="chartTitle" font-family="sans-serif" font-size="16" text-anchor="middle" :transform="textTransform()">
                <foreignObject :width="titleWidth" height="20" :x="-titleWidth/2" y="-16">
                    <div class="donut-title" xmlns="http://www.w3.org/1999/xhtml" :title="chartTitle">{{ chartTitle }}</div>
                </foreignObject>
            </g>
        </svg>
    </div>
</template>

<script>
import * as colorbrewer from "colorbrewer";
import {pie, arc} from "d3-shape";
import {scaleOrdinal} from "d3-scale";

export default {
    name: "DonutChart",
    props: {
        "chartData": {type: Array, require: true},
        "colors": {type: Array, default: () => colorbrewer.Paired[12]},
        "valueKey": {type: String, default: "value"},
        "chartTitle": {type: String},
        "size": {type: Number, default: 400}
    },
    computed: {
        slices() {
            return pie()
                .padAngle(0.005)
                .sort(null)
                .value(d => d[this.valueKey])(this.chartData)
                .filter(d => d.data[this.valueKey]);
        },
        colorScale() {
            return scaleOrdinal()
                .domain(this.chartData.map(d => d.name))
                .range(this.colors)
                .unknown("#ccc");
        },
        arc() {
            const radius = (this.size - 10) / 2;
            return arc().innerRadius(radius * 0.67).outerRadius(radius - 1);
        },
        titleWidth() {
            return this.arc.innerRadius()(this.slices[0]) * 2 - 5;
        }
    },
    methods: {
        textTransform(d) {
            let transform = d ? this.arc.centroid(d) : [0, 0];
            transform[0] += this.size/2;
            transform[1] += this.size/2;
            return `translate(${transform})`;
        }
    }
}
</script>

<style scoped>

.donut-title {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
}

.animate {
    transition: all 0.5s;
}
</style>

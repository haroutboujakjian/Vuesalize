<template>
    <div style="width: 100%;" ref="barChartContainer">
        <div v-if="chartData.org1.length && Object.keys(chartData.org1[0]).length > 2" style="text-align: left; padding: 8px 0 0 8px; margin-bottom: -8px;">
            <span v-for="entry in chartSeries.org1" :key="entry.key" style="margin-right: 5px; font-size: 12px">
                <svg width="16" height="12">
                    <rect width="12" height="12" :fill="colorScale(entry.key)"></rect>
                </svg>
                {{ legendMap && legendMap[entry.key] ? legendMap[entry.key] : entry.key }}
            </span>
        </div>

        <svg :width="width.org1" :height="height" v-if="chartData.org1.length">
            <g v-for="(type, index) in chartSeries.org1" :key="type.label" :fill="barChartColorScale[index]">
                <rect v-for="entry in type" :key="entry.data.name"
                      :x="xScale.org1(entry[0])"
                      :y="yScale(entry.data.name)"
                      :width="xScale.org1(entry[1]) - xScale.org1(entry[0])"
                      :height="yScale.bandwidth()">
                    <title>{{entry[1] - entry[0]}}</title>
                </rect>
            </g>
            <g v-xaxis="xScale.org1" class="axis" :transform="xAxisTranslate"></g>
            <g v-yaxis="yScale" class="axis" :transform="yAxisTranslate.org1"></g>
        </svg>

        <svg :width="width.org2" :height="height" v-if="isComparison">
            <g v-for="(type, index) in chartSeries.org2" :key="type.label" :fill="barChartColorScale[index]">
                <rect v-for="entry in type" :key="entry.data.name"
                      :x="xScale.org2(entry[0])"
                      :y="yScale(entry.data.name)"
                      :width="xScale.org2(entry[1]) - xScale.org2(entry[0])"
                      :height="yScale.bandwidth()">
                    <title>{{entry[1] - entry[0]}}</title>
                </rect>
            </g>
            <g v-xaxis="xScale.org2" class="axis" :transform="xAxisTranslate"></g>
            <g v-yaxis="yScale" class="axis" :transform="yAxisTranslate.org2"></g>
        </svg>
    </div>
</template>

<script>
import {select} from "d3-selection";
import {axisLeft, axisTop} from "d3-axis";
import {stack} from "d3-shape";
import {scaleBand, scaleLinear, scaleOrdinal} from "d3-scale";
import {max} from "d3-array";
import {schemeTableau10} from "d3-scale-chromatic";

export default {
    name: "BarChart",
    props: ["chartData", "legendMap", "colors"],
    data() {
        return {
            width: {org1: 500, org2: 0},
            barChartColorScale: this.colors ? this.colors : schemeTableau10
        }
    },
    directives: {
        xaxis(el, binding) {
            const scale = binding.value;
            select(el).call(axisTop(scale).ticks(6))
        },
        yaxis(el, binding) {
            const scale = binding.value;
            select(el).call(axisLeft(scale).tickSizeOuter(0));
        }
    },
    computed: {
        isComparison() {
            return this.chartData.org2 && this.chartData.org2.length;
        },
        chartSeries() {
            return {
                org1: stack()
                    .keys(Object.keys(this.chartData.org1[0]).filter(d => d !== "name"))(this.chartData.org1)
                    .map(d => (d.forEach(v => v.key = d.key), d)),
                org2: this.chartData.org2 ? stack()
                    .keys(Object.keys(this.chartData.org2[0]).filter(d => d !== "name"))(this.chartData.org2)
                    .map(d => (d.forEach(v => v.key = d.key), d)) : null
            };
        },
        colorScale() {
            return scaleOrdinal()
                .domain(this.chartSeries.org1.map(d => d.key))
                .range(this.barChartColorScale)
                .unknown("#ccc");
        },
        xScale() {
            return {
                org1: scaleLinear()
                    .domain([0, max(this.chartSeries.org1.concat(this.chartSeries.org2 ? this.chartSeries.org2 : []), d => max(d, d => d[1]))])
                    .range([this.margin.org1.left, this.width.org1 - this.margin.org1.right]),
                org2: scaleLinear()
                    .domain([0, max(this.chartSeries.org1.concat(this.chartSeries.org2 ? this.chartSeries.org2 : []), d => max(d, d => d[1]))])
                    .range([this.margin.org2.left, this.width.org2 - this.margin.org2.right])
            };
        },
        yScale() {
            return scaleBand()
                .domain(this.chartData.org1.map(d => d.name))
                .range([this.margin.org1.top, this.height - this.margin.org1.bottom])
                .padding(0.08);
        },
        height() {
            return Math.max(200, this.chartData.org1.length * 20 + 50);
        },
        maxTextWidth() {
            return max(this.chartData.org1, d => this.getTextWidth(d.name)) + 15
        },
        margin() {
            return {
                org1: {
                    top: 30,
                    right: 10,
                    bottom: 0,
                    left: this.maxTextWidth
                },
                org2: {
                    top: 30,
                    right: 10,
                    bottom: 0,
                    left: 5
                }
            };
        },
        xAxisTranslate() {
            return `translate(0, ${this.margin.org1.top})`
        },
        yAxisTranslate() {
            return {
                org1: `translate(${this.margin.org1.left},0)`,
                org2: `translate(${this.margin.org2.left},0)`
            }
        }
    },
    mounted() {
        window.addEventListener('resize', this.resize);
        this.resize();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize)
    },
    methods: {
        getTextWidth(text) {
            return Math.min(200, select("#text-check").text(text).node().getComputedTextLength());
        },
        resize() {
            this.width = {
                org1: this.maxTextWidth + (this.$refs.barChartContainer.getBoundingClientRect().width - this.maxTextWidth)/(this.isComparison ? 2 : 1) - 10,
                org2: (this.$refs.barChartContainer.getBoundingClientRect().width - this.maxTextWidth)/(this.isComparison ? 2 : 1) - 10
            };
        }
    },
    watch: {
        isComparison: {
            handler() {
                this.resize();
            }
        }
    }
}
</script>

<style scoped>

</style>
<template>
    <div ref="donutChartContainer" style="width: 100%; height: calc(100% - 46px)">
        <svg width="100%" :height="height" v-if="chartData.slices.length">
            <path v-for="slice in slices"
                  :key="slice.index"
                  :d="arc(slice)"
                  :fill="colorScale(slice.data.name)" :transform="'translate('+width/2+','+height/2+')'">
            </path>
            <g font-family="sans-serif" font-size="12" text-anchor="middle">
                <text v-for="slice in slices"
                      :key="slice.index"
                      :transform="textTransform(slice)"
                      >
                    <tspan y="-0.4em" font-weight="bold">{{slice.data.name}}</tspan>
                    <tspan x="0" y="0.7em" fill-opacity="0.7">{{slice.data.Total}}</tspan>
                </text>
            </g>
            <g v-if="showTitle" font-family="sans-serif" font-size="16" text-anchor="middle" :transform="textTransform()">
                <foreignObject :width="titleWidth" height="20" :x="-titleWidth/2" y="-16">
                    <p class="donut-title" xmlns="http://www.w3.org/1999/xhtml" :title="chartData.title">{{ chartData.title }}</p>
                </foreignObject>
            </g>
        </svg>
    </div>
</template>

<script>
import {schemeTableau10} from "d3-scale-chromatic";
import {pie, arc} from "d3-shape";
import {scaleOrdinal} from "d3-scale";

export default {
    name: "DonutChart",
    props: ["chartData", "colors"],
    data() {
        return  {
            width: 500,
            height: 500,
            donutChartColorScale: this.colors ? this.colors : schemeTableau10
        }
    },
    computed: {
        slices() {
            return pie()
                .padAngle(0.005)
                .sort(null)
                .value(d => d.Total)(this.chartData.slices)
                .filter(d => d.data.Total);
        },
        colorScale() {
            return scaleOrdinal()
                .domain(this.chartData.slices.map(d => d.name))
                .range(this.donutChartColorScale)
                .unknown("#ccc");
        },
        arc() {
            const radius = (Math.min(this.width, this.height) - 10) / 2;
            return arc().innerRadius(radius * 0.67).outerRadius(radius - 1);
        },
        titleWidth() {
            return this.arc.innerRadius()(this.slices[0]) * 2 - 5;
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
        textTransform(d) {
            let transform = d ? this.arc.centroid(d) : [0, 0];
            transform[0] += this.width/2;
            transform[1] += this.height/2;
            return `translate(${transform})`;
        },
        resize() {
            this.width = this.$refs.donutChartContainer.getBoundingClientRect().width;
            this.height = this.$refs.donutChartContainer.getBoundingClientRect().height;
        }
    }
}
</script>

<style scoped>

svg {
    margin-top: 10px;
}

.donut-title {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

</style>

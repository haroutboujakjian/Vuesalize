<template>
    <svg :width="width" :height="height">
        <g v-for="(group, id) in groups" :key="id"
           :transform="`translate(${xScale(xAxisTicks[id])}, 0)`"
           class="bar">
            <rect v-for="(key, vid) in Object.keys(group)" :key="vid"
                  :x="xSubgroupScale(key)"
                  :y="yScale(group[key])"
                  :height="height - yScale(group[key]) - margin.bottom"
                  :width="xSubgroupScale.bandwidth()"
                  :fill="color(key)">
                <title>{{ group[key]}}</title>
            </rect>
        </g>
        <g v-xaxis="{scale: xScale, tickLabels: xAxisTicks}" class="axis" :transform="xtranslate"></g>
        <g v-yaxis="{scale: yScale}" class="axis" :transform="ytranslate"></g>
    </svg>
</template>

<script>
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max, range} from 'd3-array';
import {select} from 'd3-selection';
import {axisLeft, axisBottom} from 'd3-axis';

export default {
    name: "GroupedBarChart",
    props: {
        plotdata: Array,
        width: Number,
        height: Number,
        colors: Array,
        x_key: String,
        margin: {
            type: Object,
            default: function () {
                return {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20
                }
            }
        }
    },
    data() {
        return {}
    },
    computed: {
        xtranslate() {
            return `translate(0, ${this.height - this.margin.bottom})`;
        },
        ytranslate() {
            return `translate(${this.margin.left}, 0)`;
        },
        groupKeys() {
            /**
             * Object keys for each of the y values
             */
            return Object.keys(this.plotdata[0]).filter(item => item !== this.x_key)
        },
        xAxisTicks() {
            return this.plotdata.map(item => item[this.x_key])
        },
        groups() {
            return this.plotdata.map(({[this.x_key]: name, ...rest}) => rest)
        },
        color() {
            return scaleOrdinal().range(this.colors)
        },
        xScale() {
            return scaleBand()
                .domain(this.xAxisTicks)
                .range([this.margin.left, this.width - this.margin.right])
                .padding(0.15);
        },
        xSubgroupScale() {
            return scaleBand()
                .domain(this.groupKeys)
                .rangeRound([0, this.xScale.bandwidth()])
                .padding(0.05)
        },
        yScale() {
            return scaleLinear()
                .domain([0, this.getMax(this.groups)])
                .range([this.height - this.margin.bottom, this.margin.top])
                .nice()
        }

    },

    methods: {
        getMax(array) {
            return max(array.map(item => max(Object.values(item))))
        }
    },

    directives: {
        xaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const tickLabels = binding.value.tickLabels
            console.log(tickLabels)
            select(el).call(axisBottom(scale).tickValues(tickLabels))
        },
        yaxis(el, binding) {
            const scale = binding.value.scale
            select(el).call(axisLeft(scale).ticks(7))
        }
    }

}
</script>

<style scoped>

rect:hover {
    fill: darkgrey;
}

.axis {
    font-size: 0.75rem;
    shape-rendering: crispEdges;
}

</style>



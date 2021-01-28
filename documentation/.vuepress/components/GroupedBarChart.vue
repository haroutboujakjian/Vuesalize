<template>
    <svg :width="width" :height="height">
        <g class="bars">
            <g class="bar"
               v-for="(item, id) in plotdata"
               :key="id"
               :transform="`translate(${scale.x(id)}, 0)`">
                <rect v-for="(value, vid) in Object.keys(item.group)"
                      :key="vid"
                      :x="scale.xsubgroup(value)"
                      :y="scale.y(item.group[value])"
                      :height="height - scale.y(item.group[value])- margin.bottom"
                      :width="scale.xsubgroup.bandwidth()"
                      :fill="color(value)">
                    <title>{{ item.group[value]}}</title>
                </rect>
            </g>
        </g>
        <g v-xaxis:x="scale" class="axis" :transform="xtranslate"></g>
        <g v-yaxis:y="scale" class="axis" :transform="ytranslate"></g>
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
            return this.plotdata.length > 0 ? Object.keys(this.plotdata[0].group) : ''
        },
        color() {
            return scaleOrdinal().range(this.colors)
        },
        scale() {
            const x = scaleBand()
                .domain(range(this.plotdata.length))
                .range([this.margin.left, this.width - this.margin.right])
                .padding(0.15);
            const xsubgroup = scaleBand()
                .domain(this.groupKeys)
                .rangeRound([0, x.bandwidth()])
                .padding(0.05)
            const y = scaleLinear()
                .domain([0, this.getMax(this.plotdata)])
                .range([this.height - this.margin.bottom, this.margin.top])
                .nice()
            return {x, xsubgroup, y}
        }

    },

    methods: {
        getMax(array) {
            return max(array.map(item => max(Object.values(item.group))))
        }
    },

    directives: {
        xaxis(el, binding, vnode) {
            const axis = binding.arg
            const methodArg = binding.value[axis]
            const ticks = vnode.context._props.plotdata.map(e => e.x)
            select(el).call(axisBottom(methodArg)
                .tickValues(range(ticks.length))
                .tickFormat(i => ticks[i]))
        },
        yaxis(el, binding) {
            const axis = binding.arg
            const methodArg = binding.value[axis]
            select(el).call(axisLeft(methodArg).ticks(7))
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



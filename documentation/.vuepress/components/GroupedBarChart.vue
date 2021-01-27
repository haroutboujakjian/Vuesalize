<template>
    <div class="GroupedBarChart">
        <svg :width="width" :height="height">
            <g class="bars">
                <g class="bar"
                   v-for="(meeting, id) in chartData"
                   :key="id"
                   :transform="'translate( ' + scale.x(id) + ', 0)'">
                    <rect v-for="(value, vid) in Object.keys(meeting.values)"
                          :key="vid"
                          :x="scale.x1(value)"
                          :y="scale.y(meeting.values[value])"
                          :height="height - scale.y(meeting.values[value])- margin.bottom"
                          :width="scale.x1.bandwidth()"
                          :fill="color(value)">
                        <title>{{ meeting.values[value]}}</title>
                    </rect>
                </g>
            </g>
            <g v-xaxis:x="scale" class="axis x-axis" :transform="xtranslate"></g>
            <g v-yaxis:y="scale" class="axis y-axis" :transform="ytranslate"></g>
        </svg>

    </div>
</template>

<script>
import {scaleLinear, scaleOrdinal, scaleBand} from 'd3-scale';
import {max, range} from 'd3-array';
import {select} from 'd3-selection';
import {axisLeft, axisBottom} from 'd3-axis';

export default {
    name: "GroupedBarChart",
    props: {
        chartData: Array,
        width: Number,
        height: Number,
        colors: Array
    },
    data() {
        return {
            margin: {
                top: 30,
                bottom: 20,
                left: 30,
                right: 20
            }
        }
    },
    computed: {
        xtranslate() {
            return 'translate(0, ' + (this.height - 20) + ')';
        },
        ytranslate() {
            return 'translate(' + this.margin.left + ', 0)';
        },
        groupKeys() {
            if (this.chartData.length !== 0) {
                return Object.keys(this.chartData[0].values)
            }
            return ''
        },
        color() {
            return scaleOrdinal().range(this.colors)
        },
        scale() {
            const x = scaleBand()
                .domain(d3.range(this.chartData.length))
                .range([this.margin.left, this.width - this.margin.right])
                .padding(0.15);
            const x1 = scaleBand()
                .domain(this.groupKeys)
                .rangeRound([0, x.bandwidth()])
                .padding(0.05)
            const y = scaleLinear()
                .domain([0, this.getMax(this.chartData)])
                .range([this.height - this.margin.bottom, this.margin.top]);
            return {x, x1, y}
        }

    },

    methods: {
        getMax(array) {
            let max_val = max(array.map(item => max(Object.values(item.values))))
            return max_val > 5 ? max_val : 5
        }
    },

    directives: {
        xaxis(el, binding, vnode) {
            const axis = binding.arg
            const methodArg = binding.value[axis]
            const ticks = vnode.context._props.sortedMeetings.map(e => e.MeetingDate + ' ' + e.BoardName)
            select(el).call(axisBottom(methodArg)
                .tickValues(range(ticks.length))
                .tickFormat(i => ticks[i])
                .tickSizeOuter(0))
        },
        yaxis(el, binding) {
            const axis = binding.arg
            const methodArg = binding.value[axis]
            select(el).call(axisLeft(methodArg).ticks(7).tickSizeOuter(0))
        }
    }

}
</script>

<style scoped>
.GroupedBarChart {
    position: relative;
}

.chartTitle {
    font-weight: bold;
    font-size: 1.1rem;
}

rect:hover {
    fill: darkgrey;
}

.axis {
    font-weight: bold;
    font-size: 0.75rem;
    shape-rendering: crispEdges;
}


</style>



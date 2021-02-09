<template>
    <figure>
        <svg :width="width" :height="height">
            <g v-for="(group, id) in groups" :key="id"
               :transform="`translate(${xScale(xAxisTicks[id])}, 0)`"
               class="bar">
                <rect v-for="(key, vid) in Object.keys(group)" :key="vid"
                      :x="xSubgroupScale(key)"
                      :y="yScale(group[key])"
                      :height="height - yScale(group[key]) - margin.bottom"
                      :width="xSubgroupScale.bandwidth()"
                      :fill="color(key)"
                      @mouseover="populateTooltip($event, key, group[key])"
                      @mouseout="showTooltip = false">
                </rect>
            </g>
            <g v-xaxis="{scale: xScale, tickLabels: xAxisTicks}" class="axis" :transform="xtranslate"></g>
            <g v-yaxis="{scale: yScale}" class="axis" :transform="ytranslate"></g>
        </svg>
        <div v-if="enable_tooltip"
             class="tooltipContainer"
             :class="{activeTooltip: showTooltip}"
             :style="`top: ${tooltipContent.top + 10}px; left: ${tooltipContent.left + 10}px`">
            <slot name="tooltip" :bar="tooltipContent">
                <p>{{ tooltipContent.y_label }}: {{ tooltipContent.y_value }}</p>
            </slot>
        </div>
    </figure>

</template>

<script>
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
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
        enable_tooltip: {
            type: Boolean,
            default: true
        },
        margin: {
            type: Object,
            default: function () {
                return {top: 20, bottom: 20, left: 20, right: 20}
            }
        }
    },
    data() {
        return {
            showTooltip: false,
            tooltipContent: {}
        }
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
        },
        populateTooltip(e, key, group) {
            this.showTooltip = true
            this.tooltipContent.top = e.clientY
            this.tooltipContent.left = e.clientX
            this.tooltipContent.y_value = group
            this.tooltipContent.y_label = key
        }
    },

    directives: {
        xaxis(el, binding) {
            const scale = binding.value.scale
            const tickLabels = binding.value.tickLabels
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

.axis {
    font-size: 0.75rem;
    shape-rendering: crispEdges;
}

rect {
    cursor: pointer;
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



<template>
    <figure>
        <svg :width="width" :height="height">
            <transition-group tag="g">
                <g v-for="row in series" :key="row.key" :fill="color(row.key)">
                    <rect class="animate" v-for="(bar, i) in row" :key="i"
                          :x="xScale(bar.data[x_key])" :y="yScale(bar[1])"
                          :width="xScale.bandwidth()" :height="yScale(bar[0])-yScale(bar[1])"
                          @mouseover="populateTooltip($event, bar, row)"
                          @mouseout="showTooltip = false">
                    </rect>
                    <!--                    <title :key="row.key">{{ row.key }}</title>-->
                </g>
            </transition-group>
            <g v-xaxis="{scale: xScale}" :transform="`translate(0, ${height - margin.bottom})`"></g>
            <g v-yaxis="{scale: yScale}" :transform="`translate(${margin.left}, 0)`"></g>
        </svg>
        <div v-if="enable_tooltip"
             class="tooltipContainer"
             :class="{activeTooltip: showTooltip}"
             :style="`top: ${tooltipContent.top + 10}px; left: ${tooltipContent.left + 10}px`">
            <slot name="tooltip" :bar="tooltipContent">
                <p>{{ tooltipContent.y_label }}: {{ tooltipContent.y_value }}</p>
                <p>{{ tooltipContent.x_label }}: {{ tooltipContent.x_value }}</p>
            </slot>
        </div>
    </figure>

</template>

<script>
import {stack} from 'd3-shape';
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import {axisBottom, axisLeft} from 'd3-axis';
// eslint-disable-next-line no-unused-vars
import {transition} from 'd3-transition';

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
        enable_tooltip: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showTooltip: false,
            tooltipContent: {},
        }
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
    methods: {
        populateTooltip(e, bar, row) {
            this.showTooltip = true
            this.tooltipContent.top = e.clientY
            this.tooltipContent.left = e.clientX
            this.tooltipContent.x_value = bar.data[this.x_key]
            this.tooltipContent.x_label = this.x_key
            this.tooltipContent.y_value = bar.data[row.key]
            this.tooltipContent.y_label = row.key

        }
    },
    directives: {
        xaxis(el, binding) {
            let scale = binding.value.scale
            select(el).transition().duration(500).call(axisBottom(scale).ticks())
        },
        yaxis(el, binding) {
            let scale = binding.value.scale
            select(el).transition().duration(500).call(axisLeft(scale).ticks())
        }
    }
}
</script>

<style scoped>
.animate {
    transition: all 0.5s;
}

.animate-enter, .animate-leave-to {
    opacity: 0;
    transform: scale(0);
}

.animate-enter-to {
    opacity: 1;
    transform: scale(1);
}

.animate-move {
    opacity: 1;
    transition: all 0.5s;
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
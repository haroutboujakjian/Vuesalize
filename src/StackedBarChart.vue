<template>
    <figure>
        <svg :width="width" :height="height">
            <template v-if="direction === 'vertical'">
                <transition-group tag="g">
                    <g v-for="row in series" :key="row.key" :fill="color(row.key)">
                        <rect class="animate" v-for="(bar, i) in row" :key="i"
                              :x="barScale(bar.data[xKey])" :y="linearScale(bar[1])"
                              :width="barScale.bandwidth()" :height="linearScale(bar[0])-linearScale(bar[1])"
                              @mouseover="populateTooltip($event, bar, row)"
                              @mouseout="showTooltip = false"
                              @click="$emit('click', tooltipContent)">
                        </rect>
                    </g>
                </transition-group>
                <g v-baraxis="{scale: barScale, direction: 'vertical'}" class="xaxis"
                   :transform="`translate(0, ${height - margin.bottom})`">
                </g>
                <g v-linearaxis="{scale: linearScale, direction: 'vertical'}" class="yaxis"
                   :transform="`translate(${margin.left}, 0)`">
                </g>
            </template>
            <template v-else-if="direction === 'horizontal'">
                <transition-group tag="g">
                    <g v-for="row in series" :key="row.key" :fill="color(row.key)">
                        <rect class="animate" v-for="(bar, i) in row" :key="i"
                              :y="barScale(bar.data[xKey])" :x="linearScale(bar[0])"
                              :height="barScale.bandwidth()" :width="linearScale(bar[1])-linearScale(bar[0])"
                              @mouseover="populateTooltip($event, bar, row)"
                              @mouseout="showTooltip = false"
                              @click="$emit('click', tooltipContent)">
                        </rect>
                    </g>
                </transition-group>
                <g v-baraxis="{scale: barScale, direction: 'horizontal'}" class="yaxis"
                   :transform="`translate(${margin.left}, 0)`">
                </g>
                <g v-linearaxis="{scale: linearScale,  direction: 'horizontal'}" class="xaxis"
                   :transform="`translate(0, ${barAxisLocation === 'top' ? margin.top : height - margin.bottom})`">
                </g>
            </template>
            <AxisLabels :chart-margin="margin" :width="width" :height="height"
                        :x-axis-label="xAxisLabel" :y-axis-label="yAxisLabel"
                        :x-axis-label-shift="xAxisLabelShift" :y-axis-label-shift="yAxisLabelShift">
            </AxisLabels>
            <Annotations :annotations="annotations" :margin="margin"
                         :linear-scale="linearScale" :bar-scale="barScale"
                         :width="width" :height="height" :direction="direction">
            </Annotations>
        </svg>
        <div v-if="enableTooltip && showTooltip"
             class="tooltipContainer"
             :class="{activeTooltip: showTooltip}"
             :style="`top: ${tooltipContent.top + 10}px; left: ${tooltipContent.left + 10}px`">
            <slot name="tooltip" :bar="tooltipContent">
                <span>{{ tooltipContent.y_label }}: {{ tooltipContent.y_value }}</span>
                <span>{{ tooltipContent.x_label }}: {{ tooltipContent.x_value }}</span>
            </slot>
        </div>
    </figure>

</template>

<script>
import {stack} from 'd3-shape';
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import {axisBottom, axisLeft, axisTop} from 'd3-axis';
// eslint-disable-next-line no-unused-vars
import {transition} from 'd3-transition';
import Annotations from "./Annotations";
import AxisLabels from "./AxisLabels";
import colors from "./colors"

export default {
    name: "StackedBarChart",
    components: {Annotations, AxisLabels},
    props: {
        width: {
            type: Number,
            default: 350,
        },
        height: {
            type: Number,
            default: 250,
        },
        direction: {
            type: String,
            default: 'vertical',
            validator: function (value) {
                return ['vertical', 'horizontal'].indexOf(value) !== -1
            }
        },
        barAxisLocation: {
            type: String,
            default: 'bottom',
            validator: function (value) {
                return ['top', 'bottom'].indexOf(value) !== -1
            }
        },
        margin: {
            type: Object,
            default: function () {
                return {top: 20, bottom: 20, left: 20, right: 20}
            }
        },
        plotData: Array,
        colors: {
            type: Array,
            default: function () {
                return colors
            }
        },
        xKey: String,
        enableTooltip: {
            type: Boolean,
            default: true
        },
        annotations: {
            type: Array,
            default: function () {
                return []
            }
        },
        paddingBetweenBars: {
            type: Number,
            default: 0.1
        },
        xAxisLabel: String,
        yAxisLabel: String,
        xAxisLabelShift: Object,
        yAxisLabelShift: Object,
        xTickFormat: {
            type: Function,
            default: null,
        },
        yTickFormat: {
            type: Function,
            default: null,
        },
        xMin: {
            type: Number,
            default: null
        },
        xMax: {
            type: Number,
            default: null
        },
        yMin: {
            type: Number,
            default: null
        },
        yMax: {
            type: Number,
            default: null
        },
        xTicks: {
            /*
            number sent into d3.ticks function for x-axis
             */
            type: Number,
            default: 5,
        },
        yTicks: {
            /*
            number sent into d3.ticks function for y-axis
            */
            type: Number,
            default: 5,
        },
    },
    data() {
        return {
            showTooltip: false,
            tooltipContent: {},
        }
    },
    computed: {
        object_keys() {
            return Object.keys(this.plotData[0]).filter(item => item !== this.xKey)
        },
        series() {
            return stack()
                .keys(this.object_keys)(this.plotData)
                .map(e => (e.forEach(v => v.key = e.key), e))
        },
        barScale() {
            const barScale = scaleBand()
                .domain(this.plotData.map(d => d[this.xKey]))
                .padding(this.paddingBetweenBars)

            return this.direction === 'vertical'
                ? barScale.range([this.margin.left, this.width - this.margin.right])
                : barScale.range([this.margin.top, this.height - this.margin.bottom])
        },
        linearScale() {
            // determine whether x or y min/max scale limits should be applied based on direction of chart
            const values = this.direction === 'vertical' ? [this.yMin, this.yMax] : [this.xMin, this.xMax]
            const minValue = values[0] ? values[0] : 0
            const maxValue = values[1] ? values[1] : max(this.series, d => max(d, d => d[1]))

            const linearScale = scaleLinear()
                .domain([minValue, maxValue])
                .nice()

            return this.direction === 'vertical'
                ? linearScale.range([this.height - this.margin.bottom, this.margin.top])
                : linearScale.range([this.margin.left, this.width - this.margin.right])
        },
        color() {
            return scaleOrdinal()
                .domain(this.series.map(d => d.key))
                .range(this.colors)
        },
    },
    methods: {
        populateTooltip(e, bar, row) {
            this.showTooltip = true
            this.tooltipContent.top = e.pageY
            this.tooltipContent.left = e.pageX
            this.tooltipContent.x_value = bar.data[this.xKey]
            this.tooltipContent.x_label = this.xKey
            this.tooltipContent.y_value = bar.data[row.key]
            this.tooltipContent.y_label = row.key
        }
    },
    directives: {
        baraxis(el, binding, vnode) {
            const scale = binding.value.scale
            const direction = binding.value.direction
            const xTickFormat = vnode.context._props.xTickFormat
            const yTickFormat = vnode.context._props.yTickFormat

            if (direction === 'vertical') {
                select(el).transition().duration(500).call(axisBottom(scale).ticks().tickFormat(xTickFormat))
            } else if (direction === 'horizontal') {
                select(el).transition().duration(500).call(axisLeft(scale).ticks().tickFormat(yTickFormat))
            }

        },
        linearaxis(el, binding, vnode) {
            const scale = binding.value.scale
            const direction = binding.value.direction
            const axisType = vnode.context._props.barAxisLocation === 'bottom' ? axisBottom : axisTop
            const xTickFormat = vnode.context._props.xTickFormat
            const yTickFormat = vnode.context._props.yTickFormat
            const xTicks = vnode.context._props.xTicks
            const yTicks = vnode.context._props.yTicks

            if (direction === 'vertical') {
                select(el).transition().duration(500).call(axisLeft(scale).ticks(yTicks).tickFormat(yTickFormat))
            } else if (direction === 'horizontal') {
                select(el).transition().duration(500).call(axisType(scale).ticks(xTicks).tickFormat(xTickFormat))
            }
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

.tooltipContainer span {
    display: block;
}
</style>
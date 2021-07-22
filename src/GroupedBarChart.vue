<template>
    <figure>
        <svg :width="width" :height="height">
            <template v-if="direction === 'vertical'">
                <g v-for="(bargroup, id) in groups" :key="id"
                   :transform="`translate(${bandScale(bandAxisTicks[id])}, 0)`">
                    <rect v-for="(value, subgroup) in bargroup" :key="subgroup"
                          :x="bandSubgroupScale(subgroup)" :width="bandSubgroupScale.bandwidth()"
                          :y="linearScale(value)" :height="height - linearScale(value) - margin.bottom"
                          :fill="color(subgroup)"
                          @mouseover="populateTooltip($event, subgroup, value)"
                          @mouseout="showTooltip = false">
                    </rect>
                </g>
                <g v-bandaxis="{scale: bandScale, tickLabels: bandAxisTicks, direction: 'vertical'}"
                   class="axis" :transform="`translate(0, ${this.height - this.margin.bottom})`">
                </g>
                <g v-linearaxis="{scale: linearScale, direction: 'vertical'}" class="axis"
                   :transform="`translate(${this.margin.left}, 0)`">
                </g>
            </template>
            <template v-else>
                <g v-for="(bargroup, id) in groups" :key="id"
                   :transform="`translate(0 ,${bandScale(bandAxisTicks[id])})`">
                    <rect v-for="(value, subgroup) in bargroup" :key="subgroup"
                          :x="linearScale(0)" :width="linearScale(value) - linearScale(0)"
                          :y="bandSubgroupScale(subgroup)" :height="bandSubgroupScale.bandwidth()"
                          :fill="color(subgroup)"
                          @mouseover="populateTooltip($event, subgroup, value)"
                          @mouseout="showTooltip = false">
                    </rect>
                </g>
                <g v-linearaxis="{scale: linearScale, direction: 'horizontal'}"
                   :transform="`translate(0, ${this.height - this.margin.bottom})`" class="axis">
                </g>
                <g v-bandaxis="{scale: bandScale, tickLabels: bandAxisTicks, direction: 'horizontal'}"
                   class="axis" :transform="`translate(${this.margin.left}, 0)`">
                </g>
            </template>
            <AxisLabels :width="width" :height="height" :chart-margin="margin"
                        :x-axis-label="xAxisLabel" :y-axis-label="yAxisLabel"
                        :x-axis-label-shift="xAxisLabelShift" :y-axis-label-shift="yAxisLabelShift">
            </AxisLabels>
            <Annotations :annotations="annotations" :margin="margin"
                         :linear-scale="linearScale" :bar-scale="bandScale"
                         :width="width" :height="height" :direction="direction">
            </Annotations>
        </svg>
        <div v-if="enableTooltip"
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
import {axisLeft, axisBottom, axisTop} from 'd3-axis';
import Annotations from "./Annotations";
import AxisLabels from "./AxisLabels";
import colors from "./colors";

export default {
    name: "GroupedBarChart",
    components: {Annotations, AxisLabels},
    props: {
        plotData: Array,
        width: Number,
        height: Number,
        colors: {
            type: Array,
            default: function () {
                return colors
            }
        },
        xKey: String,
        direction: {
            type: String,
            default: 'vertical',
            validator: function (value) {
                return ['vertical', 'horizontal'].indexOf(value) !== -1
            }
        },
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
        margin: {
            type: Object,
            default: function () {
                return {top: 20, bottom: 20, left: 20, right: 20}
            }
        },
        barAxisLocation: {
            type: String,
            default: 'bottom',
            validator: function (value) {
                return ['top', 'bottom'].indexOf(value) !== -1
            }
        },
        paddingBetweenBars: {
            type: Number,
            default: 0.15,
            validator: function (value) {
                return value >= 0 && value <= 1
            }
        },
        paddingBetweenGroups: {
            type: Number,
            default: 0.15,
            validator: function (value) {
                return value >= 0 && value <= 1
            }
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
        }
    },
    data() {
        return {
            showTooltip: false,
            tooltipContent: {}
        }
    },
    computed: {
        groupKeys() {
            /**
             * Object keys for each of the y values
             */
            const groupKeys = Object.keys(this.plotData[0]).filter(item => item !== this.xKey)
            return this.direction === 'vertical' ? groupKeys : groupKeys.reverse()
        },
        bandAxisTicks() {
            return this.plotData.map(item => item[this.xKey])
        },
        groups() {
            // eslint-disable-next-line no-unused-vars
            return this.plotData.map(({[this.xKey]: name, ...rest}) => rest)
        },
        color() {
            return scaleOrdinal().range(this.colors)
        },
        bandScale() {
            const bandScale = scaleBand()
                .domain(this.bandAxisTicks)
                .padding(this.paddingBetweenGroups);

            return this.direction === 'vertical'
                ? bandScale.range([this.margin.left, this.width - this.margin.right])
                : bandScale.range([this.margin.top, this.height - this.margin.bottom])
        },
        bandSubgroupScale() {
            const bandScale = scaleBand()
                .domain(this.groupKeys)
                .padding(this.paddingBetweenBars)

            return this.direction === 'vertical'
                ? bandScale.rangeRound([0, this.bandScale.bandwidth()])
                : bandScale.rangeRound([this.bandScale.bandwidth(), 0])
        },
        linearScale() {
            const linearScale = scaleLinear()
                .domain([0, this.getMax(this.groups)])
                .nice()

            return this.direction === 'vertical'
                ? linearScale.range([this.height - this.margin.bottom, this.margin.top])
                : linearScale.range([this.margin.left, this.width - this.margin.right])
        }

    },

    methods: {
        getMax(array) {
            return max(array.map(item => max(Object.values(item))))
        },
        populateTooltip(e, key, group) {
            this.showTooltip = true
            this.tooltipContent.top = e.pageY
            this.tooltipContent.left = e.pageX
            this.tooltipContent.y_value = group
            this.tooltipContent.y_label = key
        }
    },
    directives: {
        bandaxis(el, binding, vnode) {
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

            if (direction === 'vertical') {
                select(el).transition().duration(500).call(axisLeft(scale).ticks(5).tickFormat(yTickFormat))
            } else if (direction === 'horizontal') {
                select(el).transition().duration(500).call(axisType(scale).ticks(5).tickFormat(xTickFormat))
            }
        }
    }

}
</script>

<style scoped>

.axis {
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
    opacity: 1;
    transition: opacity 0.3s;
}
</style>



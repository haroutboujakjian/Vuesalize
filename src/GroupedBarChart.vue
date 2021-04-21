<template>
    <figure>
        <svg :width="width" :height="height">
            <template v-if="direction === 'vertical'">
                <g v-for="(group, id) in groups" :key="id" class="bar"
                   :transform="`translate(${bandScale(bandAxisTicks[id])}, 0)`">
                    <rect v-for="(key, vid) in Object.keys(group)" :key="vid"
                          :x="bandSubgroupScale(key)" :y="linearScale(group[key])"
                          :height="height - linearScale(group[key]) - margin.bottom"
                          :width="bandSubgroupScale.bandwidth()"
                          :fill="color(key)"
                          @mouseover="populateTooltip($event, key, group[key])"
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
                <g v-for="(group, id) in groups" :key="id" class="bar"
                   :transform="`translate(0 ,${bandScale(bandAxisTicks[id])})`">
                    <rect v-for="(key, vid) in Object.keys(group)" :key="vid"
                          :y="bandSubgroupScale(key)" :x="linearScale(vid)"
                          :width="linearScale(group[key]) - linearScale(vid)"
                          :height="bandSubgroupScale.bandwidth()"
                          :fill="color(key)"
                          @mouseover="populateTooltip($event, key, group[key])"
                          @mouseout="showTooltip = false">
                        <title>{{ linearScale(0) }}</title>
                    </rect>
                </g>
                <g v-linearaxis="{scale: linearScale, direction: 'horizontal'}"
                   :transform="`translate(0, ${this.height - this.margin.bottom})`" class="axis">
                </g>
                <g v-bandaxis="{scale: bandScale, tickLabels: bandAxisTicks, direction: 'horizontal'}"
                   class="axis" :transform="`translate(${this.margin.left}, 0)`">
                </g>
            </template>
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
import {axisLeft, axisBottom} from 'd3-axis';

export default {
    name: "GroupedBarChart",
    props: {
        plotData: Array,
        width: Number,
        height: Number,
        colors: Array,
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
        groupKeys() {
            /**
             * Object keys for each of the y values
             */
            return Object.keys(this.plotData[0]).filter(item => item !== this.xKey)
        },
        bandAxisTicks() {
            return this.plotData.map(item => item[this.xKey])
        },
        groups() {
            return this.plotData.map(({[this.xKey]: name, ...rest}) => rest)
        },
        color() {
            return scaleOrdinal().range(this.colors)
        },
        bandScale() {
            const bandScale = scaleBand()
                .domain(this.bandAxisTicks)
                .padding(0.15);

            return this.direction === 'vertical'
                ? bandScale.range([this.margin.left, this.width - this.margin.right])
                : bandScale.range([this.margin.top, this.height - this.margin.bottom])
        },
        bandSubgroupScale() {
            const bandScale = scaleBand()
                .domain(this.groupKeys)
                .padding(0.05)

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
        bandaxis(el, binding) {
            const scale = binding.value.scale
            const direction = binding.value.direction
            const tickLabels = binding.value.tickLabels
            if (direction === 'vertical') {
                select(el).call(axisBottom(scale).tickValues(tickLabels))
            } else if (direction === 'horizontal') {
                select(el).call(axisLeft(scale).tickValues(tickLabels))
            }
        },
        linearaxis(el, binding) {
            const scale = binding.value.scale
            const direction = binding.value.direction
            if (direction === 'vertical') {
                select(el).call(axisLeft(scale).ticks(7))
            } else if (direction === 'horizontal') {
                select(el).call(axisBottom(scale).ticks(7))
            }
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
    opacity: 1;
    transition: opacity 0.3s;
}
</style>



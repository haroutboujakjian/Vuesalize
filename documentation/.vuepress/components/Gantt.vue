<template>
    <svg :width="width" :height="height"
         @mousemove="drag($event)"
         @mouseup="endDrag()" @mouseleave="endDrag()">
        <g v-xaxis="{scale: xScale}" :transform="`translate(${widthOfText} ${margin.top})`"></g>

        <g v-for="project in plotData" :key="project.name"
           :transform="`translate(0, ${yScale(project.name) + 3})`">
            <g class="checkBoxGroup" :transform="`translate(${margin.left} 5)`"
               @click="makeProjectsInactive(project.name)">
                <text :transform="'translate(20 14)'">
                    {{ shortenText(project.name, 14) }}
                    <title>{{ project.name }}</title>
                </text>
                <path v-if="project.active" class="checkMark"
                      d="M20 12.194v9.806h-20v-20h18.272l-1.951 2h-14.321v16h16v-5.768l2-2.038zm.904-10.027l-9.404 9.639-4.405-4.176-3.095 3.097 7.5 7.273 12.5-12.737-3.096-3.096z"/>
                <rect v-else class="emptyCheckbox"
                      x="0" y="1" height="15" width="14">
                </rect>
            </g>

            <rect :x="xScale(new Date(project.start_date)) + widthOfText"
                  :width="xScale(new Date(project.end_date)) - xScale(new Date(project.start_date))"
                  :y="3" :height="yScale.bandwidth()"
                  :fill="color(project.portfolio)"
                  :fill-opacity="project.active ? 1 : 0.3"
                  :class="{ rectGrabbing: selectedRect}"
                  class="animate"
                  @mousedown="startDrag($event, project)">
            </rect>
        </g>

    </svg>
</template>

<script>
import {shortenText} from "@/helpers";
import {scaleTime, scaleBand, scaleOrdinal} from "d3-scale";
import {select} from 'd3-selection';
import {axisTop} from 'd3-axis';

import {mapMutations} from 'vuex';

export default {
    name: "Gantt",
    props: {
        width: Number,
        height: Number,
        margin: Object,
        plotData: Array,
        colors: Array,
    },
    data() {
        return {
            widthOfText: 72,
            selectedRect: null,
            startDate: new Date('2018-06-01'),
            endDate: new Date('2030-12-30'),
            dragYear: null,
        }
    },
    computed: {
        project_names() {
            return this.plotData.map(e => e.name)
        },
        portfolio() {
            return [...new Set(this.plotData.map(e => e.portfolio))]
        },
        startYear() {
            return this.startDate.getFullYear()
        },
        endYear() {
            return this.endDate.getFullYear()
        },
        xScale() {
            return scaleTime()
                .domain([this.startDate, this.endDate])
                .range([this.margin.left + this.widthOfText, this.width - this.margin.right - this.widthOfText])
        },
        yScale() {
            return scaleBand()
                .domain(this.project_names)
                .range([this.margin.top, this.height - this.margin.bottom])
                .paddingInner(.25)
        },
        color() {
            return scaleOrdinal().domain(this.portfolio).range(this.colors)
        }
    },
    methods: {
        ...mapMutations(['makeProjectsInactive', 'shiftFundingByOneYearForProject']),
        shortenText,
        convertXPosToYear(xPos) {
            return this.xScale.invert(xPos + 10 - (this.margin.left + this.widthOfText)).getFullYear()
        },
        startDrag(e, project) {
            let start_date = new Date(project.start_date).getFullYear()
            let end_date = new Date(project.end_date).getFullYear()
            this.selectedRect = {evt: e, project_name: project.name, start_date: start_date, end_date: end_date}

            this.dragYear = this.convertXPosToYear(e.x)
        },
        drag(e) {
            if (this.selectedRect) {
                let new_drag_year = this.convertXPosToYear(e.x)

                if (new_drag_year < this.selectedRect.start_date && new_drag_year > this.startYear
                    && new_drag_year < this.dragYear) {

                    this.shiftFundingByOneYearForProject({
                        project_name: this.selectedRect.project_name,
                        shift: 'backward'
                    })
                    this.dragYear = new_drag_year

                } else if (new_drag_year > this.selectedRect.end_date && new_drag_year < this.endYear
                    && new_drag_year > this.dragYear) {

                    this.shiftFundingByOneYearForProject({
                        project_name: this.selectedRect.project_name,
                        shift: 'forward'
                    })
                    this.dragYear = new_drag_year

                }
            }
        },
        endDrag() {
            this.selectedRect = null
        }
    },
    directives: {
        xaxis(el, binding) {
            const scale = binding.value.scale
            select(el).transition().duration(500).call(axisTop(scale).ticks(6))
        }
    }
}
</script>

<style scoped>
.checkBoxGroup {
    cursor: pointer;
    pointer-events: visibleFill;
}

text {
    font-size: 0.85rem;
    text-rendering: optimizeLegibility;
}

.checkMark {
    transform: scale(0.70);
    fill: black;
    transition: fill 0.25s;
}

.checkMark:hover {
    fill: #414141;
}

.emptyCheckbox {
    fill: transparent;
    stroke: black;
}

.emptyCheckbox:hover {
    stroke: #414141;
}

rect {
    cursor: grab;
}

.rectGrabbing {
    cursor: grabbing;
}

.animate {
    transition: all 0.15s;
}

</style>
<template>
    <svg :width="width" :height="height" ref="svgContainer"
         @mousemove="drag($event)"
         @mouseup="drop()" @mouseleave="drop()">

        <g class="lines">
            <line v-for="link in graph.links"
                  :key="`${link.source.index}_${link.target.index}`"
                  :x1="link.source.x"
                  :y1="link.source.y"
                  :x2="link.target.x"
                  :y2="link.target.y">
            </line>
        </g>

        <g class="nodes">
            <circle v-for="node in graph.nodes"
                    :key="`n${node.index}`"
                    :cx="node.x" :cy="node.y"
                    :r="nodeRadius" :fill="node.color"
                    class="nodeGrab"
                    :class="{ nodeGrabbing: currentMove}"
                    @mousedown="dragStart($event, node)">
            </circle>
        </g>

    </svg>
</template>

<script>
import {forceSimulation, forceManyBody, forceCenter, forceX, forceY, forceLink} from 'd3-force';
//@todo add tooltip
//@todo add hover over highight

export default {
    name: "Network",
    props: {
        width: Number,
        height: Number,
        plotData: Object,
        nodeRadius: {
            type: Number,
            default: 10
        },
        forceStrength: {
            type: Number,
            default: -80
        }
    },
    data() {
        return {
            simulation: null,
            currentMove: null,
            graph: this.plotData
        }

    },
    created() {
        this.simulation = forceSimulation(this.graph.nodes)
            /*eslint-disable-next-line*/
            .force('charge', forceManyBody().strength(d => this.forceStrength))
            .force('center', forceCenter(this.width / 2, this.height / 2))
            .force('link', forceLink(this.graph.links))
            .force('x', forceX())
            .force('y', forceY())
    },
    methods: {
        dragStart(e, node) {
            this.currentMove = {x: e.screenX, y: e.screenY, node: node}
        },
        drag(e) {
            if (this.currentMove) {
                let top = this.$refs.svgContainer.getBoundingClientRect().top
                let left = this.$refs.svgContainer.getBoundingClientRect().left

                this.currentMove.node.x = e.clientX - left
                this.currentMove.node.y = e.clientY - top

                this.currentMove.node.fx = e.clientX - left
                this.currentMove.node.fy = e.clientY - top
            }
        },
        drop() {
            this.currentMove = null
            this.simulation.restart()
        }
    }
}

</script>


<style>
circle {
    stroke: white;
}

line {
    stroke: black;
}

.nodeGrab {
    cursor: grab;
}

.nodeGrabbing {
    cursor: grabbing;
}
</style>













<template>
    <svg :width="width" :height="height" ref="svgContainer"
         id="svgContainer"
         @mousemove="drag($event)"
         @mouseup="drop()" @mouseleave="drop()">

        <g id="graphContainer" :transform="zoomTranslate">
            <g class="lines nozoom">
                <line v-for="link in graph.links"
                      :key="`${link.source.name}_${link.target.name}`"
                      :x1="link.source.x"
                      :y1="link.source.y"
                      :x2="link.target.x"
                      :y2="link.target.y">
                </line>
            </g>

            <g class="nodes">
                <g v-for="node in nodes" :key="`${node.name}`"
                   class="node nozoom"
                   :class="{ nodeGrabbing: currentMove}"
                   @mousedown="dragStart($event, node)"
                   @mouseup="emitClick($event, node)">
                    <circle :cx="node.x" :cy="node.y"
                            :r="nodeRadius" :fill="node.color"
                            class="nozoom">
                    </circle>
                    <text :x="node.x" :y="node.y" class="nodeName nozoom">{{ node.name }}
                    </text>
                </g>
            </g>
        </g>


    </svg>
</template>

<script>
import {forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY} from 'd3-force';
import {zoom, zoomTransform} from 'd3-zoom';
import {select} from 'd3-selection';
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
            default: 8
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
            graph: JSON.parse(JSON.stringify(this.plotData)),
            dragged: false,
            zoomState: {x: 0, y: 0, k: 1},
        }
    },
    created() {
        this.simulation = forceSimulation(this.graph.nodes)
            /*eslint-disable-next-line*/
            .force('charge', forceManyBody().strength(d => this.forceStrength))
            .force('center', forceCenter(this.width / 2, this.height / 2))
            /*eslint-disable-next-line*/
            .force('collide', forceCollide().radius(d => 40))
            .force('link', forceLink(this.graph.links).id(d => d.name))
            .force('x', forceX())
            .force('y', forceY())
    },
    mounted() {
        let vm = this
        let svg = select("#svgContainer")
        svg.call(this.zoomFunction.on("zoom", () => vm.zoomState = zoomTransform(svg.node())))

    },
    computed: {
        nodes() {
            return this.graph.nodes.filter(node => typeof node.name !== 'object' && node.name !== null)
        },
        zoomFunction() {
            return zoom().filter(event => !event.target.classList.contains("nozoom"))
        },
        zoomTranslate() {
            return `translate(${this.zoomState.x}, ${this.zoomState.y})`
        },

    },
    methods: {
        dragStart(e, node) {
            this.currentMove = {x: e.screenX, y: e.screenY, node: node}

            this.dragged = false
        },
        drag(e) {
            if (this.currentMove) {
                let top = this.$refs.svgContainer.getBoundingClientRect().top
                let left = this.$refs.svgContainer.getBoundingClientRect().left

                this.currentMove.node.x = e.clientX - left - this.zoomState.x
                this.currentMove.node.y = e.clientY - top - this.zoomState.y

                this.currentMove.node.fx = e.clientX - left - this.zoomState.x
                this.currentMove.node.fy = e.clientY - top - this.zoomState.y

                this.dragged = true
            }
        },
        drop() {
            this.currentMove = null
            this.simulation.restart()
        },
        emitClick(evt, node) {
            if (this.dragged) {
                return
            } else {
                const new_node = Object.assign({}, node)
                new_node.clientX = evt.clientX
                new_node.clientY = evt.clientY
                this.$emit('click', new_node)
            }
        },
        addOrRemoveNodesAndLinks(new_nodes, old_nodes, new_links, old_links) {
            if (new_nodes.length > old_nodes.length) {
                let diff = new_nodes.filter(new_node => !old_nodes.some(old_node => old_node.name === new_node.name))
                this.graph.nodes.push(...diff)
            } else if (new_nodes.length < old_nodes.length) {
                let nodes_list = new_nodes.map(item => item.name)
                this.graph.nodes = this.graph.nodes.filter(node => nodes_list.includes(node.name))
            }

            if (new_links.length > old_links.length) {
                let diff = new_links.filter(new_link =>
                    !old_links.some(old_link =>
                        old_link.source === new_link.source && old_link.target === new_link.target))
                this.graph.links.push(...diff)
            } else if (new_links.length < old_links.length) {
                this.graph.links = this.graph.links.filter(link =>
                    new_links.some(new_link =>
                        new_link.source === link.source.name && new_link.target === link.target.name))
            }
        }
    },
    watch: {
        plotData: function (newVal, oldVal) {
            newVal = JSON.parse(JSON.stringify(newVal))
            this.simulation.stop()

            this.addOrRemoveNodesAndLinks(newVal.nodes, oldVal.nodes, newVal.links, oldVal.links)

            this.simulation.nodes(this.graph.nodes)
            this.simulation.force('link').links(this.graph.links)

            this.simulation.alpha(0.03).restart()
        }
    }
}

</script>


<style scoped>
circle {
    /*fill: #66b0ee;*/
}

line {
    stroke: #d9d9d9;
    stroke-width: 2;
}

.nodeGrabbing {
    cursor: grabbing;
}

.nodeName {
    text-anchor: middle;
    dominant-baseline: middle;
    font-size: 0.75rem;
    cursor: grab;
}
</style>
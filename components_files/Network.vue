<template>
    <div class="network_viz">

        <div class="controls" ref="controlsContainer">
            <h1 class="title is-5">Slack DM trends at MITRE</h1>
            <h2 class="title is-6">(Data available: 03/19/2020-{{ formatDate(endDate) }})</h2>
            <form class="inputsForm" onsubmit="return false">
                <fieldset>
                    <label for="startDate" class="label mb-0">Start date:</label>
                    <input id="startDate" type="date"
                           v-model="startDate" @change="updateDates()" required>
                    <label for="endDate" class="label mb-0">End date:</label>
                    <input id="endDate" type="date"
                           v-model="endDate" @change="updateDates()" required>
                </fieldset>

                <br>
                <fieldset>
                    <label for="messagesThreshold" class="label">
                        Enter minimum number of messages sent into input or use slider: {{ messagesThreshold }}
                    </label>
                    <div class="field has-addons">
                        <p class="control">
                            <input type="text" class="input is-small"
                                   v-model="messagesThreshold"
                                   @keyup.enter.prevent="generateGraphAndRestartForces()">
                        </p>
                        <p class="control">
                            <button type="button" class="button is-small"
                                    @click="generateGraphAndRestartForces()">
                                Submit
                            </button>
                        </p>
                    </div>

                    <input id="messagesThreshold" type="range"
                           min="0" :max="maxNumberOfMessages"
                           v-model="messagesThreshold" @change="generateGraphAndRestartForces()">
                </fieldset>
                <br>

                <fieldset>
                    <label class="label" for="divisionSelector">Select division (or click on node):</label>
                    <div class="select is-small">
                        <select id="divisionSelector" v-model="divisionSelector"
                                @change="generateGraphAndRestartForces()">
                            <option>All</option>
                            <option v-for="division in divisionDropdownOptions"
                                    :key="division">{{ division }}
                            </option>
                        </select>
                    </div>
                </fieldset>
                <br>

                <legend class="description">Hover over edges to see the number of messages sent, and
                    hover over nodes to highlight all other connected nodes.
                </legend>
            </form>
        </div>

        <div class="graphic" ref="graphicContainer">
            <div v-if="noChildNodesErrorMessage">
                <p>Division selected has no departments for the given date range and minimum
                    number of messages.
                </p>
                <button type="button" class="button is-small"
                        @click="divisionSelector = 'All', generateGraphAndRestartForces()">
                    Refresh
                </button>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg"
                 :width="width+'px'" :height="height+'px'"
                 v-if="requestFinished && !noChildNodesErrorMessage && bounds.minX"
                 @mousemove="drag($event)" @mouseup="drop()"
                 @dblclick="divisionSelector = 'All', generateGraphAndRestartForces()">
                <defs>
                    <marker id="arrow" viewBox="0 -5 10 10" refX="10" refY="0"
                            markerWidth="9" markerHeight="9" orient="auto" markerUnits="userSpaceOnUse">
                        <path d="M0,-5L10,0L0,5" class="arrowHead"></path>
                    </marker>
                    <marker id="selfLinkingArrow" viewBox="0 -5 10 10" refX="0" refY="1"
                            markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                        <path d="M0,-5L10,0L0,5" class="arrowHead"></path>
                    </marker>
                </defs>
                <g v-for="link in coords.links" :key="link.source_target">
                    <line :x1="link.x1"
                          :y1="link.y1"
                          :x2="link.x2"
                          :y2="link.y2"
                          :class="{ inactive: link.inactive }"
                          :stroke-width="1"
                          marker-end="url(#arrow)">
                    </line>
                    <line :x1="link.x1"
                          :y1="link.y1"
                          :x2="link.x2"
                          :y2="link.y2"
                          :class="{ inactive: link.inactive }"
                          :stroke-width="1.2 + link.weight/maxNumberOfMessages*1.6"
                          @mouseover="showTooltip($event, link.source_target, 'different')"
                          @mouseout="tooltipDiv.show = false">
                    </line>
                </g>

                <path v-for="(path, id) in coords.paths" :key="'p'+id"
                      :d="path.path"
                      class="selfLinkingNode"
                      :class="{ inactive: path.inactive }"
                      marker-end="url(#selfLinkingArrow)"
                      :stroke-width="1.1 + path.weight/maxNumberOfMessagesOrgs*2"
                      @mouseover="showTooltip($event, path.source_target, 'self')"
                      @mouseout="tooltipDiv.show = false">
                </path>

                <g v-for="(node, i) in graph.nodes" :key="node.name"
                   class="nodeAndLabel"
                   :class="{ inactive: node.inactive }"
                   @mouseover="getAllNodesEdgesConnectedToHoveredOverNode(node.name)"
                   @mouseout="getAllNodesEdgesConnectedToHoveredOverNode('')"
                   @mousedown="currentMove = {x: $event.screenX, y: $event.screenY, node: node}"
                   @click="divisionSelector = node.name, generateGraphAndRestartForces()">
                    <circle :cx="coords.nodes[i].x"
                            :cy="coords.nodes[i].y"
                            :r="node.radius">
                    </circle>
                    <text :x="coords.nodes[i].x" :y="coords.nodes[i].y">
                        {{ node.name}}
                    </text>
                </g>

            </svg>

            <spinning-loader v-if="!requestFinished"></spinning-loader>
            <div v-if="requestFailed"><p>Request failed! Please refresh page.</p></div>

        </div>
        <div class="tooltip" v-if="tooltipDiv.show"
             :style="`top: ${tooltipDiv.y}px; left: ${tooltipDiv.x}px`">
            <h1 class="tooltipHeader">Messages Sent</h1>
            <p v-for="message in tooltipDiv.messages" :key="message.source+message.target">
                From <strong>{{ message.source }}</strong> to
                <strong>{{ message.target }}</strong>:
                {{ message.weight }}
            </p>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import spinningLoader from "./spinningLoader";
    import {forceSimulation, force, forceManyBody, forceLink, forceX, forceY} from 'd3-force';
    import axios from 'axios';

    let baseUrl = process.env.VUE_APP_API_URL
        ? process.env.VUE_APP_API_URL
        : `http://${window.location.hostname}:5001`;

    export default {
        name: 'network_viz',
        components: {
            spinningLoader
        },
        data() {
            return {
                graph_orgs: null,
                graph_divisions: null,
                graph: {
                    nodes: [],
                    links: [],
                },

                maxNumberOfMessages: null,
                maxNumberOfMessagesOrgs: null,
                messagesThreshold: 500,
                maxSizeOfDivision: null,
                maxSizeOfDept: null,

                startDate: this.getStartDate(),
                endDate: this.getEndDate(),

                divisionSelector: "All",
                requestFinished: false,
                requestFailed: false,
                width: null,
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 50,
                padding: 50,
                radius: 17,
                simulation: null,
                currentMove: null,
                tooltipDiv: {
                    show: false,
                    messages: 0,
                    x: null,
                    y: null,
                }
            }
        },
        computed: {
            bounds() {
                return {
                    minX: Math.min(...this.graph.nodes.map(n => n.x)),
                    maxX: Math.max(...this.graph.nodes.map(n => n.x)),
                    minY: Math.min(...this.graph.nodes.map(n => n.y)),
                    maxY: Math.max(...this.graph.nodes.map(n => n.y)),
                }
            },
            coords() {
                /**
                 * Calculates nodes, edges, and self linking edges to be used in html to create graph
                 */
                let nodes = this.graph.nodes.map(node => {
                        return {
                            x: this.padding + (node.x - this.bounds.minX) * (this.width - 2 * this.padding)
                                / (this.bounds.maxX - this.bounds.minX),
                            y: this.padding + (node.y - this.bounds.minY) * (this.height - 2 * this.padding)
                                / (this.bounds.maxY - this.bounds.minY),
                            radius: node.radius
                        }
                    }
                )
                let links = this.graph.links.filter(link => link.source.name !== link.target.name)
                    .map(link => {
                            const x1 = nodes[link.source.index].x
                            const y1 = nodes[link.source.index].y
                            const x2 = nodes[link.target.index].x
                            const y2 = nodes[link.target.index].y
                            const target_radius = nodes[link.target.index].radius
                            const r = Math.hypot(x2 - x1, y2 - y1)
                            const offsetX = ((x2 - x1) * target_radius) / r
                            const offsetY = ((y2 - y1) * target_radius) / r
                            return {
                                x1: x1,
                                y1: y1,
                                x2: x2 - offsetX,
                                y2: y2 - offsetY,
                                source_target: link.source_target,
                                inactive: link.inactive,
                                weight: link.weight
                            }
                        }
                    )
                let selfConnectingLinks = this.graph.links.filter(item => item.source.name === item.target.name)
                    .map(link => {
                        let x1 = nodes[link.source.index].x
                        let y1 = nodes[link.source.index].y
                        let drx = 20
                        let dry = 20
                        let xRotation = 45
                        let largeArc = 1
                        let sweep = 0
                        return {
                            path: `M${x1},${y1}A${drx},${dry} ${xRotation},${largeArc},${sweep} ${x1 + this.radius},${y1 + this.radius}`,
                            weight: link.weight,
                            source_target: link.source_target,
                            inactive: link.inactive
                        }
                    })
                return {nodes: nodes, links: links, paths: selfConnectingLinks}
            },
            noChildNodesErrorMessage() {
                if (this.requestFinished) {
                    return this.graph.links.length < 2;
                }
            },
            divisionDropdownOptions() {
                if (this.divisionSelector === 'All') {
                    return this.graph.nodes.map(item => item.name)
                }
            }

        },
        mounted() {
            this.width = this.$refs.graphicContainer.clientWidth

            this.updateDates()
        },
        methods: {
            getStartDate() {
                let date = new Date()
                date.setDate(date.getDate() - 15)
                return date.toISOString().slice(0, 10)
            },
            getEndDate() {
                let date = new Date()
                date.setDate(date.getDate() - 1)
                return date.toISOString().slice(0, 10)
            },
            formatDate(date){
                let formattedDate = new Date(date)
                formattedDate.setDate(formattedDate.getDate() + 1)
                return formattedDate.toLocaleDateString()
            },
            updateDates() {
                /**
                 * Call api to get nodes/edges for divisions and depts between specified dates
                 * Create nodes and edges list for force initialization
                 * Start force simulation.
                 * This method is called every time the start/end date changes because all of the data is different
                 * and the force graph is re-initialized.
                 */
                this.requestFinished = false

                axios.get(baseUrl + '/slack_messages', {
                    params: {
                        startDate: this.startDate,
                        endDate: this.endDate
                    }
                }).then((res) => {
                    this.graph_divisions = res.data.divisions
                    this.graph_orgs = res.data.orgs

                    // calculate maximum number of messages to use for edge thickness
                    this.maxNumberOfMessages = Math.max(...this.graph_divisions.map(e => e.number_of_messages))
                    this.maxNumberOfMessagesOrgs = Math.max(...this.graph_orgs.map(e => e.number_of_messages))

                    //calculate maximum number of messages to use for node radius
                    this.maxSizeOfDivision = Math.max(...this.graph_divisions.map(e => e.target_size))
                    this.maxSizeOfDept = Math.max(...this.graph_orgs.map(e => e.target_size))

                    // Filter edges up front to reduce graph size initially
                    let graphData = this.graph_divisions.filter(item => item.number_of_messages > this.messagesThreshold)

                    this.createNodesLinksObjectsForDivisionsOrDepts(graphData, 'division')

                    // Initialize force simulation
                    this.simulation = forceSimulation(this.graph.nodes)
                        .force('charge', forceManyBody().strength(-400))
                        .force('link', forceLink(this.graph.links).id(d => d.name).strength(0.005))
                        .force('x', forceX(this.width / 2).strength(0.1))
                        .force('y', forceY(this.height / 2))

                    this.requestFinished = true
                })
                    .catch(error => {
                        this.requestFailed = true
                        console.log(error)
                    })
            },
            generateGraphAndRestartForces() {
                /**
                 * Determine if graph generated needs to be at division level or dept level.
                 * Filter out edges that are below the messaging threshold.
                 * Restart force simulation
                 */
                let graphData
                if (this.divisionSelector === 'All') {
                    /* create graph at division level */
                    graphData = this.graph_divisions.filter(item => item.number_of_messages > this.messagesThreshold)

                    this.createNodesLinksObjectsForDivisionsOrDepts(graphData, 'division')
                } else {
                    /* create graph at dept level */
                    graphData = this.graph_orgs.filter(item => item.number_of_messages > this.messagesThreshold)
                        .filter(item => item.division === this.divisionSelector)

                    this.createNodesLinksObjectsForDivisionsOrDepts(graphData, 'org_code')
                }

                this.simulation.nodes(this.graph.nodes)
                    .force('link', forceLink(this.graph.links).id(d => d.name).strength(0.005))
                    .alpha(1)
                    .restart()
            },
            findRadiusForOrg(name, arrayOfOrgs, level) {
                /**
                 * Look for radius in target nodes, and if it's not there look in source nodes
                 */
                let target_size = arrayOfOrgs.find(item => item[`target_${level}`] === name)
                if (target_size) {
                    return target_size['target_size']
                } else {
                    return arrayOfOrgs.find(item => item[`source_${level}`] === name)['source_size']
                }
            },
            createNodesLinksObjectsForDivisionsOrDepts(graphData, level) {
                /** creates nodes and links for graph based on level argument
                 * division is for divisions, org_code is for depts
                 * this matches the data pulled from the DB
                 */
                let nodes = graphData.map(item => item[`target_${level}`])
                    .concat(graphData.map(item => item[`source_${level}`]))

                this.graph.nodes = Array.from(new Set(nodes)).map(item => ({
                    name: item,
                    x: null,
                    y: null,
                    inactive: false,
                    radius: 16 + 10 * this.findRadiusForOrg(item, graphData, level) / this.maxSizeOfDivision,
                })).sort((a, b) => a.name.localeCompare(b.name))

                this.graph.links = graphData.map(item => ({
                    'source': item[`source_${level}`],
                    'target': item[`target_${level}`],
                    'weight': item.number_of_messages,
                    'source_target': `${item[`source_${level}`]}_${item[`target_${level}`]}`,
                    'inactive': false
                }))
            },
            drag(e) {
                /* not currently used but allows nodes to be dragged */
                if (this.currentMove) {
                    this.currentMove.node.fx = this.currentMove.node.x - (this.currentMove.x - e.screenX) *
                        (this.bounds.maxX - this.bounds.minX) / (this.width - 2 * this.padding)
                    this.currentMove.node.fy = this.currentMove.node.y - (this.currentMove.y - e.screenY) *
                        (this.bounds.maxY - this.bounds.minY) / (this.height - 2 * this.padding)
                    this.currentMove.x = e.screenX
                    this.currentMove.y = e.screenY
                }
            },
            drop(e) {
                /* not currently used but allows nodes to be dropped after drag */
                if (this.currentMove) {
                    delete this.currentMove.node.fx
                    delete this.currentMove.node.fy
                }
                this.currentMove = null
                this.simulation.alpha(1)
                this.simulation.restart()
            },
            showTooltip(e, source_target, typeOfConnection) {
                let st = source_target.split('_')

                let links = this.graph.links.filter(link => st.includes(link.source.name) && st.includes(link.target.name))

                // If source and target are different, filter out self connected links.
                // This avoids including self connected links in tooltip
                if (typeOfConnection === 'different') {
                    links = links.filter(link => link.source.name !== link.target.name)
                }

                this.tooltipDiv.x = e.clientX
                this.tooltipDiv.y = e.clientY + 20
                this.tooltipDiv.messages = links.map(link => ({
                    source: link.source.name,
                    target: link.target.name,
                    weight: link.weight
                }))
                this.tooltipDiv.show = true
            },
            checkIfSourceOrTarget(link, name) {
                /**
                 * Helper function that splits the source_target property of links and
                 * returns a string with a node name
                 */

                let source_target = link.source_target.split('_')
                if (source_target[0] === name) {
                    return source_target[0]
                } else if (source_target[1] === name) {
                    return source_target[1]
                }
            },
            getAllNodesEdgesConnectedToHoveredOverNode(selectedNodeName) {
                /**
                 * Determine which nodes are connected to the nodes that the mouse
                 * is currently hovered over.
                 */

                if (selectedNodeName) {
                    // Find all links connected to node and set others to inactive
                    this.graph.links = this.graph.links.map(link =>
                        link.source_target.includes(selectedNodeName)
                            ? link
                            : {...link, inactive: true}
                    )

                    // Get all nodes that are connected to the node that's hovered over by checking link
                    // property source_target
                    let connectedNodes = this.graph.links.filter(link => this.checkIfSourceOrTarget(link, selectedNodeName))
                        .map(item => item.source_target.split('_')).flat()
                    connectedNodes = Array.from(new Set(connectedNodes))

                    // Find all nodes connected to hovered over node and set all other nodes to inactive
                    this.graph.nodes = this.graph.nodes.map(node =>
                        connectedNodes.includes(node.name)
                            ? node
                            : {...node, inactive: true}
                    )
                } else {
                    // Revert all nodes/links back to active
                    this.graph.links = this.graph.links.map(link => ({...link, inactive: false}))
                    this.graph.nodes = this.graph.nodes.map(node => ({...node, inactive: false}))
                }

            }
        }
    }
</script>

<style scoped>
    .network_viz {
        display: flex;
        height: 100%;
    }

    .controls {
        width: 18%;
        border-right: grey solid 1px;
        padding: 17px;
        background-color: #e6e6e6;
    }

    .inputsForm {
        text-align: left;
    }

    .graphic {
        width: 82%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    label {
        font-size: 0.8rem;
    }

    .label {
        margin-bottom: 0;
    }

    .description {
        margin-top: 15px;
        padding: 0 5px;
        font-size: 0.8rem;
    }

    input[type=range] {
        width: 95%;
    }

    line {
        stroke: #999;
        /*stroke-width: 1.1;*/
        opacity: 1;
        transition: opacity ease-out 1s;
    }

    circle {
        fill: #8fc8de;
        stroke: white;
        stroke-width: 1;
        transition: opacity ease-out 1s;
    }

    text {
        text-anchor: middle;
        dominant-baseline: central;
        font-size: 0.80rem;
        fill: #232121;
    }

    .arrowHead {
        fill: #999;
        stroke: none;
        transition: opacity ease-out 1s;
    }

    .selfLinkingNode {
        fill: none;
        stroke: #999;
        /*stroke-width: 1.1;*/
        transition: opacity ease-out 1s;
    }

    .inactive {
        opacity: 0.2;
        transition: opacity ease-in-out 0.25s;
    }

    .nodeAndLabel {
        cursor: pointer;
        transition: opacity ease-out 0.5s;
    }

    .tooltip {
        border: solid 1px black;
        padding: 2px 10px;
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
        background-color: white;
        font-size: 0.85rem;
        position: absolute;
    }

    .tooltipHeader {
        font-size: 1.0rem;
        font-weight: bold;
    }


</style>

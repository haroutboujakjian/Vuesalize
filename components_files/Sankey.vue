<!-- (C) 2020 The MITRE Corporation. All Rights Reserved. -->
<template>
    <div class="container">
        <div id="controls">
            <label for="TRLslider" class="label">
                Technology Readiness Level: {{ TRLrange[0] + ' - ' + TRLrange[1] }}
            </label>
            <vue-slider id="TRLslider" v-model="TRLrange"
                        :min="1" :max="9" :interval="1"
                        :enable-cross="false" :absord="true">
            </vue-slider>
            <button type="button" class="button is-small"
                    @click="resetValues()">Reset
            </button>
        </div>
        <div id="visualization" ref="visContainer">
            <div v-if="loaded_data_ready">
                <svg :width="width" :height="height">

                    <transition-group name="plot-fade" tag="g">
                        <g v-for="node in sankeyData.nodes" :key="node.name"
                           class="nodeGroup"
                           :class="{ inactive: !node.active}"
                           @mouseover="showTooltipAndHighlightConnections($event, node.name)"
                           @mouseout="tooltipDiv.show = false, selectedNode = null">
                            <rect :x="node.x0"
                                  :y="node.y0"
                                  :height="node.y1 - node.y0"
                                  :width="node.x1 - node.x0"
                                  :fill="uniqueActivities.includes(node.name) ? colorScale(node.name) : '#89b1d0'"
                                  class="node">
                            </rect>
                            <text :x="node.x0 > width/2 ? node.x0 + node_width + 2 : node.x0 - 4"
                                  :y="(node.y0 + node.y1)/2 + 3"
                                  :text-anchor="node.x0 > width/2 ? 'start' : 'end'"
                                  class="nodeName fontAwesomeIcon">
                                {{ node.name }}
                            </text>
                        </g>
                    </transition-group>
                    <transition-group name="plot-fade" tag="g">
                        <g v-for="link in sankeyData.links"
                           :key="link.source.name+link.target.name"
                           class="linkGroup">
                            <path class="link"
                                  :class="{ inactive: !link.active}"
                                  :d="sankeyLink(link)"
                                  :stroke="uniqueActivities.includes(link.target.name) ? colorScale(link.target.name) : '#000'"
                                  :stroke-width="link.width">
                            </path>
                        </g>
                    </transition-group>

                </svg>
            </div>

        </div>
        <div class="tooltip"
             :class="{ activeTooltip: tooltipDiv.show }"
             :style="`top: ${tooltipDiv.y}px; left: ${tooltipDiv.x}px`">
            <p>{{ tooltipDiv.message }}</p>
        </div>
    </div>
</template>

<script>

/*eslint-disable */
import {sankey as Sankey, sankeyLinkHorizontal, sankeyRight} from 'd3-sankey'
import {scaleOrdinal} from 'd3-scale'
import {read, utils} from 'xlsx/xlsx.mini'
import axios from 'axios'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
    name: 'SankeyVisualization',
    components: {
        VueSlider
    },
    data() {
        return {
            width: null,
            height: null,
            margin: {
                top: 70,
                bottom: 70,
                left: 180,
                right: 160
            },
            node_width: 20,

            innovation_data: "",
            loaded_data_ready: false,
            TRLvalue: 0,

            TRLrange: [1, 9],
            colors: ['#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#156894'],
            selectedNode: null,

            tooltipDiv: {
                show: false,
                messages: 0,
                x: null,
                y: null,
            },
            activityDescriptions: {
                "Gov Contracting Authority": "An organization with government contracting authority can execute contract awards or agreements for government projects. These organizations have warranted Contracting Officers that are authorized to execute awards and agreements on behalf of the government.",
                "Funding Opportunity": "Funding opportunities are offered by organizations that seek to invest in and enhance the chances of success of entities (often start-ups or small businesses) pursuing advancements in technology. These are not government contracts or agreements.",
                "Connector": "The objective of connector organizations is to build networks and create relationships between government organizations, industry, private equity firms, and academia to facilitate partnerships to solve challenging problems by generating new solutions.",
                "Incubator": "Incubators focus on start-up and entrepreneurial entities with innovative ideas. They may provide seed funding and a collaborative physical environment to grow ideas, brand identification, and business plans. Not-for-profit and government or university operated incubators seek to enhance the economy and/or advance the state of the art of the US industrial base for government stakeholders.",
                "Challenge": "A challenge can be a single or recurring contest or competition aimed at solving problems where emerging technologies have the potential to provide non-traditional solutions, or to expand the pool of participants to address critical issues. Challenges may offer cash prizes or may be part of a broader Challenge-Based Acquisition (ChBA) strategy that may result in a government contract.",
                "Accelerator": "Accelerators offer competitive and structured programs focused on scaling the growth of an existing company. Accelerators typically provide some amount of seed money and a network of mentors. Programs are typically a few months in duration culminating in an opportunity to pitch to investors at the conclusion of the program."
            }
        }
    },
    mounted() {
        this.width = this.$refs.visContainer.clientWidth
        this.height = this.$refs.visContainer.clientHeight - this.margin.top - this.margin.bottom
    },
    created() {
        // try to ask wordpress for the latest data.xlsx file
        axios.get('?get-visualization-data-path=true', {baseURL: window.location.href})
            .then((response) => {
                // got it! Now try to load it
                axios.get(response.data, {
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let data = new Uint8Array(response.data)
                    let workbook = read(data, {type: 'array'})
                    this.innovation_data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
                    this.loaded_data_ready = true
                }).catch((error) => {
                    // if the first fetch fails, assume we're not in a wordpress environment
                    axios.get('data.xlsx', {
                        baseURL: window.location.origin,
                        responseType: 'arraybuffer'
                    }).then((response) => {
                        let data = new Uint8Array(response.data)
                        let workbook = read(data, {type: 'array'})
                        this.innovation_data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
                        this.loaded_data_ready = true
                    }).catch((error) => {
                        console.log(error)
                    })
                })
            })
            .catch((error) => console.log(error))
    },
    computed: {
        colorScale() {
            return scaleOrdinal().range(this.colors)
        },
        links() {
            let filteredData = this.innovation_data
            if (this.TRLrange) {
                filteredData = this.innovation_data.filter(item => this.checkTRL(item.TRL))
            }
            let linksData = filteredData.map(item => [
                    {
                        source: item.Org,
                        target: item['Primary Activity'],
                        value: 3,
                        active: this.checkConnectionsForLink(item.Org, item['Primary Activity'])
                    },
                    {
                        source: item.Org,
                        target: item['Secondary Activity'],
                        value: 2,
                        active: this.checkConnectionsForLink(item.Org, item['Secondary Activity'])
                    },
                    {
                        source: item.Org,
                        target: item['Tertiary Activity'],
                        value: 1,
                        active: this.checkConnectionsForLink(item.Org, item['Tertiary Activity'])
                    }
                ]
            ).flat().filter(item => item.source && item.target)

            return linksData
        },
        nodes() {
            let filteredData = this.innovation_data
            if (this.TRLrange) {
                filteredData = this.innovation_data.filter(item => this.checkTRL(item.TRL))
            }

            let activity = filteredData
                .map(item => [item['Primary Activity'], item['Secondary Activity'], item['Org']])
                .flat()

            return Array.from(new Set(activity)).filter(item => item).map(item => (
                {
                    name: item,
                    active: this.checkConnectionsForNode(item)
                }
            ))
        },
        uniqueActivities() {
            let orgs = this.innovation_data.map(item => [item['Primary Activity'], item['Secondary Activity']]).flat()
            return Array.from(new Set(orgs)).filter(item => item)
        },
        sankeyData() {
            const sankey = Sankey()
                .nodeId(d => d.name)
                .nodeWidth(this.node_width)
                .nodeAlign(sankeyRight)
                .nodePadding(10)
                .nodeSort((a, b) => a.name[0] - b.name[0])
                .extent([[this.margin.left, 15], [this.width - this.margin.right, this.height - this.margin.bottom]])

            return sankey({
                nodes: this.nodes.map(d => Object.assign({}, d)),
                links: this.links.map(d => Object.assign({}, d))
            })
        },
        sankeyLink() {
            return sankeyLinkHorizontal()
        }
    },
    methods: {
        resetValues() {
            this.TRLrange = [1, 9]
        },
        checkConnectionsForLink(org, activity) {
            if (this.selectedNode) {
                if (this.selectedNode === org || this.selectedNode === activity) {
                    return true
                }
            } else return !this.selectedNode;
        },
        checkConnectionsForNode(name) {
            if (this.selectedNode) {
                let activeNodes = this.links.filter(item => item.active)
                let activeSourceTargetList = activeNodes.map(item => [item.source, item.target]).flat()
                return activeSourceTargetList.includes(name);

            } else if (this.selectedNode) {
                return false
            } else {
                return true
            }
        },
        checkTRL(TRL) {
            let minMax = TRL.split('-')
            let TRLmin = parseInt(minMax[0])
            let TRLmax = parseInt(minMax[1])
            return (TRLmin >= this.TRLrange[0] && TRLmin <= this.TRLrange[1]) || (TRLmax >= this.TRLrange[0] && TRLmax <= this.TRLrange[1])
        },
        showTooltipAndHighlightConnections(e, name) {
            this.tooltipDiv.x = e.clientX - 190
            this.tooltipDiv.y = e.clientY + 20
            if (this.activityDescriptions[name]) {
                this.tooltipDiv.message = this.activityDescriptions[name]
            } else {
                this.tooltipDiv.message = this.innovation_data.find(item => item.Org === name)['Short Description']
            }

            this.selectedNode = name
            this.tooltipDiv.show = true
        },

    }
}
</script>

<style scoped>
.container {
    display: flex;
}

#controls {
    width: 15%;
    height: 100vh;
    padding-top: 5%;
}

.button {
    margin: 5px 0;
}

#visualization {
    width: 85%;
    height: 100vh;
    display: flex;
    align-items: center;
}

.node {
    fill-opacity: 0.9;
}

.nodeName {
    font-size: 0.63rem;
}

.nodeGroup {
    transition: all 1s;
    cursor: pointer;
}

.link {
    fill: none;
    stroke-opacity: 0.5;
    transition: all 1s;
}


.inactive {
    opacity: 0.25;
}

.linkGroup {
    mix-blend-mode: multiply;
    transition: all 1s;
}


.tooltip {
    border: solid 1px black;
    padding: 2px 10px;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    width: 200px;
    background-color: white;
    font-size: 0.65rem;
    position: absolute;
    opacity: 0;
}

.activeTooltip {
    opacity: 1;
    transition: opacity 1s;
}

.tooltipHeader {
    font-size: 1.0rem;
    font-weight: bold;
}

.plot-fade-enter-active {
    position: absolute;
    transition: opacity 0.6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transition-delay: 0.3s
}

.plot-fade-leave-active {
    transition: opacity 0.4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.plot-fade-enter, .plot-fade-leave-to {
    opacity: 0;
}

.plot-fade-move {
    transition-delay: 0.5s;
    transition: transform 1s;
}


</style>

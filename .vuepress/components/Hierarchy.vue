<template>
    <div class="hierarchyContainer">
        <h1>IRS Cause Code Hierarchy Diagram</h1>

        <label for="file-upload" class="custom-file-upload">
            Load Excel File
        </label>
        <input id="file-upload" type="file" @change="uploadFile"/>

        <svg v-if="rawData && nodes"
             :width="width"
             :height="height">
            <g :transform="`translate(${margin.left}, ${margin.top})`">

                <transition-group name="fade" tag="g">
                    <g v-for="(link, lid) in links"
                       :key="'l'+lid">
                        <path :d="link">
                        </path>
                    </g>
                </transition-group>

                <transition-group name="fade" tag="g">
                    <g v-for="node in nodes"
                       :key="node.key_id"
                       :transform="`translate(${node.y}, ${node.x})`"
                       class="node"
                       @click="showDescendants(node)">
                        <circle r="3"
                                :fill="node.children ? '#555' : '#f1f1f1'"
                                stroke="#555">
                        </circle>
                        <text :y="node.children ? -5 : 3"
                              :x="node.children ? 2 : 6"
                              :text-anchor="node.children ? 'middle' : 'start'">
                            {{ node.data['Cause Code'] ? limitText(node.data['Cause Code']) : node.data.key }}
                            <title>
                                {{ node.data['Cause Code'] ? node.data['Cause Code'] : node.data.key }}
                            </title>
                        </text>
                    </g>
                </transition-group>

            </g>
        </svg>

    </div>
</template>

<script>
/*eslint-disable*/
import {read, utils} from 'xlsx/xlsx.mini';
import {hierarchy, tree} from 'd3-hierarchy';
import {nest} from 'd3-collection';
import {linkHorizontal} from 'd3-shape';

export default {
    name: "Hierarchy",
    data() {
        return {
            rawData: null,
            margin: {
                top: 0,
                bottom: 20,
                left: 30,
                right: 220,
            },
            height: 2500,
            width: 1200,
            selectedNode: null,
        }
    },
    computed: {
        createHierarchy() {
            let data = Object.assign({}, this.rawData)

            data = this.rawData.map(item => {
                if (!item.subcategoryActive) {
                    delete item.SubCategory
                } else if (!item.areaActive) {
                    delete item.Area
                } else if (!item.causeActive) {
                    delete item['Cause Code']
                }
                return item
            })

            let causeData = nest()
                .key(d => d['Category'])
                .key(d => d['Subcategory'])
                .key(d => d['Area'])
                .entries(data)[0]

            let hierCause = hierarchy(causeData, d => d.values)

            let treemap = tree().size([
                this.height - this.margin.bottom - this.margin.top,
                this.width - this.margin.left - this.margin.right
            ])

            return treemap(hierCause)

        },
        nodes() {
            return this.createHierarchy.descendants()
                .map(item => ({
                    ...item,
                    key_id: this.createUniqueNameID(item)
                }))
        },
        links() {
            return this.createHierarchy.links()
                .map(item => linkHorizontal().x(d => d.y).y(d => d.x)(item))
        }
    },
    methods: {
        createUniqueNameID(node) {
            if (node.parent && node.data['Cause Code']) {
                return `${node.parent.parent.data.key}${node.parent.data.key}${node.data['Cause Code']}`
            } else if (node.parent) {
                return `${node.parent.data.key}${node.data.key}`
            } else {
                return `${node.data.key}`
            }
        },
        showDescendants(node) {
            this.selectedNode = node
            if (node.parent === null) {
                return
            } else if (node.children) {
                this.rawData = this.rawData.map(item => this.checkName(item))
            }
        },
        checkName(item) {
            let names = [item['Area'], item['Category'], item['Cause Code'], item['Subcategory']]
            if (this.selectedNode.data.key) {
                return names.includes(this.selectedNode.data.key)
                    ? {...item, active: !item.active}
                    : {...item}
            }
        },
        limitText(text) {
            if (text.length > 35) {
                return `${text.substring(0, 35)}...`
            } else {
                return text
            }
        },
        uploadFile(event) {
            let vm = this

            let input = event.target
            const reader = new FileReader()

            reader.onload = evt => {
                let fileData = reader.result
                let workbook = read(fileData, {type: 'binary'})
                vm.rawData = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
                vm.rawData = vm.rawData.map(item => ({
                    ...item,
                    subcategoryActive: true,
                    areaActive: true,
                    causeActive: true,
                    active: true
                }))
            }
            reader.readAsBinaryString(input.files[0])
            reader.onerror = evt => {
                console.error(evt);
            }
        }
    },

}
</script>

<style scoped>
.hierarchyContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.node text {
    font-size: 0.75rem;
    fill: #292929;
}

path {
    fill: none;
    stroke: #555;
    stroke-opacity: 0.5;
}

.node {
    cursor: pointer;
}

input[type="file"] {
    display: none;
}

.custom-file-upload:hover {
    background-color: #efefef;
}

.custom-file-upload {
    border: 1px solid #c6c4c4;
    border-radius: 3px;
    display: inline-block;
    padding: 3px 7px;
    margin: 0 3px;
    cursor: pointer;
    color: #303030;
    font-weight: bold;
    width: 130px;
}

.fade-enter-active {
    position: absolute;
    transition: opacity 0.6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transition-delay: 0.3s;
}

.fade-list-active {
    transition: opacity 0.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

/*.fade-move {*/
/*    transition-delay: 0.5s;*/
/*    transition: transform 0.5s;*/
/*}*/

</style>
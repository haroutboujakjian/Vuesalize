<template>
    <svg :width="width" :height="height">

        <g class="lines" :transform="translate">
            <g v-for="(path, id) in pathlines" :key="id"
               class="line"
               :class="{incomingLine: path.Incoming, outgoingLine: path.Outgoing}">
                <path :d="path.path" :class="{pathOff: hover}"></path>
            </g>
        </g>

        <g class="labels" :transform="translate">
            <g v-for="(label, lid) in labels" :key="lid"
               class="label"
               :class="{incomingLabel: label.incoming, outgoingLabel: label.outgoing}"
               :style="`fill: ${label.color}`" :transform="label.gtransform"
               @click="clickName(label.name, label.type)">
                <text :x="label.x" dy="0.31em"
                      :transform="label.texttransform" :text-anchor="label.textAnchor">
                    {{ label.name }}
                    <title>{{label.name}}</title>
                </text>
            </g>
        </g>

    </svg>

</template>

<script>
import {lineRadial, curveBundle} from 'd3-shape';
import {cluster, hierarchy} from 'd3-hierarchy';
import {ascending} from 'd3-array';

export default {
    name: "HierarchicalEdgeBundling",
    props: {
        plotdata: {type: Array, required: true},
        width: Number,
        height: Number,
        radialMargin: Number,
        clickedNode: Object
    },
    data() {
        return {
            hover: false,
            highlightedNode: '',
        }
    },
    computed: {
        translate() {
            return `translate(${this.width / 2}, ${this.height / 2})`
        },
        radius() {
            return this.height / 2
        },
        rootData() {
            let plotdataClone = JSON.parse(JSON.stringify(this.plotdata))
            return this.rootCalc(plotdataClone)
        },
        lines() {
            let incomingLines = [], outgoingLines = []

            let activeLines = []
            let pairs = this.rootData.leaves().flatMap(leaf => leaf.outgoing)
            for (let i = 0; i < pairs.length; i++) {
                let line = {}
                let pair = pairs[i]
                if (pair[0].data.name === this.highlightedNode) {
                    line.path = this.line(pair[0].path(pair[1]))
                    line.Incoming = false
                    line.Outgoing = true
                    outgoingLines.push(pair[1].data.name)
                } else if (pair[1].data.name === this.highlightedNode) {
                    line.path = this.line(pair[0].path(pair[1]))
                    line.Incoming = true
                    line.Outgoing = false
                    incomingLines.push(pair[0].data.name)
                } else {
                    line.path = this.line(pair[0].path(pair[1]))
                    line.Incoming = false
                    line.Outgoing = false
                }
                activeLines.push(line)
            }
            return {activeLines, incomingLines, outgoingLines}
        },
        pathlines() {
            let newLines = this.lines.activeLines
            return newLines.sort(a => (a.Incoming === true || a.Outgoing === true ? 1 : -1))
        },
        labels() {
            return this.rootData.leaves().map(d => ({
                name: d.data.name,
                x: d.x < Math.PI ? 6 : -6,
                gtransform: `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`,
                textAnchor: d.x < Math.PI ? "start" : "end",
                texttransform: d.x >= Math.PI ? "rotate(180)" : null,
                incoming: this.lines.incomingLines.includes(d.data.name),
                outgoing: this.lines.outgoingLines.includes(d.data.name),
                color: d.data.color,
                type: d.data.type
            }))
        }
    },
    watch: {
        clickedNode: function () {
            this.clickName(this.clickedNode.name, this.clickedNode.type)
        }
    },
    methods: {
        rootCalc(value) {
            return this.tree(this.bilink(hierarchy(this.hierarchy(value, "|"))
                .sort((a, b) => ascending(a.height, b.height) || ascending(a.data.name, b.data.name))));
        },

        hierarchy: function (data, delimiter = "|") {
            let root;
            const map = new Map;
            data.forEach(function find(data) {
                const {name} = data;
                if (map.has(name)) return map.get(name);
                const i = name.lastIndexOf(delimiter);
                map.set(name, data);
                if (i >= 0) {
                    find({name: name.substring(0, i), children: []}).children.push(data);
                    data.name = name.substring(i + 1);
                } else {
                    root = data;
                }
                return data;
            });
            return root;
        },

        bilink: function (root) {
            const map = new Map(root.leaves().map(d => [this.id(d), d]));
            for (const d of root.leaves()) {
                d.incoming = []
                d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
            }
            for (const d of root.leaves()) {
                for (const o of d.outgoing) {
                    o[1].incoming.push(o);
                }
            }
            return root;
        },

        id: function (node) {
            return `${node.parent ? this.id(node.parent) + "|" : ""}${node.data.name}`;
        },

        tree: function (value) {
            return cluster().size([2 * Math.PI, this.radius - this.radialMargin])(value)
        },

        line: function (value) {
            return lineRadial().curve(curveBundle.beta(0.85)).radius(d => d.y).angle(d => d.x)(value)
        },
        clickName(name, objectType) {
            this.$emit('click', {name: name, type: objectType})
            if (this.highlightedNode === name) {
                this.highlightedNode = ''
                this.hover = false
            } else {
                this.highlightedNode = name
                this.hover = true
            }
        }

    }


}
</script>

<style scoped>

path {
    mix-blend-mode: multiply;
}

.pathOff {
    mix-blend-mode: normal;
}

.lines {
    mix-blend-mode: multiply;
    stroke: #b8b8b8;
    fill: none;
    stroke-width: 0.04rem
}

.label {
    font-family: sans-serif;
    font-size: 0.72rem;
}

.label:hover {
    font-weight: bold;
    cursor: pointer;
}

.incomingLine {
    stroke: #0578e7;
}

.outgoingLine {
    stroke: #0578e7;
}

.incomingLabel {
    font-weight: bold;
    font-size: 0.85rem;
}

.outgoingLabel {
    font-weight: bold;
    font-size: 0.85rem;
}
</style>

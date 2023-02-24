<template>
    <g>
        <g v-for="(line, i) in annotation_lines" :key="`l${i}}`">
            <line
                :x1="line.x1"
                :x2="line.x2"
                :y1="line.y1"
                :y2="line.y2"
                class="annotation"
                :stroke="line.color"
                :stroke-dasharray="line.dash">
            </line>
            <text
                :x="line.x2"
                :y="line.y1"
                :dx="line.labeldx"
                :dy="line.labeldy"
                :text-anchor="line.labelAnchor"
                :fill="line.color"
                class="annotation_label">
                {{ line.label }}
            </text>
        </g>
    </g>
</template>

<script>
export default {
    name: "Annotations",
    props: {
        annotations: {
            type: Array,
            default: function () {
                return []
            },
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        margin: {
            type: Object,
            required: true,
        },
        linearScale: {
            type: Function,
        },
        barScale: {
            type: Function,
        },
        direction: {
            type: String,
            default: "vertical",
        },
    },
    computed: {
        annotation_lines() {
            const yScale =
                this.direction === "vertical" ? this.linearScale : this.barScale
            const xScale =
                this.direction === "vertical" ? this.barScale : this.linearScale

            return this.annotations
                .filter((annotation) => annotation.type === "line")
                .map((item) => ({
                    x1:
                        item.axis === "y"
                            ? this.margin.left
                            : xScale(item.value),
                    x2:
                        item.axis === "y"
                            ? this.width - this.margin.right
                            : xScale(item.value),
                    y1:
                        item.axis === "y"
                            ? yScale(item.value)
                            : this.margin.top,
                    y2:
                        item.axis === "y"
                            ? yScale(item.value)
                            : this.height - this.margin.bottom,
                    color: item.color ? item.color : "black",
                    dash: item.dash ? "5 5" : "",
                    label: item.label,
                    labelAnchor: item.labelAnchor ? item.labelAnchor : "middle",
                    labeldx: item.labeldx,
                    labeldy: item.labeldy,
                }))
        },
    },
}
</script>

<style scoped>
.annotation {
    stroke-width: 1;
}

.annotation_label {
    font-size: 0.8rem;
}
</style>

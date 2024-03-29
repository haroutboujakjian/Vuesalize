<template>
    <g class="annotations">
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
        <g v-for="(rect, i) in annotation_rects" :key="`r${i}`">
            <rect
                :x="rect.center[0] - rect.width / 2"
                :y="rect.center[1] - rect.height / 2"
                :width="rect.width"
                :height="rect.height"
                class="annotation"
                fill="transparent"
                :stroke="rect.color"
                :stroke-dasharray="rect.dash"></rect>
        </g>
        <g v-for="(circle, i) in annotation_circles" :key="`r${i}`">
            <circle
                :cx="circle.center[0]"
                :cy="circle.center[1]"
                :r="circle.radius"
                class="annotation"
                fill="transparent"
                :stroke="circle.color"
                :stroke-dasharray="circle.dash"></circle>
            <text
                :x="circle.center[0]"
                :y="circle.center[1]"
                :dx="circle.labeldx"
                :dy="circle.labeldy"
                :text-anchor="circle.labelAnchor"
                alignment-baseline="middle"
                :fill="circle.color"
                class="annotation_label">
                {{ circle.label }}
            </text>
        </g>
        <g v-for="(rect, i) in annotation_vranges" class="range" :key="`vr${i}`">
            <rect
                :x="rect.xy[0]"
                :y="rect.xy[1]"
                :width="rect.width"
                :height="rect.height"
                class="annotation"
                :fill="rect.color"
                :stroke="rect.color"
                :style="`fill-opacity: ${rect.opacity}`"></rect>
        </g>
        <g v-for="(rect, i) in annotation_hranges" class="range" :key="`hr${i}`">
            <rect
                :x="rect.xy[0]"
                :y="rect.xy[1]"
                :width="rect.width"
                :height="rect.height"
                class="annotation"
                :fill="rect.color"
                :stroke="rect.color"
                :style="`fill-opacity: ${rect.opacity}`"></rect>
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
        xScale() {
            if (this.linearScale) {
                return this.direction === "vertical"
                    ? this.barScale
                    : this.linearScale
            } else {
                return null
            }
        },
        yScale() {
            if (this.linearScale) {
                return this.direction === "vertical"
                    ? this.linearScale
                    : this.barScale
            } else {
                return null
            }
        },
        annotation_lines() {
            return this.annotations
                .filter((annotation) => annotation.type === "line")
                .map((item) => ({
                    x1:
                        item.axis === "y"
                            ? this.margin.left
                            : this.xScale(item.value),
                    x2:
                        item.axis === "y"
                            ? this.width - this.margin.right
                            : this.xScale(item.value),
                    y1:
                        item.axis === "y"
                            ? this.yScale(item.value)
                            : this.margin.top,
                    y2:
                        item.axis === "y"
                            ? this.yScale(item.value)
                            : this.height - this.margin.bottom,
                    color: item.color ? item.color : "black",
                    dash: item.dash ? "5 5" : "",
                    label: item.label,
                    labelAnchor: item.labelAnchor ? item.labelAnchor : "middle",
                    labeldx: item.labeldx,
                    labeldy: item.labeldy,
                }))
        },
        annotation_rects() {
            return this.annotations
                .filter((annotation) => annotation.type === "rect")
                .map((item) => {
                    const center = [
                        this.xScale(item.center[0]),
                        this.yScale(item.center[1]),
                    ]

                    return {
                        width: item.useScale
                            ? this.scaledWidth(item.width, item.center)
                            : item.width,
                        height: item.useScale
                            ? this.scaledHeight(item.height, item.center)
                            : item.height,
                        center: this.xScale ? center : item.center,
                        color: item.color ? item.color : "black",
                        dash: item.dash ? "5 5" : "",
                    }
                })
        },
        annotation_circles() {
            return this.annotations
                .filter((annotation) => annotation.type === "circle")
                .map((item) => {
                    const center = [
                        this.xScale(item.center[0]),
                        this.yScale(item.center[1]),
                    ]

                    return {
                        center: this.xScale ? center : item.center,
                        radius: item.radius,
                        color: item.color ? item.color : "black",
                        dash: item.dash ? "5 5" : "",
                        label: item.label,
                        labelAnchor: item.labelAnchor
                            ? item.labelAnchor
                            : "middle",
                        labeldx: item.labeldx,
                        labeldy: item.labeldy,
                    }
                })
        },
        annotation_vranges() {
            return this.annotations
                .filter(annotation => annotation.type === "vertical_range")
                .map(item => {
                    let xy = [this.xScale(item.start), this.margin.top]
                    let width = this.xScale(item.end) - this.xScale(item.start)
                    let height = this.height - this.margin.bottom - this.margin.top
                    return {
                        xy, width, height,
                        color: item.color,
                        opacity: item.opacity
                    }
                })
        },
        annotation_hranges() {
            return this.annotations
                .filter(annotation => annotation.type === "horizontal_range")
                .map(item => {
                    let xy = [this.margin.left, this.yScale(item.start)]
                    let width = this.margin.right - this.margin.left
                    let height = this.yScale(item.end) - this.yScale(item.start)
                    return {
                        xy, width, height,
                        color: item.color,
                        opacity: item.opacity
                    }
                })
        },
    },
    methods: {
        scaledWidth(width, center) {
            const halfWidth = width / 2
            const x0 = this.xScale(center[0] - halfWidth)
            const x1 = this.xScale(center[0] + halfWidth)
            return x1 - x0
        },
        scaledHeight(height, center) {
            const halfHeight = height / 2
            const y0 = this.yScale(center[1] - halfHeight)
            const y1 = this.yScale(center[1] + halfHeight)
            return -(y1 - y0)
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

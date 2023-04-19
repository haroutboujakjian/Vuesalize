<template>
    <svg
        :width="width"
        :height="height"
        :viewBox="`0 0 ${this.bins[0]} ${this.bins[1]}`"
        preserveAspectRatio="xMidYMid slice">
        <path
            v-for="contour in contours"
            :key="contour.value"
            class="contour"
            :d="contour.path"
            :data-value="contour.value"
            :fill="color(contour.value)"></path>
    </svg>
</template>

<script>
import { density2d } from "fast-kde"
import { contours } from "d3-contour"
import { geoIdentity, geoPath } from "d3-geo"
import { extent, range } from "d3-array"
import { scaleLinear } from "d3-scale"
import colors from "./colors"

export default {
    name: "ContourPlot",
    props: {
        plotData: {
            type: Array,
            required: true,
        },
        width: {
            type: Number,
            default: 256,
        },
        height: {
            type: Number,
            default: 256,
        },
        xKey: {
            type: String,
            required: true,
        },
        yKey: {
            type: String,
            required: true,
        },
        bins: {
            type: Array,
            default(rawProps) {
                return [256, 256]
            },
            validator(value) {
                return value.length === 2
            },
        },
        bandwidth: {
            type: Array,
            default(rawProps) {
                return undefined
            },
        },
        colorScale: {
            type: Function,
        },
    },
    computed: {
        density() {
            return density2d(this.plotData, {
                x: this.xKey,
                y: this.yKey,
                bins: this.bins,
                bandwidth: this.bandwidth,
            })
        },
        contours() {
            const vals = [...this.density].map((item) => item.z)
            const contourSet = contours().size(this.bins)(vals)
            return contourSet.map((item) => ({
                ...item,
                path: geoPath().projection(this.projection)(item),
            }))
        },
        projection() {
            // need to reflect plot over x-axis (a.k.a reflectY below) but also
            // translate it back down in the svg because it's out of the plot
            return geoIdentity().reflectY(true).translate([0, this.bins[1]])
        },
        color() {
            const vals = [...this.density].map((item) => item.z)
            const [minVal, maxVal] = extent(vals)

            if (this.colorScale) {
                // adjust the values of the domain to be scaled by the range of the data
                const colorDomain = this.colorScale
                    .domain()
                    .map((d) => d * (maxVal - minVal))
                return this.colorScale.domain(colorDomain)
            }

            // need to concat the max value to the domain because range doesn't include it
            const step = (maxVal - minVal) / (colors.length - 1)
            const domain = range(minVal, maxVal, step).concat(maxVal)

            return scaleLinear().domain(domain).range(colors)
        },
    },
}
</script>

<style scoped></style>

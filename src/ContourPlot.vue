<template>
    <svg
        :width="width"
        :height="height"
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid slice">
        <g>
            <path
                v-for="contour in contours"
                :key="contour.value"
                class="contour"
                :d="contour.path"
                :data-value="contour.value"
                :fill="color(contour.value)"
                :stroke="color(contour.value)"></path>
        </g>
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
        xScale: {
            // Only passed in from scatterplot component if contour is displayed below points
            type: Function,
        },
        yScale: {
            // Only passed in from scatterplot component if contour is displayed below points
            type: Function,
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
        useThresholds: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        hasScales() {
            return this.xScale && this.yScale
        },
        viewBox() {
            return this.hasScales ? null : `0 0 ${this.bins[0]} ${this.bins[1]}`
        },
        density() {
            // only add the extent if x and y scales are available to properly display under scatterplot points
            return density2d(this.plotData, {
                x: this.xKey,
                y: this.yKey,
                bins: this.bins,
                bandwidth: this.bandwidth,
                ...(this.hasScales && {
                    extent: [this.xScale.domain(), this.yScale.domain()],
                }),
            })
        },
        color() {
            const vals = [...this.density].map((item) => item.z)
            const [minVal, maxVal] = extent(vals)

            if (this.colorScale) {
                // adjust the values of the domain to be scaled by the range of the data
                // make copy in order to avoid changing original scale passed in
                const scale = this.colorScale.copy()

                const colorDomain = scale
                    .domain()
                    .map((d) => d * (maxVal - minVal))
                return scale.domain(colorDomain)
            }

            // need to concat the max value to the domain because range doesn't include it
            const step = (maxVal - minVal) / (colors.length - 1)
            const domain = range(minVal, maxVal, step).concat(maxVal)

            return scaleLinear().domain(domain).range(colors)
        },
        projection() {
            // need to reflect plot over x-axis (a.k.a reflectY below) but also
            // translate it down by height or bins height in the svg because it's out of the plot
            if (this.hasScales) {
                return geoIdentity().reflectY(true).translate([0, this.height])
            } else {
                return geoIdentity().reflectY(true).translate([0, this.bins[1]])
            }
        },
        contours() {
            const vals = [...this.density].map((item) => item.z)
            const contourGenerator = contours().size(this.bins)

            if (this.useThresholds) {
                contourGenerator.thresholds(this.color.domain())
            }

            if (this.hasScales) {
                const contourRings = contourGenerator(vals).map((item) => {
                    return {
                        ...item,
                        coordinates: item.coordinates.map((rings) => {
                            return rings.map((points) => {
                                // convert from grid coordinates to screen coordinates (pixels)
                                return points.map(([x, y]) => [
                                    x * (this.width / this.bins[0]),
                                    y * (this.height / this.bins[1]),
                                ])
                            })
                        }),
                    }
                })

                return contourRings.map((item) => ({
                    ...item,
                    path: geoPath().projection(this.projection)(item),
                }))
            } else {
                return contourGenerator(vals).map((item) => ({
                    ...item,
                    path: geoPath().projection(this.projection)(item),
                }))
            }
        },
    },
}
</script>

<style scoped>
figure {
    position: relative;
    margin: 0;
    padding: 0;
}

.annotationsContainer {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
}
</style>

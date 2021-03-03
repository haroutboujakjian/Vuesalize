<template>
    <div>
        <Network :width="500" :height="400" :plot-data="plotData"></Network>
    </div>
</template>

<script>
import Network from "./Network";

export default {
    name: "NetworkExample",
    components: {
        Network
    },
    data() {
        return {
            colors: ['#3097e9', '#ef4281', '#916bcd', '#33aca0',
                '#75e0f3', '#f58e3a', '#e0cc64'],
        }
    },
    computed: {
        plotData() {
            return {
                nodes: Array.from(Array(20).keys()).map(i => ({
                    name: i, x: null, y: null,
                    color: this.colors[Math.ceil(Math.sqrt(i))]
                })),
                links: Array.from(Array(19).keys()).map(i => ({
                    source: Math.floor(Math.sqrt(i)), target: i + 1
                }))
            }
        },
    }
}
</script>

<style scoped>
div {
    display: flex;
    justify-content: center;
    border: solid 1px black;
}
</style>
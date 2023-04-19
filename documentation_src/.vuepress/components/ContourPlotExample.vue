<template>
    <section>
        <form>
            <input
                id="widthSlider"
                type="range"
                v-model.number="width"
                min="50"
                max="600" />
            <label for="widthSlider">width: {{ width }}</label>
            <input
                id="heightSlider"
                type="range"
                v-model.number="height"
                min="50"
                max="600" />
            <label for="heightSlider">height: {{ height }}</label>
        </form>
        <ContourPlot
            x-key="profit"
            y-key="utility"
            :width="width"
            :height="height"
            :use-thresholds="false"
            :plot-data="plotData"></ContourPlot>
    </section>
</template>

<script>
import plotData from "./ScatterPlotData.json"

export default {
    name: "ContourPlotExample",
    data() {
        return {
            plotData,
            width: 300,
            height: 300,
        }
    },
}
</script>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
}

form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
}
</style>

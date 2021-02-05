<template>
    <StackedBarChart :width="350" :height="250" :plot-data="plotData"
                     :margin="margin" :x_key="'date'"
                     :colors="['#717e9b','#b6b6db','#bcd8f1','#d8cfc6']">
    </StackedBarChart>
</template>

<script>
import StackedBarChart from "./StackedBarChart";
import SBCdata from './StackedBarChartData.json'

export default {
    name: "StackedBarChartExample",
    components: {
        StackedBarChart
    },
    data() {
        return {
            plotData: SBCdata,
            margin: {top: 20, bottom: 20, left: 40, right: 20}
        }
    },
    mounted() {
        setInterval(() => {
            this.plotData.forEach(d => {
                for (let key in d) {
                    if (key !== "date") d[key] = Math.round(Math.random() * 3000);
                }
            });
            if (this.plotData.length < 6)
                this.plotData.push({
                    date: 2000 + Math.round(Math.random()*1000),
                    "Veteran's Benefit Administration": Math.round(Math.random() * 3000),
                    "Veteran's Health Administration": Math.round(Math.random() * 3000),
                    "National Cemetery Administration": Math.round(Math.random() * 3000)
                });
            else if (this.plotData.length > 4)
                this.plotData = this.plotData.slice(0, this.plotData.length - 1);
        }, 2000);
    }
}
</script>
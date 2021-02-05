<template>
    <div>
        <donut-chart :chart-data="donutChartData"
                    :chart-title="'Dummy Data'"
                    :size="300">
        </donut-chart>
    </div>
</template>

<script>
import DonutChart from "./DonutChart";

export default {
    name: "DonutChartExample",
    components: {
        DonutChart
    },
    data() {
        return {
            donutChartData: [
                {name: "VA", value: 100},
                {name: "MD", value: 150},
                {name: "DC", value: 200}
            ]
        }
    }
}
</script>
import Components from "./../../src/main";

const {
    StackedBarChart,
    BaseLegend,
    LineChart,
    GroupedBarChart,
    LoaderSpinning,
    Network,
    HierarchicalEdgeBundling,
    StackedAreaChart
} = Components

export default ({Vue, options, router, siteData}) => {
    Vue.use(StackedBarChart)
    Vue.use(BaseLegend)
    Vue.use(GroupedBarChart)
    Vue.use(LineChart)
    Vue.use(LoaderSpinning)
    Vue.use(Network)
    Vue.use(HierarchicalEdgeBundling)
    Vue.use(StackedAreaChart)
}
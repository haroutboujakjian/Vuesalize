import Components from "./../../src/main";

const {
    StackedBarChart,
    BaseLegend,
    LineChart,
    GroupedBarChart,
    LoaderSpinning,
    Network,
    HierarchicalEdgeBundling
} = Components

export default ({Vue, options, router, siteData}) => {
    Vue.use(StackedBarChart)
    Vue.use(BaseLegend)
    Vue.use(GroupedBarChart)
    Vue.use(LineChart)
    Vue.use(LoaderSpinning)
    Vue.use(Network)
    Vue.use(HierarchicalEdgeBundling)
}
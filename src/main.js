import Vue from "vue";
import StackedBarChart from "./StackedBarChart";
import BaseLegend from "./BaseLegend";
import LineChart from "./LineChart";
import GroupedBarChart from "./GroupedBarChart";
import LoaderSpinning from "./LoaderSpinning";
import Network from "./Network";
import HierarchicalEdgeBundling from "./HierarchicalEdgeBundling";
import AreaChart from "./AreaChart";
import ScatterPlot from "./ScatterPlot"

const Components = {
	StackedBarChart, BaseLegend, LineChart, GroupedBarChart, LoaderSpinning, Network,
	HierarchicalEdgeBundling, AreaChart, ScatterPlot
}

Object.keys(Components).forEach(name => {
	Vue.component(name, Components[name])
})

export default Components;
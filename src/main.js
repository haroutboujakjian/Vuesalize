// import * as components from './index';
import Vue from "vue";
import StackedBarChart from "./StackedBarChart";
import BaseLegend from "./BaseLegend";
import LineChart from "./LineChart";
import GroupedBarChart from "./GroupedBarChart";
import LoaderSpinning from "./LoaderSpinning";
import Network from "./Network";
import HierarchicalEdgeBundling from "./HierarchicalEdgeBundling";
import AreaChart from "./AreaChart";

const Components = {
    StackedBarChart,
    BaseLegend,
    LineChart,
    GroupedBarChart,
    LoaderSpinning,
    Network,
    HierarchicalEdgeBundling,
    AreaChart
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name])
})

// export function install(Vue) {
//     if (install.installed) return;
//     install.installed = true;
//     Object.entries(components).forEach(([componentName, component]) => {
//         Vue.component(componentName, component);
//     });
// }
//
// const plugin = {
//     install,
// };
//
// let GlobalVue = null;
// if (typeof window !== 'undefined') {
//     GlobalVue = window.Vue;
// } else if (typeof global !== 'undefined') {
//     GlobalVue = global.Vue;
// }
// if (GlobalVue) {
//     GlobalVue.use(plugin);
// }

export default Components;
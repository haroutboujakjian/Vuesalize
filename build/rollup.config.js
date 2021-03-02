import vue from 'rollup-plugin-vue';
import buble from "@rollup/plugin-buble";
import postcss from 'rollup-plugin-postcss';
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: 'src/main.js',
    output: {
        name: 'VueCharts',
        exports: 'named',
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        nodeResolve(),
        vue({
            css: false,
            template: {
                isProduction: true,
            }
        }),
        postcss({
            extract: true
        }),
        buble({
            transforms: {
                dangerousForOf: true,
                generator: false,
            }
        }),
        commonjs()
    ],
    onwarn: (message) => {
        // Added this because D3 has circular imports. Bostock said it's not a problem
        if (message.code === 'CIRCULAR_DEPENDENCY') {
            return;
        }
        console.error(message);
    }

};
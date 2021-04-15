<template>
    <ul>
        <li v-for="(item, i) in LegendData" :key="item.name"
            :style="item_alignment"
            @click="$emit('click', item)">
            <div :class="{legendItem: enableToggle}">
                <span :style="marker[i]" :class="{toggleMarker: enableToggle}"></span>
                <p :class="{toggle: enableToggle}">{{ item.name }}</p>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: "BaseLegend",
    props: {
        LegendData: Array,
        alignment: {
            type: String,
            default: 'horizontal'
        },
        enableToggle: {
            type: Boolean,
            default: false
        }

    },
    computed: {
        item_alignment() {
            return {
                display: this.alignment === 'horizontal' ? 'inline-block' : 'block'
            }
        },
        marker() {
            if (this.enableToggle) {
                return this.LegendData.map(item => ({
                    backgroundColor: item.selected ? item.color : '',
                    border: item.selected ? '' : 'solid 1px black',
                    cursor: 'pointer',
                }))
            } else if (!this.enableToggle) {
                return this.LegendData.map(item => ({
                    backgroundColor: item.color,
                }))
            }
            return {}
        },
        text() {
            if (this.enableToggle) {
                return {
                    cursor: 'pointer',
                }
            } else if (!this.enableToggle) {
                return {}
            }
            return {}
        }
    }
}
</script>

<style scoped>
ul {
    list-style-type: none;
    text-align: left;
    font-size: 0.78rem;
    margin: 5px 0 5px 0;
    padding: 0 0 0 5px;
}

li {
    margin-right: 10px;
}

span {
    display: inline-block;
    width: 16px;
    height: 12px;
    margin-right: 3px;
}

div {
    display: flex;
    align-items: center;
}

p {
    margin: 0;
}

.legendItem span {
    border: solid 1px transparent;
    transition: border 0.2s;
}

.legendItem:hover span {
    border: solid 1px #2141c1;
    transition: border 0.2s;
}

.toggle {
    cursor: pointer;
    color: #4a4a4a;
    transition: color 0.2s;
}

.toggle:hover {
    color: black;
    transition: color 0.2s;
}

</style>
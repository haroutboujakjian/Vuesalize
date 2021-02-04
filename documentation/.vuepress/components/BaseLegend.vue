<template>
    <ul>
        <li v-for="(key, value) in LegendData" :key="key"
            :style="{'display': item_alignment}">
            <div>
                <span :style="`background-color: ${key}`"></span>
                <p>{{ value }}</p>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: "BaseLegend",
    props: {
        "LegendData": Object,
        "alignment": {
            type: String,
            default: 'horizontal'
        }
    },
    computed: {
        item_alignment() {
            if (this.alignment === 'horizontal') {
                return 'inline-block'
            } else if (this.alignment === 'vertical') {
                return 'block'
            } else {
                return ''
            }
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
</style>
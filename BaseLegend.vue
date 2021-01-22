<template>
    <ul>
        <li v-for="(key, value) in LegendData" :key="key" :style="`--item-color: ${key}`">
            {{ value }}
        </li>
    </ul>
</template>

<script>
export default {
    name: "BaseLegend",
    props: ["LegendData"]
}
</script>

<style scoped>
ul {
    list-style-type: none;
    font-weight: bold;
    text-align: left;
    margin: 5px 0 5px 0;
    padding: 0 0 0 5px;
}

li::before {
    content: '';
    display: block;
    float: left;
    width: 20px;
    height: 15px;
    margin-right: 5px;
    margin-top: 1px;
    border: 0.05rem solid #999;
    background-color: var(--item-color);
}
</style>
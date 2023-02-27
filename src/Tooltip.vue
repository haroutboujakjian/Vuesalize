<template>
    <div
        class="tooltipContainer"
        :style="`top: ${tooltipContent.top + 10}px; left: ${
            tooltipContent.left + 10
        }px`">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Tooltip",
    props: {
        tooltipContent: {
            type: Object,
            required: true,
        },
    },
}
</script>

<style scoped>
.tooltipContainer {
    position: absolute;
    font-size: 0.8rem;
    padding: 10px;
    border: solid 1px black;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    background-color: #ffffff;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    transform: scale(0);
    visibility: hidden;
}
</style>

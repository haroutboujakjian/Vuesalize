<template>
    <div class="lds-dual-ring" :style="{width: `${radius}px`, height: `${radius}px`}">
        <span :style="spinnerStyle">
        </span>
    </div>
</template>

<script>
export default {
    name: "LoaderSpinning",
    props: {
        radius: {
            type: Number, default: 64
        },
        color: {
            type: String, default: '#999'
        }
    },
    computed: {
        spinnerStyle() {
            return {
                width: `${this.radius}px`,
                height: `${this.radius}px`,
                borderColor: `${this.color} transparent ${this.color} transparent`
            }
        }
    }
}
</script>

<style scoped>
.lds-dual-ring {
    display: inline-block;
}

.lds-dual-ring span {
    display: block;
    border-radius: 50%;
    border-width: 6px;
    border-style: solid;
    animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
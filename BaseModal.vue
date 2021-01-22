<template>
    <div class="outsideModal">
        <div class="modalDiv">
            <slot></slot>
            <button type="button" class="button is-small" @click="$emit('closeModal')">Close</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "BaseModal",
}
</script>

<style scoped>

/* Modal */
.modalDiv {
    background-color: whitesmoke;
    border-radius: 2px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px;
    width: 600px;
    max-width: 100%;
    max-height: calc(100vh - 210px);
    overflow-y: auto;
    text-align: left;
    animation-name: animatetop;
    animation-duration: 0.6s;
    white-space: pre-line;
}

.outsideModal {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
}

@keyframes animatetop {
    from {
        top: 0px;
        opacity: 0
    }
    to {
        top: 50%;
        opacity: 1
    }
}

</style>
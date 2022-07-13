<template>
    <img @click.stop="getClickedCardId" :class="{active: card.active}"  :src="`${card.src}`" class="card" />
</template>

<script>
export default {
    props: {
        card: {
            type: Object,
            required: true,
        },
    },
    methods: {
        getClickedCardId() {
            this.$emit("cardClicked", this.card.id);
        },
    },
}
</script>

<style lang="scss">
.card {
    width: 155px;
    border-radius: 15px;
    transition: 300ms;
    bottom: 0px;
    position: relative;
    cursor: pointer;
    transform: translateY(0px);
    // margin-left: -50px;

    &:hover {
        transform: translateY(-20px);
    }
}

.active {
    bottom: 450px;
    right: 0;
    transform: scale(2);
    z-index: 1;
    cursor: default;
    &:hover {
        transform: translateY(0px) scale(2);
    }
}
</style>
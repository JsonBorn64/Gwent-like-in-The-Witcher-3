<template>
    <img @click.stop="getClickedCardId" :class="{ active: card.active }" :src="`${card.src}`" :alt="`${card.name}`"
        class="card" ref="card" />
</template>

<script>
export default {
    props: {
        card: {
            type: Object,
            required: true,
        },
        cardsCount: {
            type: Number,
            required: true,
        },
    },
    methods: {
        getClickedCardId() {
            this.$emit("cardClicked", this.card.id);
        },
        calcLeftMargin() {
            let marginLeft = (((this.cardsCount * 155) - 970) / (this.cardsCount - 1)) + 2;
            if (this.cardsCount > 6) {
                this.$refs.card.style.marginLeft = `-${marginLeft}px`;
            } else {
                this.$refs.card.style.marginLeft = '0px';
            }
        },
    },
    updated() {
        this.calcLeftMargin();
    },
}
</script>

<style lang="scss">
.card {
    width: 155px;
    // height: 292.5px;
    border-radius: 15px;
    transition: 300ms;
    bottom: 0px;
    position: relative;
    cursor: pointer;
    // margin-left: 0px;
    box-shadow: 0 0 20px -8px;
    transform: translateY(0px);

    &:hover {
        transform: translateY(-20px);
    }
}

.card:first-child {
    margin-left: 0px !important;
}

.active {
    bottom: 450px;
    transform: scale(2);
    z-index: 1;
    cursor: default;

    &:hover {
        transform: translateY(0px) scale(2);
    }
}
</style>
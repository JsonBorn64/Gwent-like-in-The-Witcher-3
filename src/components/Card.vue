<template>
    <div class="card_wrapper" :class="{ active: card.active }" ref="card">
        <img @click.stop="getClickedCardId" :src="`${card.src}`" :alt="`${card.name}`"
            class="card" />
        <div class="computed_value" ref="compVal" >{{card.computedValue}}</div>
    </div>
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
        compValColor() {
            if (this.card.computedValue > this.card.defaultValue) {
                this.$refs.compVal.style.color = 'green';
            } else if (this.card.computedValue < this.card.defaultValue) {
                this.$refs.compVal.style.color = 'red';
            } else {
                this.$refs.compVal.style.color = 'black';
            }
        },
    },
    updated() {
        this.calcLeftMargin();
        this.compValColor();
    },
}
</script>

<style lang="scss" scoped>

.card_wrapper {
    width: 155px;
    // height: 292.5px;
    border-radius: 15px;
    transition: 300ms;
    bottom: 0px;
    position: relative;
    cursor: pointer;
    // box-shadow: 0 0 20px -8px;
    transform: translateY(0px);

    &:hover {
        transform: translateY(-30px);
    }
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

.card_wrapper:first-child {
    margin-left: 0px !important;
}

.card {
    width: 100%;
}

.computed_value {
    background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(194,200,203,1) 100%);
    position: absolute;
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    color: rgb(24, 24, 24);
    font-size: 24px;
    top: 5.5px;
    left: 6px;
    width: 33px;
    height: 33px;
}

</style>
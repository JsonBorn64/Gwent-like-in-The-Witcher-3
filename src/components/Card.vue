<template>
    <div class="card_wrapper" :class="{ active: card.active }" ref="card">
        <img @click.stop="getClickedCardId" :src="`${card.src}`" :alt="`${card.name}`" class="card" />
        <div class="computed_value" ref="compVal">{{ card.computedValue }}</div>
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
        isHand: {
            type: Boolean,
            required: true,
        },
        wrapperWidth: {
            type: Number,
            required: false,
        },
    },
    methods: {
        getClickedCardId() {
            this.$emit("cardClicked", this.card.id);
        },
        calcLeftMargin(wrapperWidth) {
            const cardWidth = this.$refs.card.clientWidth;
            const startIndex = Math.floor(wrapperWidth / cardWidth);
            let marginLeft = (((this.cardsCount * cardWidth) - wrapperWidth) / (this.cardsCount - 1)) + 2;
            if (this.cardsCount > startIndex) {
                this.$refs.card.style.marginLeft = `-${marginLeft}px`;
            } else {
                this.$refs.card.style.marginLeft = '0px';
            }
        },
        compValColor() {
            if (this.card.computedValue > this.card.defaultValue) {
                this.$refs.compVal.style.color = '#00BB00';
            } else if (this.card.computedValue < this.card.defaultValue) {
                this.$refs.compVal.style.color = 'red';
            } else {
                this.$refs.compVal.style.color = 'black';
            }
        },
        actionsDependsIsHand() {
            if (this.isHand) {
                this.$refs.card.style.pointerEvents = 'auto';
                this.calcLeftMargin(this.wrapperWidth);
            } else {
                this.$refs.card.style.pointerEvents = 'none';
                this.calcLeftMargin(this.wrapperWidth);
                this.compValColor();
            }
        },
    },
    updated() {
        this.actionsDependsIsHand()
    },
    mounted() {
        this.actionsDependsIsHand()
        if (!this.card.defaultValue || this.card.hero) {
            this.$refs.compVal.style.display = 'none';
        }
        if (Object.keys(this.card).length == 0) {
            this.$refs.card.style.display = 'none';
        }

    },
}
</script>

<style lang="scss" scoped>
.card_wrapper {
    min-width: 90px;
    max-width: 90px;
    height: 125px;
    overflow: hidden;
    border-radius: 8px;
    transition: 300ms;
    bottom: 0px;
    position: relative;
    cursor: pointer;
    box-shadow: 0 0 20px -8px black;
    transform: translateY(0px);

    &:hover {
        transform: translateY(-30px);
    }
}

.active {
    bottom: 400px;
    height: 169px;
    transform: scale(2.4);
    border-radius: 7px;
    z-index: 1;
    cursor: default;

    &:hover {
        transform: translateY(0px) scale(2.4);
    }
}

.card_wrapper:first-child {
    margin-left: 0px !important;
}

.card {
    width: 100%;
}

.computed_value {
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(194, 200, 203, 1) 100%);
    position: absolute;
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    color: rgb(24, 24, 24);
    font-size: 15px;
    font-weight: 600;
    top: 3.35px;
    left: 3.5px;
    width: 19px;
    height: 19px;
}
</style>
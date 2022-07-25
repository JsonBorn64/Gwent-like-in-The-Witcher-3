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
        isCage: {
            type: Boolean,
            required: false,
        },
        wrapperWidth: {
            type: Number,
            required: false,
        },
        scarecrowActive: {
            type: Boolean,
            default: false,
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
                this.$refs.compVal.style.color = '#007700';
            } else if (this.card.computedValue < this.card.defaultValue) {
                this.$refs.compVal.style.color = 'red';
            } else {
                this.$refs.compVal.style.color = 'black';
            }
        },
        actionsDependsIsHand() {
            this.calcLeftMargin(this.wrapperWidth);
            if (this.isHand) {
                this.$refs.card.style.pointerEvents = 'auto';
            } else if (this.isCage) {
                this.$refs.card.style.pointerEvents = 'none';
            } else if (!this.isHand && !this.scarecrowActive) {
                this.$refs.card.style.pointerEvents = 'none';
                this.compValColor();
            } else if (!this.isHand && this.scarecrowActive && !this.card.hero) {
                this.$refs.card.style.pointerEvents = 'auto';
                this.compValColor();
            }
        },
    },
    updated() {
        this.actionsDependsIsHand()
        if (Object.keys(this.card).length == 0) {
            this.$refs.card.style.display = 'none';
        } else {
            this.$refs.card.style.display = 'block';
        }
    },
    mounted() {
        this.actionsDependsIsHand()
        if (!this.card.defaultValue || this.card.hero) {
            this.$refs.compVal.style.display = 'none';
        }
        if (Object.keys(this.card).length == 0) {
            this.$refs.card.style.display = 'none';
        } else {
            this.$refs.card.style.display = 'block';
        }
    },
}
</script>

<style lang="scss" scoped>

.card_wrapper {
    min-width: 90px;
    max-width: 90px;
    height: 120px;
    overflow: hidden;
    border-radius: 8px;
    transition: 300ms;
    bottom: 0px;
    position: relative;
    cursor: pointer;
    // box-shadow: 0 0 20px -8px black;
    transform: translateY(0px);
    z-index: 0;

    &:hover {
        transform: translateY(-20px);
        z-index: 1;
    }
}

.active {
    bottom: 400px;
    height: 169px;
    right: -200px;
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
    top: 3.35px;
    left: 3.5px;
    width: 19px;
    height: 19px;
}
</style>
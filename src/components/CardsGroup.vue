<template>
    <div class="wrapper" ref="wrapper">
        <TransitionGroup name="cards">
            <Card v-for="card in cards" :key="card.id" :card="card" :isHand="isHand" :cardsCount="cards.length"
                :wrapperWidth="wrapperWidth" @cardClicked="getClickedCardId" />
        </TransitionGroup>
    </div>
</template>

<script>
import Card from "./Card.vue";
export default {
    components: { Card },
    props: {
        cards: {
            type: Array,
            required: true,
        },
        isHand: {
            type: Boolean,
            required: false,
        },
    },
    data() {
        return {
            wrapperWidth: 900,
        };
    },
    methods: {
        getClickedCardId(clickedCardId) {
            this.$emit("cardClicked", clickedCardId);
        },
        getFieldRowWidth() {
            this.wrapperWidth = this.$refs.wrapper.clientWidth;
            window.addEventListener("resize", this.getFieldRowWidth);
        },
    },
    mounted() {
        this.getFieldRowWidth();
    },
}
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    gap: 2px;
}

.cards-move,
.cards-enter-active,
.cards-leave-active {
    transition: all 300ms ease;
}

.cards-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.cards-leave-to {
    opacity: 0;
    transform: translateY(-40px);
}

.cards-leave-active {
    position: absolute;
}
</style>
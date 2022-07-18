<template>
    <div class="wrapper">
        <TransitionGroup name="cards">
            <Card v-for="card in cards" :key="card.id" :card="card" :isHand="isHand" :cardsCount="cards.length"
                @cardClicked="getClickedCardId" />
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
    methods: {
        getClickedCardId(clickedCardId) {
            this.$emit("cardClicked", clickedCardId);
        },
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 2px;
}

.cards-move,
.cards-enter-active,
.cards-leave-active {
  transition: all 300ms ease;
}

.cards-enter-from,
.cards-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.cards-leave-active {
  position: absolute;
}
</style>
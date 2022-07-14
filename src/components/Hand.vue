<template>
    <div class="hand">
        <TransitionGroup name="cards">
            <Card v-for="card in hand" :key="card.id" :card="card" :cardsCount="cardsCount"
                @cardClicked="getClickedCardId" />
        </TransitionGroup>
    </div>
</template>

<script>
import Card from "./Card.vue";
export default {
    components: { Card },
    props: {
        hand: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            cardsCount: 0,
        };
    },
    methods: {
        getClickedCardId(clickedCardId) {
            this.$emit("cardClicked", clickedCardId);
        },
    },
    mounted() {
        this.cardsCount = this.hand.length;
    },
}
</script>

<style lang="scss">
.hand {
    position: absolute;
    width: 970px;
    margin-left: auto;
    display: flex;
    gap: 2px;
    justify-content: center;
    border: 1px solid;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
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
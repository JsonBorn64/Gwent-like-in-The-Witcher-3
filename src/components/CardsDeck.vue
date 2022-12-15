<template>
    <div class="deck">
        <TransitionGroup name="deck_cards">
            <img
                v-for="(card, index) in cardsDeck"
                :key="index"
                :style="{ top: `-${index/2}px`,
                          left: `-${index/3}px` }"
                src="/src/assets/Карты_гвинт_webp/0._Рубашки_для_карт/Королевства_Севера.webp"
                alt="рубашка королевства севера"
            >
        </TransitionGroup>
        <div class="cards_count" :style="{transform: `translateX(-${cardsCount/3}px)`}">
            {{ cardsCount }}
        </div>
    </div>
</template>

<script>
export default {
  props: {
    cardsDeck: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    cardsCount() {
      return this.cardsDeck.length;
    }
  }
};
</script>

<style lang="scss" scoped>
.deck {
  width: 90px;
  height: 170px;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 -6px 10px 6px rgba(0, 0, 0, 0.4) inset;
  position: relative;
  & img {
    width: 100%;
    position: absolute;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: 0 0 1px black;
  }
  & .cards_count {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    color: #dbae47;
    font-size: 20px;
    width: 34px;
    display: grid;
    place-items: center;
    height: 30px;
    font-weight: 600;
    bottom: 0px;
    left: calc(50% - 17px);
  }
}

.cards-move,
.cards-enter-active,
.cards-leave-active {
    transition: all 300ms ease;
}

.deck_cards-enter-from {
    opacity: 0;
    transform: translateX(40px);
}

.deck_cards-leave-to {
    opacity: 0;
    transform: translateY(-40px);
}

.deck_cards-leave-active {
    position: absolute;
}
</style>

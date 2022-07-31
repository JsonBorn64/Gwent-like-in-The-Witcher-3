<template>
    <div class="dropped_cards-wrapper">
        <div class="dropped_cards" @click="showDroppedPopup = true">
            <single-card
                v-for="(card, idx) in droppedCards"
                :key="card.id"
                :card="card"
                :style="{ top: `${10 - idx}px`,
                          left: `${10 - idx/2}px` }"
            />
        </div>
        <div class="dropped_cards_popup-wrapper" v-if="showDroppedPopup">
            <div class="dropped_overlay" @click="showDroppedPopup = false" />
            <div class="dropped_cards_popup">
                <TransitionGroup name="droppedCards">
                    <single-card
                        v-for="(card, idx) in droppedCards"
                        :key="card.id"
                        :card="card"
                        :place="'popup'"
                        :dropped-index="idx"
                        @droppedClick="getDroppedClickIdx"
                        :style="{ transform: `scale(${calcTransformCoef(idx)}) !important`,
                                  marginLeft: `${calcTransformCoef(idx)*24}px`,
                                  marginRight: `${calcTransformCoef(idx)*24}px` }"
                        v-show="calcTransformCoef(idx)"
                    />
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script>
import SingleCard from './SingleCard.vue';

export default {
  components: { SingleCard },
  props: {
    droppedCards: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showDroppedPopup: true,
      dropClickIdx: 0
    };
  },
  methods: {
    calcTransformCoef(idx) {
      if (idx === this.dropClickIdx - 2) return 1;
      if (idx === this.dropClickIdx - 1) return 1.5;
      if (idx === this.dropClickIdx) return 2;
      if (idx === this.dropClickIdx + 1) return 1.5;
      if (idx === this.dropClickIdx + 2) return 1;
      return 0;
    },
    getDroppedClickIdx(idx) {
      this.dropClickIdx = idx;
    }
  }
};
</script>

<style lang="scss" scoped>

.dropped_cards {
  width: 110px;
  height: 140px;
  margin-right: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 6px 10px 6px rgba(0, 0, 0, 0.6) inset;
  position: relative;
  & > div {
    position: absolute !important;
    left: 10px;
    top: 10px;
  }
}

.dropped_cards_popup-wrapper {
  position: absolute;
}

.dropped_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.dropped_cards_popup {
  position: fixed;
  display: flex;
  // gap: 40px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  height: 350px;
  z-index: 2;
}

// .droppedCards-move,
// .droppedCards-enter-active,
// .droppedCards-leave-active {
//     transition: all 300ms ease;
// }

.droppedCards-enter-from {
    opacity: 0;
    // transform: translateX(40px);
}

.droppedCards-leave-to {
    opacity: 0;
    // transform: translateY(-40px);
}

// .droppedCards-leave-active {
//     position: absolute;
// }
</style>

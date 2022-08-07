<template>
    <div class="dropped_cards-wrapper">
        <div
            class="dropped_cards"
            @click="showPopup"
            :style="{ pointerEvents: `${droppedCards.length ? 'auto' : 'none'}` }"
        >
            <single-card
                v-for="(card, idx) in droppedCards"
                :key="card.id"
                :card="card"
                :style="{ top: `${10 - idx}px`,
                          left: `${10 - idx/2}px` }"
            />
        </div>
        <Transition>
            <div class="dropped_cards_popup-wrapper" v-if="showDroppedPopup">
                <div class="dropped_overlay" @click="closePopup" />
                <div class="dropped_cards_popup" @wheel.prevent="horizontalScroll" ref="popup">
                    <single-card
                        v-for="card in droppedCards"
                        :key="card.id"
                        :card="card"
                        :place="'popup'"
                        :medic="medic"
                        @medicRecoveredCard="medicRecoveredCard"
                    />
                </div>
            </div>
        </Transition>
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
    },
    showDroppedPopup: {
      type: Boolean,
      default: false
    },
    medic: {
      type: Boolean,
      default: false
    },
    isEnemy: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    horizontalScroll(e) {
      const { popup } = this.$refs;
      const step = 60;
      if (e.deltaY > 0) {
        popup.scrollLeft += step;
      } else {
        popup.scrollLeft -= step;
      }
    },
    closePopup() {
      if (!this.isEnemy) {
        this.$emit('closePopup');
      } else {
        this.$emit('closeEnemyPopup');
      }
    },
    showPopup() {
      if (!this.isEnemy) {
        this.$emit('showPopup');
      } else {
        this.$emit('showEnemyPopup');
      }
    },
    medicRecoveredCard(card) {
      this.$emit('medicRecoveredCard', card);
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
  cursor: pointer;
  & > div {
    position: absolute !important;
    left: 10px;
    top: 10px;
  }
}

.dropped_cards_popup-wrapper {
  position: absolute;
  z-index: 1;
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
  gap: 150px;
  padding: 12px 70px;
  box-sizing: border-box;
  height: 445px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  z-index: 2;
  overflow-x: scroll;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  height: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

</style>

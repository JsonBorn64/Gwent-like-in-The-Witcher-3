<template>
    <div class="card_wrapper" :class="{ active: card?.active && place === 'hand' }" ref="card">
        <img
            class="card"
            :src="`${card?.src}`"
            :alt="`${card?.name}`"
            @click.stop="cardClicked"
        >
        <div class="computed_value" v-show="card?.defaultValue && !card?.hero" ref="compVal">
            {{ card?.computedValue }}
        </div>
    </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: null
    },
    cardsCount: {
      type: Number,
      default: 0
    },
    place: {
      type: String,
      default: 'dropped'
    },
    rowType: {
      type: String,
      default: 'notRow'
    },
    droppedIndex: {
      type: Number,
      default: 0
    },
    wrapperWidth: {
      type: Number,
      default: 810
    },
    activeCard: {
      type: Object,
      default: null
    },
    medic: {
      type: Boolean,
      default: false
    }
  },
  // watch: {
  //   cardsCount: {
  //     deep: true,
  //     handler() {
  //       this.changeValColor();
  //     }
  //   }
  // },
  updated() {
    this.actionsDependsOnPlace();
    this.calcRightForActiveCard();
    this.changeValColor();
  },
  mounted() {
    this.actionsDependsOnPlace();
  },
  methods: {
    cardClicked() {
      const { card } = this;
      const { rowType } = this;
      if (this.place === 'dropped') return;
      if (this.place === 'popup' && this.medic) this.$store.dispatch('medicRecoveredCard', this.card);
      if (this.place === 'field' && this.$store.state.activeCard.role === 'scarecrow') {
        this.$store.dispatch('cardInRowClicked', { card, rowType });
        return;
      }
      this.$store.dispatch('unactiveAllCards');
      this.$store.dispatch('activateCard', this.card);
    },
    calcLeftMargin(wrapperWidth) {
      if (this.place === 'dropped' || this.place === 'popup') return;
      const cardWidth = this.$refs.card.clientWidth;
      const startIndex = Math.ceil(wrapperWidth / cardWidth);
      const marginLeft = (((this.cardsCount * cardWidth) - wrapperWidth) / (this.cardsCount - 1)) + 2;
      if (this.cardsCount >= startIndex) {
        this.$refs.card.style.marginLeft = `-${marginLeft}px`;
      } else {
        this.$refs.card.style.marginLeft = '0px';
      }
    },
    calcRightForActiveCard() {
      if (this.place !== 'hand') return;
      const correction = this.wrapperWidth - this.$refs.card.getBoundingClientRect().x + 416;
      if (this.card?.active && window.innerWidth < 1525) {
        this.$refs.card.style.right = `-${correction}px`;
      } else if (this.card?.active && window.innerWidth >= 1525) {
        this.$refs.card.style.right = `-${correction + ((window.innerWidth - 1525) / 2)}px`;
      } else {
        this.$refs.card.style.right = '0px';
      }
    },
    changeValColor() {
      if (this.card.computedValue > this.card.defaultValue) {
        this.$refs.compVal.style.color = '#007700';
      } else if (this.card.computedValue < this.card.defaultValue) {
        this.$refs.compVal.style.color = 'red';
      } else {
        this.$refs.compVal.style.color = 'black';
      }
    },
    actionsDependsOnPlace() {
      this.calcLeftMargin(this.wrapperWidth);
      const scarecrow = this.activeCard?.role === 'scarecrow';
      if (this.place === 'hand') {
        this.$refs.card.style.pointerEvents = 'auto';
      } else if (this.place === 'cage'
      || this.place === 'dropped' || this.place === 'weather' || this.place === 'enemyField') {
        this.$refs.card.style.pointerEvents = 'none';
      } else if (this.place === 'field' && !scarecrow) {
        this.$refs.card.style.boxShadow = '0 0 20px -8px black';
        this.$refs.card.style.pointerEvents = 'none';
        this.$refs.card.style.zIndex = '0';
      } else if (this.place === 'field' && scarecrow && !this.card.hero) {
        this.$refs.card.style.pointerEvents = 'auto';
        this.$refs.card.style.boxShadow = '0 0 4px 2px #f3c14c';
        this.$refs.card.style.zIndex = '1';
      } else if (this.place === 'popup' && !this.medic) {
        this.$refs.card.style.pointerEvents = 'none';
        this.$refs.card.style.height = '169px';
        this.$refs.card.style.borderRadius = '7px';
        this.$refs.card.style.transformOrigin = 'top';
        this.$refs.card.style.transform = 'translateY(0px) scale(2.4)';
      } else if (this.place === 'popup'
          && this.medic
          && !(this.card.hero
          || this.card.role === 'scarecrow'
          || this.card.role === 'weather'
          || this.card.role === 'execution'
          || this.card.role === 'extra')) {
        this.$refs.card.style.pointerEvents = 'auto';
        this.$refs.card.style.height = '169px';
        this.$refs.card.style.borderRadius = '7px';
        this.$refs.card.style.transformOrigin = 'top';
        this.$refs.card.style.transform = 'translateY(0px) scale(2.4)';
        this.$refs.card.classList.add('medic_active');
      } else if (this.place === 'popup'
          && this.medic
          && (this.card.hero
          || this.card.role === 'scarecrow'
          || this.card.role === 'weather'
          || this.card.role === 'execution'
          || this.card.role === 'extra')) {
        this.$refs.card.style.pointerEvents = 'none';
        this.$refs.card.style.height = '169px';
        this.$refs.card.style.borderRadius = '7px';
        this.$refs.card.style.transformOrigin = 'top';
        this.$refs.card.style.transform = 'translateY(0px) scale(2.4)';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card_wrapper {
  min-width: 90px;
  max-width: 90px;
  height: 120px;
  color: #f3c14c;
  overflow: hidden;
  border-radius: 8px;
  transition: bottom 300ms, height 300ms, transform 300ms, right 300ms, box-shadow 300ms;
  bottom: 0px;
  right: 0px;
  position: relative;
  cursor: pointer;
  box-shadow: 0 0 20px -8px black;
  transform: translateY(0px);
  z-index: 0;

  &:hover {
    transform: translateY(-20px);
    // z-index: 1;
  }
}

.active {
  bottom: calc(50vh - 75px);
  height: 169px;
  transform: scale(2.4);
  border-radius: 7px;
  z-index: 1;
  cursor: default;

  &:hover {
    transform: translateY(0px) scale(2.4);
  }
}

.medic_active {
  &:hover {
    box-shadow: 0 0 4px 2px #f3c14c;
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

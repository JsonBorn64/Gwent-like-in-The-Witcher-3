<template>
    <div class="card_wrapper" :class="{ active: card?.active }" ref="card">
        <img
            class="card"
            :src="`${card?.src}`"
            :alt="`${card?.name}`"
            @click.stop="getClickedCard"
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
      required: true
    },
    isHand: {
      type: Boolean,
      required: true
    },
    isCage: {
      type: Boolean,
      required: false
    },
    wrapperWidth: {
      type: Number,
      default: 810
    },
    activeCard: {
      type: Object,
      default: null
    }
  },
  updated() {
    this.actionsDependsIsHand();
  },
  mounted() {
    this.actionsDependsIsHand();
  },
  methods: {
    getClickedCard() {
      this.$emit('cardClicked', this.card);
    },
    calcLeftMargin(wrapperWidth) {
      const cardWidth = this.$refs.card.clientWidth;
      const startIndex = Math.floor(wrapperWidth / cardWidth);
      const marginLeft = (((this.cardsCount * cardWidth) - wrapperWidth) / (this.cardsCount - 1)) + 2;
      if (this.cardsCount >= startIndex) {
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
      const scarecrow = this.activeCard?.role === 'scarecrow';
      if (this.isHand) {
        this.$refs.card.style.pointerEvents = 'auto';
      } else if (this.isCage) {
        this.$refs.card.style.pointerEvents = 'none';
      } else if (!this.isHand && !scarecrow) {
        this.$refs.card.style.boxShadow = '0 0 20px -8px black';
        this.$refs.card.style.pointerEvents = 'none';
        this.compValColor();
      } else if (!this.isHand && scarecrow && !this.card.hero) {
        this.$refs.card.style.pointerEvents = 'auto';
        this.$refs.card.style.boxShadow = '0 0 4px 2px #A07F33';
        this.compValColor();
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
  overflow: hidden;
  border-radius: 8px;
  transition: bottom 300ms, height 300ms, right 300ms, transform 300ms;
  transition-delay: 0s, 0s, 300ms, 0s;
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
  bottom: 400px;
  height: 169px;
  right: -400px;
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

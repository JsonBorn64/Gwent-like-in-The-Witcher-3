<template>
    <div class="wrapper" ref="wrapper">
        <TransitionGroup name="cards">
            <single-card
                v-for="card in cards"
                :key="card.id"
                :card="card"
                :is-hand="isHand"
                :cards-count="cards.length"
                :wrapper-width="wrapperWidth"
                :active-card="activeCard"
                @cardClicked="getClickedCard"
            />
        </TransitionGroup>
    </div>
</template>

<script>
import SingleCard from './SingleCard.vue';

export default {
  components: { SingleCard },
  props: {
    cards: {
      type: Array,
      required: true
    },
    isHand: {
      type: Boolean,
      required: false
    },
    activeCard: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      wrapperWidth: 810
    };
  },
  mounted() {
    this.getFieldRowWidth();
    window.addEventListener('resize', this.getFieldRowWidth);
  },
  methods: {
    getClickedCard(clickedCard) {
      this.$emit('cardClicked', clickedCard);
    },
    getFieldRowWidth() {
      this.wrapperWidth = this.$refs.wrapper.clientWidth;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    gap: 2px;
}

// .cards-move,
// .cards-enter-active,
// .cards-leave-active {
//     transition: all 300ms ease;
// }

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

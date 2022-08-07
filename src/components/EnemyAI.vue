<template>
    <div />
</template>

<script>
export default {
  props: {
    enemyFrontRow: {
      type: Array,
      required: true
    },
    enemyFrontRowExtraCage: {
      type: Object,
      default: null
    },
    enemyMidRow: {
      type: Array,
      required: true
    },
    enemyMidRowExtraCage: {
      type: Object,
      default: null
    },
    enemyBackRow: {
      type: Array,
      required: true
    },
    enemyBackRowExtraCage: {
      type: Object,
      default: null
    },
    weatherCards: {
      type: Array,
      default: () => []
    },
    enemyLives: {
      type: Number,
      required: true
    },
    enemyHand: {
      type: Array,
      required: true
    },
    enemyDroppedCards: {
      type: Array,
      default: () => []
    },
    enemyCardsDeck: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.$emit('enemyCardsDeckChanged', this.enemyCardsDeck);
  }
};
</script>

<template>
    <div class="dropped_cards">
        <single-card
            v-for="(card, idx) in droppedCards"
            :key="card.id"
            :card="card"
            :style="{ top: `${10 - idx}px`,
                      left: `${10 - idx*2}px` }"
        />
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
  }
};
</script>

<style lang="scss" scoped>
.dropped_cards {
  width: 110px;
  height: 140px;
  align-self: end;
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
</style>

<template>
    <div class="deck">
        <img
            v-for="(card, index) in cardsDeck"
            :key="index"
            :style="{ top: `-${index/2}px`,
                      left: `-${index/3}px` }"
            src="src/assets/Карты гвинт webp/0. Рубашки для карт/Королевства Севера.webp"
            alt="рубашка королевства севера"
        >
    </div>
</template>

<script>
export default {
  props: {
    cardsDeck: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.deck {
  width: 90px;
  height: 170px;
  box-shadow: 0 -6px 10px 6px rgba(0, 0, 0, 0.4) inset;
  position: relative;
  & img {
    width: 100%;
    position: absolute;
    border-radius: 8px;
    box-sizing: border-box;
  }
}
</style>

<template>
    <div class="weather_cards" :class="{'tip-border': activeCard?.role === 'weather'}">
        <cards-group :cards="weatherCards" :place="'weather'" />
    </div>
</template>

<script>
import CardsGroup from './CardsGroup.vue';

export default {
  components: { CardsGroup },
  props: {
    weatherCards: {
      type: Array,
      required: true
    },
    place: {
      type: String,
      default: 'dropped'
    },
    activeCard: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
  .weather_cards {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    width: 240px;
    height: 140px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s;
    box-shadow: 0 0 0 transparent, 0 0px 10px 6px #00000099 inset;
  }

  .tip-border {
    box-shadow: 0 0 4px 2px #A07F33, 0 -0px 10px 6px #00000099 inset;
  }
</style>

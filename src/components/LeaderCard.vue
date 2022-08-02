<template>
    <div class="player_leader">
        <single-card :card="leaderCard" />
    </div>
</template>

<script>
import SingleCard from './SingleCard.vue';

export default {
  components: { SingleCard },
  props: {
    leaderCard: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.player_leader, .enemy_leader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 130px;
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 0px 10px 6px rgba(0, 0, 0, 0.6) inset;
    & > img {
      width: 90px;
      height: 169px;
    }
  }
</style>

<template>
    <div @click="$store.dispatch('unactiveAllCards')" class="main_wrapper">
        <div class="left_sidebar">
            <leader-card :leader-card="$store.state.enemyLeader" />
            <player-stats
                :nickname="$store.state.enemyNickname"
                :leader="$store.state.enemyLeader"
                :avatar="$store.state.enemyAvatar"
                :lives="$store.state.enemyLives"
                :total-count="$store.state.enemyTotalCount"
                :fraction="$store.state.enemyFraction"
                :hand-count="$store.state.enemyHand.length"
                :is-enemy="true"
                :turn="$store.state.turn"
            />
            <weather-cards
                @click="$store.dispatch('weatherCardsClick')"
                :weather-cards="$store.state.weatherCards"
                :place="'weather'"
                :active-card="$store.state.activeCard"
            />
            <player-stats
                :nickname="$store.state.playerNickname"
                :leader="$store.state.playerLeader"
                :avatar="$store.state.playerAvatar"
                :lives="$store.state.playerLives"
                :total-count="$store.state.playerTotalCount"
                :fraction="$store.state.playerFraction"
                :hand-count="$store.state.hand.length"
                :turn="$store.state.turn"
            />
            <leader-card :leader-card="$store.state.playerLeader" />
        </div>
        <div class="center">
            <game-field
                :front-row="$store.state.frontRow"
                :front-row-extra-cage="$store.state.frontRowExtraCage"
                :mid-row="$store.state.midRow"
                :mid-row-extra-cage="$store.state.midRowExtraCage"
                :back-row="$store.state.backRow"
                :back-row-extra-cage="$store.state.backRowExtraCage"
                :enemy-front-row="$store.state.enemyFrontRow"
                :enemy-front-row-extra-cage="$store.state.enemyFrontRowExtraCage"
                :enemy-mid-row="$store.state.enemyMidRow"
                :enemy-mid-row-extra-cage="$store.state.enemyMidRowExtraCage"
                :enemy-back-row="$store.state.enemyBackRow"
                :enemy-back-row-extra-cage="$store.state.enemyBackRowExtraCage"
                :weather-cards="$store.state.weatherCards"
                :active-card="$store.state.activeCard"
                :place="'field'"
            />
            <div class="hand" ref="hand">
                <cards-group :cards="$store.state.hand" :place="'hand'" />
            </div>
        </div>
        <div class="right_sidebar">
            <div class="enemy-decks_wrapper">
                <dropped-cards
                    :dropped-cards="$store.state.enemyDroppedCards"
                    :show-dropped-popup="$store.state.showEnemyDroppedPopup"
                    :is-enemy="true"
                />
                <cards-deck :cards-deck="$store.state.enemyCardsDeck" />
            </div>
            <div class="player-decks_wrapper">
                <dropped-cards
                    :dropped-cards="$store.state.droppedCards"
                    :show-dropped-popup="$store.state.showDroppedPopup"
                    :medic="$store.state.medic"
                />
                <cards-deck :cards-deck="$store.state.cardsDeck" />
            </div>
        </div>
        <!-- <enemy-a-i
            :weather-cards="weatherCards"
            :enemy-lives="enemyLives"
            :enemy-hand="enemyHand"
            :enemy-dropped-cards="enemyDroppedCards"
            :enemy-cards-deck="enemyCardsDeck"
            :turn="turn"
        /> -->
    </div>
</template>

<script>
import GameField from './components/GameField.vue';
import CardsGroup from './components/CardsGroup.vue';
import CardsDeck from './components/CardsDeck.vue';
import DroppedCards from './components/DroppedCards.vue';
import WeatherCards from './components/WeatherCards.vue';
import LeaderCard from './components/LeaderCard.vue';
import PlayerStats from './components/PlayerStats.vue';
// import EnemyAI from './components/EnemyAI.vue';

export default {
  components: { GameField, CardsGroup, CardsDeck, DroppedCards, WeatherCards, LeaderCard, PlayerStats },
  watch: {
    '$store.state.allCardsLoaded': function setDecksAndHands() {
      const delay = 100;
      this.$store.dispatch('setCardsDecks');
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          this.$store.dispatch('addCardToHandFromDeck');
        }, i * delay);
      }
      setTimeout(() => {
        this.$refs.hand.style.overflowX = 'visible';
        this.$store.commit('sortHandById');
      }, delay * 10);
    }
  },
  mounted() {
    this.$store.dispatch('getAllCards');
  },
  methods: {
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "Oswald";
  src: url("src/assets/fonts/Oswald-Regular.ttf") format("truetype");
  font-style: normal;
  font-weight: 400;
}

@font-face {
  font-family: "Oswald";
  src: url("src/assets/fonts/Oswald-SemiBold.ttf") format("truetype");
  font-style: normal;
  font-weight: 600;
}

.main_wrapper {
  background-color: #3D200C;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Oswald', sans-serif;
  min-height: 100vh;
  background: url("src/assets/текстуры/1579847875_43-p-tekstura-dereva-75.webp") center/cover no-repeat;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 948px;
  height: 100vh;
}

.hand {
  max-width: 918px;
  width: calc(100% - 20px);
  height: 120px;
  margin-bottom: 20px;
  margin-left: 10px;
  box-shadow: 0 -6px 10px 6px rgba(0, 0, 0, 0.4) inset;
  overflow-x: clip;
}

.right_sidebar {
  width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-right: 18px;
  margin-left: 10px;
}

.player-decks_wrapper, .enemy-decks_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
  margin-bottom: 20px;
}

.enemy-decks_wrapper {
  align-items: start;
}

.left_sidebar {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-right: 40px;
    margin-left: 10px;
}

  </style>

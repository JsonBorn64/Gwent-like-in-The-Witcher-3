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
                @click="weatherCardsClick"
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
                @cardRowClicked="cardInRowClicked"
                @extraCageClick="extraCageClick"
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
                    @closeEnemyPopup="closePopupMethod(true)"
                    @showEnemyPopup="showPopupMethod(true)"
                    @medicRecoveredCard="medicRecoveredCard"
                />
                <cards-deck :cards-deck="$store.state.enemyCardsDeck" />
            </div>
            <div class="player-decks_wrapper">
                <dropped-cards
                    :dropped-cards="$store.state.droppedCards"
                    :show-dropped-popup="$store.state.showDroppedPopup"
                    :medic="$store.state.medic"
                    @closePopup="closePopupMethod"
                    @showPopup="showPopupMethod"
                    @medicRecoveredCard="medicRecoveredCard"
                />
                <cards-deck :cards-deck="$store.state.cardsDeck" />
            </div>
        </div>
        <!-- <enemy-a-i
            @newGameState="newGameState"
            :weather-cards="weatherCards"
            :enemy-lives="enemyLives"
            :enemy-hand="enemyHand"
            :enemy-dropped-cards="enemyDroppedCards"
            :enemy-cards-deck="enemyCardsDeck"
            :turn="turn"
            :game-state="{
                frontRow: frontRow,
                midRow: midRow,
                backRow: backRow,
                enemyFrontRow: enemyFrontRow,
                enemyFrontRowExtraCage: enemyFrontRowExtraCage,
                enemyMidRow: enemyMidRow,
                enemyMidRowExtraCage: enemyMidRowExtraCage,
                enemyBackRow: enemyBackRow,
                enemyBackRowExtraCage: enemyBackRowExtraCage
            }"
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
    cardInRowClicked(card, rowType) {
      const getBackCard = this[`${rowType}Row`].find(item => item.id === card.id);
      this.activeCard.active = false;
      this.hand = this.hand.filter(item => this.activeCard.id !== item.id);
      getBackCard.computedValue = getBackCard.defaultValue;
      this.hand.push(getBackCard);
      this.hand.sort((a, b) => a.id - b.id);
      this[`${rowType}Row`] = this[`${rowType}Row`].filter(item => item.id !== card.id);
      this[`${rowType}Row`].forEach(item => {
        item.doubled = false;
      });
      this[`${rowType}Row`].unshift(this.activeCard);
      this.activeCard = null;
      this.turn = 'enemy';
    },
    weatherCardsClick() {
      if (this.activeCard?.role === 'weather'
      && !this.activeCard?.clear
      && !this.weatherCards.find(wCard => wCard.influence === this.activeCard?.influence)) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this.weatherCards.push(this.activeCard);
      } else if (this.activeCard?.role === 'weather' && this.activeCard?.clear) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this.droppedCards.push(this.activeCard);
        this.weatherCards = [];
      } else if (this.activeCard?.role !== 'weather') {
        if (this.activeCard) this.activeCard.active = false;
      } else {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this.droppedCards.push(this.activeCard);
      }
      this.turn = 'enemy';
    },
    medicRecoveredCard(card) {
      this.medic = false;
      this.showDroppedPopup = false;
      this.droppedCards = this.droppedCards.filter(item => item.id !== card.id);
      if (card.spy && this.cardsDeck.length !== 0) {
        for (let i = 1; i < 3; i++) {
          setTimeout(() => {
            this.$refs.hand.style.overflowX = 'hidden';
            this.hand.push(this.cardsDeck.shift());
          }, i * 300);
        }
        setTimeout(() => {
          this.$refs.hand.style.overflowX = 'visible';
          this.hand.sort((a, b) => a.id - b.id);
        }, 1000);
        if (card.role === 'front') this.enemyFrontRow.push(card);
        if (card.role === 'mid') this.enemyMidRow.push(card);
        if (card.role === 'back') this.enemyBackRow.push(card);
        return;
      }
      if (card.role === 'front') this.frontRow.push(card);
      if (card.role === 'mid') this.midRow.push(card);
      if (card.role === 'back') this.backRow.push(card);
      this.turn = 'enemy';
    },
    extraCageClick(cageType) {
      if (!this[cageType]?.id && this.activeCard?.troubadour) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[cageType] = this.activeCard;
        this.turn = 'enemy';
      }
    },
    closePopupMethod(isEnemy) {
      if (!this.medic && !isEnemy) {
        this.showDroppedPopup = false;
      } else {
        this.showEnemyDroppedPopup = false;
      }
    },
    showPopupMethod(isEnemy) {
      if (!isEnemy) {
        this.showDroppedPopup = true;
      } else {
        this.showEnemyDroppedPopup = true;
      }
    },
    getPlayerTotalValue(newValue) {
      this.playerTotalCount = newValue;
    },
    getEnemyTotalValue(newValue) {
      this.enemyTotalCount = newValue;
    },
    newGameState(gameState) {
      this.turn = 'player';
      this.enemyHand = gameState.hand;
      this.enemyDroppedCards = gameState.droppedCards;
      this.enemyCardsDeck = gameState.cardsDeck;
      this.enemyLives = gameState.lives;
      this.weatherCards = gameState.weatherCards;
      this.frontRow = gameState.frontRow;
      this.midRow = gameState.midRow;
      this.backRow = gameState.backRow;
      this.enemyFrontRow = gameState.enemyFrontRow;
      this.enemyFrontRowExtraCage = gameState.enemyFrontRowExtraCage;
      this.enemyMidRow = gameState.enemyMidRow;
      this.enemyMidRowExtraCage = gameState.enemyMidRowExtraCage;
      this.enemyBackRow = gameState.enemyBackRow;
      this.enemyBackRowExtraCage = gameState.enemyBackRowExtraCage;
    }
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

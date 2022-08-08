<template>
    <div @click="unactiveAllCards" class="main_wrapper">
        <div class="left_sidebar">
            <leader-card :leader-card="enemyLeader" />
            <player-stats
                :nickname="enemyNickname"
                :leader="enemyLeader"
                :avatar="enemyAvatar"
                :lives="enemyLives"
                :total-count="enemyTotalCount"
                :fraction="enemyFraction"
                :hand-count="enemyHand.length"
                :is-enemy="true"
                :turn="turn"
            />
            <weather-cards
                @click="weatherCardsClick"
                :weather-cards="weatherCards"
                :place="'weather'"
                :active-card="activeCard"
            />
            <player-stats
                :nickname="playerNickname"
                :leader="playerLeader"
                :avatar="playerAvatar"
                :lives="playerLives"
                :total-count="playerTotalCount"
                :fraction="playerFraction"
                :hand-count="hand.length"
                :turn="turn"
            />
            <leader-card :leader-card="playerLeader" />
        </div>
        <div class="center">
            <game-field
                @frontRowClick="rowClick('front')"
                @midRowClick="rowClick('mid')"
                @backRowClick="rowClick('back')"
                @enemyFrontRowClick="rowClick('front', true)"
                @enemyMidRowClick="rowClick('mid', true)"
                @enemyBackRowClick="rowClick('back', true)"
                @cardRowClicked="cardInRowClicked"
                @extraCageClick="extraCageClick"
                @playerTotalValue="getPlayerTotalValue"
                @enemyTotalValue="getEnemyTotalValue"
                :front-row="frontRow"
                :front-row-extra-cage="frontRowExtraCage"
                :mid-row="midRow"
                :mid-row-extra-cage="midRowExtraCage"
                :back-row="backRow"
                :back-row-extra-cage="backRowExtraCage"
                :enemy-front-row="enemyFrontRow"
                :enemy-front-row-extra-cage="enemyFrontRowExtraCage"
                :enemy-mid-row="enemyMidRow"
                :enemy-mid-row-extra-cage="enemyMidRowExtraCage"
                :enemy-back-row="enemyBackRow"
                :enemy-back-row-extra-cage="enemyBackRowExtraCage"
                :weather-cards="weatherCards"
                :active-card="activeCard"
                :place="'field'"
            />
            <div class="hand" ref="hand" :style="{pointerEvents: turn !== 'player' ? 'none' : 'auto'}">
                <cards-group :cards="hand" :place="'hand'" @cardClicked="activateCard" />
            </div>
        </div>
        <div class="right_sidebar">
            <div class="enemy-decks_wrapper">
                <dropped-cards
                    :dropped-cards="enemyDroppedCards"
                    :show-dropped-popup="showEnemyDroppedPopup"
                    :is-enemy="true"
                    @closeEnemyPopup="closePopupMethod(true)"
                    @showEnemyPopup="showPopupMethod(true)"
                    @medicRecoveredCard="medicRecoveredCard"
                />
                <cards-deck :cards-deck="enemyCardsDeck" />
            </div>
            <div class="player-decks_wrapper">
                <dropped-cards
                    :dropped-cards="droppedCards"
                    :show-dropped-popup="showDroppedPopup"
                    :medic="medic"
                    @closePopup="closePopupMethod"
                    @showPopup="showPopupMethod"
                    @medicRecoveredCard="medicRecoveredCard"
                />
                <cards-deck :cards-deck="cardsDeck" />
            </div>
        </div>
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

export default {
  components: { GameField, CardsGroup, CardsDeck, DroppedCards, WeatherCards, LeaderCard, PlayerStats },
  data() {
    return {
      // player data
      playerNickname: 'Геральт',
      playerAvatar: 'src/assets/текстуры/geralt-avatar.jpg',
      playerLives: 2,
      playerTotalCount: 0,
      playerFraction: 'Королевства Севера',
      playerLeader: {
        id: '99',
        name: 'фольтест - предводитель севера',
        src: 'src/assets/Карты гвинт webp/1. Королевства севера/фольтест - предводитель севера.webp',
        role: 'leader'
      },
      frontRow: [],
      frontRowExtraCage: null,
      midRow: [],
      midRowExtraCage: null,
      backRow: [],
      backRowExtraCage: null,
      hand: [],
      droppedCards: [],
      showDroppedPopup: false,
      cardsDeck: [],
      activeCard: null,
      medic: false,
      // enemy data
      enemyNickname: 'Противник',
      enemyAvatar: 'src/assets/текстуры/anonim-avatar.svg',
      enemyLives: 2,
      enemyTotalCount: 0,
      enemyFraction: 'Королевства Севера',
      enemyLeader: {
        id: '98',
        name: 'фольтест - железный владыка',
        src: 'src/assets/Карты гвинт webp/1. Королевства севера/фольтест - железный владыка.webp',
        role: 'leader'
      },
      enemyFrontRow: [],
      enemyFrontRowExtraCage: null,
      enemyMidRow: [],
      enemyMidRowExtraCage: null,
      enemyBackRow: [],
      enemyBackRowExtraCage: null,
      enemyHand: [],
      enemyDroppedCards: [],
      showEnemyDroppedPopup: false,
      enemyCardsDeck: [],
      // common data
      weatherCards: [],
      turn: 'player'
    };
  },
  mounted() {
    fetch('src/assets/колоды json/королевства_севера.json')
      .then(res => res.json())
      .then(data => {
        const allCards = data.sort(() => 0.5 - Math.random());
        this.cardsDeck = allCards.slice(0, 15);
        this.enemyCardsDeck = allCards.slice(15, 30).sort((a, b) => a.id - b.id);
        this.enemyHand = this.enemyCardsDeck.splice(0, 10);
        // const cardsBuffer = this.cardsDeck.splice(0, 10).sort((a, b) => a.id - b.id);
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            this.hand.push(this.cardsDeck.shift());
          }, i * 100);
        }
        setTimeout(() => {
          this.$refs.hand.style.overflowX = 'visible';
          this.hand.sort((a, b) => a.id - b.id);
        }, 1000);
      });
  },
  methods: {
    activateCard(cardClicked) {
      this.unactiveAllCards();
      this.activeCard = cardClicked;
      this.activeCard.active = true;
    },
    unactiveAllCards() {
      this.hand.forEach(card => {
        card.active = false;
      });
      this.activeCard = null;
    },
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
    },
    rowClick(rowType, isEnemy) {
      // Common cards
      if (this.activeCard?.role === rowType && !this.activeCard?.spy && !this.activeCard?.medic && !isEnemy) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[`${rowType}Row`].push(this.activeCard);
        this[`${rowType}Row`].sort((a, b) => a.id - b.id);
        this.enemyTurn();
      }
      // Medic cards
      if (this.activeCard?.role === rowType && this.activeCard?.medic && !isEnemy) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[`${rowType}Row`].push(this.activeCard);
        this[`${rowType}Row`].sort((a, b) => a.id - b.id);
        const recoverCardExist = this.droppedCards.findIndex(card => (card.role === 'front'
          || card.role === 'mid'
          || card.role === 'back') && !card.hero);
        if (recoverCardExist !== -1) {
          this.medic = true;
          this.showDroppedPopup = true;
        }
        this.enemyTurn();
      }
      // spy cards
      if (this.activeCard?.role === rowType && this.activeCard?.spy && isEnemy) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        const rowTypeCapitalFirstLetter = rowType.charAt(0).toUpperCase() + rowType.slice(1);
        this[`enemy${rowTypeCapitalFirstLetter}Row`].push(this.activeCard);
        this[`enemy${rowTypeCapitalFirstLetter}Row`].sort((a, b) => a.id - b.id);
        if (this.cardsDeck.length === 0) return;
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
        this.enemyTurn();
      }
      // Execution cards
      if (this.activeCard?.role === 'execution') {
        this.droppedCards.push(this.activeCard);
        const allCards = this.frontRow.concat(
          this.midRow,
          this.backRow,
          this.enemyFrontRow,
          this.enemyMidRow,
          this.enemyBackRow
        );
        const maxValue = Math.max(...allCards.map(card => {
          if (!card.hero) { return card.computedValue; } return -Infinity;
        }));
        const rowTypes = ['front', 'mid', 'back', 'enemyFront', 'enemyMid', 'enemyBack'];
        rowTypes.forEach(type => {
          this[`${type}Row`] = this[`${type}Row`].filter(card => {
            if (!card.hero && card.computedValue === maxValue
            && (type === 'front' || type === 'mid' || type === 'back')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              this.droppedCards.push(cardToPush);
            }
            if (!card.hero && card.computedValue === maxValue
            && (type === 'enemyFront' || type === 'enemyMid' || type === 'enemyBack')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              this.enemyDroppedCards.push(cardToPush);
            }
            if (!card.hero) { return card.computedValue !== maxValue; } return true;
          });
        });
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this.enemyTurn();
      }
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
      this.enemyTurn();
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
    },
    extraCageClick(cageType) {
      if (!this[cageType]?.id && this.activeCard?.troubadour) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[cageType] = this.activeCard;
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
    enemyTurn() {
      this.turn = 'enemy';
      setTimeout(() => {
        // Search spy card
        let cardToTurn = this.enemyHand.find(card => card.spy);
        if (cardToTurn) {
          this[`${cardToTurn.role}Row`].push(cardToTurn);
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          this.enemyHand.push(...this.enemyCardsDeck.splice(0, 2));
          this.enemyHand.sort((a, b) => a.id - b.id);
          this.turn = 'player';
          return;
        }
        // Search hero card
        cardToTurn = this.enemyHand.find(card => card.hero && !card.medic && card.role !== 'scarecrow');
        if (cardToTurn) {
          const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
          this[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          this.turn = 'player';
          return;
        }
        // Search common card
        cardToTurn = this.enemyHand.find(card => !card.spy && !card.hero && !card.medic
        && card.role !== 'weather' && card.role !== 'execution' && card.role !== 'scarecrow' && card.role !== 'extra');
        if (cardToTurn) {
          const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
          this[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          this.turn = 'player';
          return;
        }
        // Search execution card
        cardToTurn = this.enemyHand.find(card => card.role === 'execution');
        if (cardToTurn) {
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          this.enemyDroppedCards.push(cardToTurn);
          const allCards = this.frontRow.concat(
            this.midRow,
            this.backRow,
            this.enemyFrontRow,
            this.enemyMidRow,
            this.enemyBackRow
          );
          const maxValue = Math.max(...allCards.map(card => {
            if (!card.hero) { return card.computedValue; } return -Infinity;
          }));
          const rowTypes = ['front', 'mid', 'back', 'enemyFront', 'enemyMid', 'enemyBack'];
          rowTypes.forEach(type => {
            this[`${type}Row`] = this[`${type}Row`].filter(card => {
              if (!card.hero && card.computedValue === maxValue
            && (type === 'front' || type === 'mid' || type === 'back')) {
                const cardToPush = JSON.parse(JSON.stringify(card));
                cardToPush.computedValue = card.defaultValue;
                this.droppedCards.push(cardToPush);
              }
              if (!card.hero && card.computedValue === maxValue
            && (type === 'enemyFront' || type === 'enemyMid' || type === 'enemyBack')) {
                const cardToPush = JSON.parse(JSON.stringify(card));
                cardToPush.computedValue = card.defaultValue;
                this.enemyDroppedCards.push(cardToPush);
              }
              if (!card.hero) { return card.computedValue !== maxValue; } return true;
            });
          });
          this.turn = 'player';
        }
        // Search medic card
        cardToTurn = this.enemyHand.find(card => card.medic);
        if (cardToTurn) {
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
          this[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
          const cardToRecover = this.enemyDroppedCards.find(card => !card.hero
          && (card.role === 'front' || card.role === 'mid' || card.role === 'back'));
          if (cardToRecover) {
            this.enemyDroppedCards = this.enemyDroppedCards.filter(card => card.id !== cardToRecover.id);
            this[`${cardToRecover.role.charAt(0).toUpperCase() + cardToRecover.role.slice(1)}Row`].push(cardToRecover);
          }
          this.turn = 'player';
          return;
        }
        // Search extra card
        cardToTurn = this.enemyHand.find(card => card.role === 'extra');
        if (cardToTurn) {
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          if (!this.enemyFrontRowExtraCage) {
            this.enemyFrontRowExtraCage = cardToTurn;
            this.turn = 'player';
            return;
          }
          if (!this.enemyMidRowExtraCage) {
            this.enemyMidRowExtraCage = cardToTurn;
            this.turn = 'player';
            return;
          }
          if (!this.enemyBackRowExtraCage) {
            this.enemyBackRowExtraCage = cardToTurn;
            this.turn = 'player';
            return;
          }
        }
        // Search weather card
        cardToTurn = this.enemyHand.find(card => card.role === 'weather');
        if (cardToTurn && !cardToTurn.clear) {
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          this.weatherCards.push(cardToTurn);
          this.turn = 'player';
          return;
        }
        if (cardToTurn && cardToTurn.clear) {
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          this.weatherCards = [];
          this.enemyDroppedCards.push(cardToTurn);
          this.turn = 'player';
          return;
        }
        // Search scarecrow card
        cardToTurn = this.enemyHand.find(card => card.role === 'scarecrow');
        if (cardToTurn) {
          this.enemyHand = this.enemyHand.filter(card => card.id !== cardToTurn.id);
          this.turn = 'player';
        }
      }, 1000);
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

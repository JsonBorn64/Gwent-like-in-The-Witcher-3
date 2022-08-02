<template>
    <div @click="unactiveAllCards" class="main_wrapper">
        <div class="left_sidebar">
            <div class="enemy_leader">
                <single-card :card="enemyLeader" />
            </div>
            <div class="enemy_stats">
                <div class="avatar">
                    <img src="" alt="">
                </div>
            </div>
            <div class="weather_cards" @click="weatherCardsClick">
                <cards-group :cards="weatherCards" :place="'weather'" />
            </div>
            <div class="player_stats">
                <div class="avatar">
                    <img src="" alt="">
                </div>
            </div>
            <div class="player_leader">
                <single-card :card="playerLeader" />
            </div>
        </div>
        <div class="center">
            <game-field
                @frontRowClick="rowClick('front')"
                @midRowClick="rowClick('mid')"
                @backRowClick="rowClick('back')"
                @cardRowClicked="cardInRowClicked"
                @extraCageClick="extraCageClick"
                :front-row="frontRow"
                :front-row-extra-cage="frontRowExtraCage"
                :mid-row="midRow"
                :mid-row-extra-cage="midRowExtraCage"
                :back-row="backRow"
                :back-row-extra-cage="backRowExtraCage"
                :weather-cards="weatherCards"
                :active-card="activeCard"
                :place="'field'"
            />
            <div class="hand" ref="hand">
                <cards-group :cards="hand" :place="'hand'" @cardClicked="activateCard" />
            </div>
        </div>
        <div class="right_sidebar">
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
import SingleCard from './components/SingleCard.vue';

export default {
  components: { GameField, CardsGroup, CardsDeck, DroppedCards, SingleCard },
  data() {
    return {
      frontRow: [],
      frontRowExtraCage: {},
      midRow: [],
      midRowExtraCage: {},
      backRow: [],
      backRowExtraCage: {},
      weatherCards: [],
      hand: [],
      droppedCards: [],
      showDroppedPopup: false,
      medic: false,
      cardsDeck: [],
      activeCard: null,
      playerLeader: {
        id: '99',
        name: 'фольтест - предводитель севера',
        src: 'src/assets/Карты гвинт webp/1. Королевства севера/фольтест - предводитель севера.webp',
        role: 'leader'
      },
      enemyLeader: {
        id: '98',
        name: 'фольтест - железный владыка',
        src: 'src/assets/Карты гвинт webp/1. Королевства севера/фольтест - железный владыка.webp',
        role: 'leader'
      }
    };
  },
  mounted() {
    fetch('src/assets/колоды json/королевства_севера.json')
      .then(res => res.json())
      .then(data => {
        const allCards = data.sort(() => 0.5 - Math.random());
        this.cardsDeck = allCards.slice(0, 28);
        // const cardsBuffer = this.cardsDeck.splice(0, 10).sort((a, b) => a.id - b.id);
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            this.hand.push(this.cardsDeck.shift());
          }, i * 100);
        }
        setTimeout(() => {
          this.$refs.hand.style.overflowX = 'visible';
          this.hand.sort((a, b) => a.id - b.id);
        }, 2000);
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
      this[`${rowType}Row`] = this[`${rowType}Row`].filter(item => item.id !== card.id);
      this[`${rowType}Row`].unshift(this.activeCard);
      this.activeCard = null;
    },
    rowClick(rowType) {
      // Common cards
      if (this.activeCard?.role === rowType && !this.activeCard?.spy && !this.activeCard?.medic) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[`${rowType}Row`].push(this.activeCard);
        this[`${rowType}Row`].sort((a, b) => a.id - b.id);
      }
      // Medic cards
      if (this.activeCard?.role === rowType && this.activeCard?.medic) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[`${rowType}Row`].push(this.activeCard);
        this[`${rowType}Row`].sort((a, b) => a.id - b.id);
        this.medic = true;
        this.showDroppedPopup = true;
      }
      // Execution cards
      if (this.activeCard?.role === 'execution') {
        const allCards = this.frontRow.concat(this.midRow, this.backRow);
        const maxValue = Math.max(...allCards.map(card => {
          if (!card.hero) { return card.computedValue; } return -Infinity;
        }));
        const rowTypes = ['front', 'mid', 'back'];
        rowTypes.forEach(type => {
          this[`${type}Row`] = this[`${type}Row`].filter(card => {
            if (!card.hero && card.computedValue === maxValue) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              this.droppedCards.push(cardToPush);
            }
            if (!card.hero) { return card.computedValue !== maxValue; } return true;
          });
        });
        this.droppedCards.unshift(this.activeCard);
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
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
        this.weatherCards.forEach(card => {
          this.droppedCards.push(card);
        });
        this.weatherCards = [];
      }
    },
    medicRecoveredCard(card) {
      this.medic = false;
      this.showDroppedPopup = false;
      this.hand.push(card);
      this.droppedCards = this.droppedCards.filter(item => item.id !== card.id);
    },
    extraCageClick(cageType) {
      if (!this[cageType]?.id && this.activeCard?.troubadour) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[cageType] = this.activeCard;
      }
    },
    closePopupMethod() {
      this.showDroppedPopup = false;
    },
    showPopupMethod() {
      this.showDroppedPopup = true;
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
  max-width: 938px;
  height: 100vh;
}

.hand {
  max-width: 918px;
  width: calc(100% - 20px);
  height: 120px;
  margin-bottom: 20px;
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

.player-decks_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
  margin-bottom: 20px;
}

  .left_sidebar {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-right: 20px;
  }

  .weather_cards {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    width: 200px;
    height: 140px;
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 0px 10px 6px rgba(0, 0, 0, 0.6) inset;
  }

  .player_stats, .enemy_stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    border-top: 3px solid black;
    border-bottom: 3px solid black;
  }

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

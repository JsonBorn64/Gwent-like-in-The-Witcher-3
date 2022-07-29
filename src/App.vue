<template>
    <div @click="unactiveAllCards" class="main_wrapper">
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
                :active-card="activeCard"
                :is-hand="false"
            />
            <div class="hand">
                <cards-group :cards="hand" :is-hand="true" @cardClicked="activateCard" />
            </div>
        </div>
        <div class="right_sidebar">
            <div class="player-decks_wrapper">
                <div class="dropped_cards" />
                <div class="deck">
                    <img
                        src="src/assets/Карты гвинт webp/0. Рубашки для карт/Королевства Севера.webp"
                        alt="Королевства Севера"
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GameField from './components/GameField.vue';
import CardsGroup from './components/CardsGroup.vue';

export default {
  components: { GameField, CardsGroup },
  data() {
    return {
      frontRow: [],
      frontRowExtraCage: {},
      midRow: [],
      midRowExtraCage: {},
      backRow: [],
      backRowExtraCage: {},
      hand: [],
      activeCard: null
    };
  },
  mounted() {
    fetch('src/assets/колоды json/королевства_севера.json')
      .then(res => res.json())
      .then(data => {
        const cards = data.sort(() => 0.5 - Math.random());
        this.hand = cards.slice(0, 10).sort((a, b) => a.id - b.id);
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
      if (this.activeCard?.role === rowType && !this.activeCard?.spy) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[`${rowType}Row`].push(this.activeCard);
        this[`${rowType}Row`].sort((a, b) => a.id - b.id);
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
            if (!card.hero) { return card.computedValue !== maxValue; } return true;
          });
        });
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
      }
      // Clear sky cards
      if (this.activeCard?.role === 'clear') {
        const extraCages = ['frontRowExtraCage', 'midRowExtraCage', 'backRowExtraCage'];
        extraCages.forEach(cage => {
          if (!this[cage]?.troubadour) this[cage] = null;
        });
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
      }
    },
    extraCageClick(cageType) {
      if (!this[cageType]?.id && (this.activeCard?.troubadour
        || (this.activeCard?.frost && cageType === 'frontRowExtraCage')
        || (this.activeCard?.haze && cageType === 'midRowExtraCage')
        || (this.activeCard?.rain && cageType === 'backRowExtraCage'))) {
        this.activeCard.active = false;
        this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
        this[cageType] = this.activeCard;
      }
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
  max-width: 960px;
  height: 100vh;
}

.hand {
  max-width: 940px;
  width: calc(100% - 20px);
  height: 120px;
  margin-bottom: 40px;
  box-shadow: 0 -6px 10px 6px rgba(0, 0, 0, 0.4) inset;
}

.right_sidebar {
  width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  margin-left: 10px;
}

.player-decks_wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: 40px;
}

.deck {
  width: 90px;
  height: 170px;
  box-shadow: 0 -6px 10px 6px rgba(0, 0, 0, 0.4) inset;
  & img {
    width: 100%;
    border-radius: 8px;
  }
}

.dropped_cards {
  width: 100px;
  height: 130px;
  align-self: end;
  margin-right: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 6px 10px 6px rgba(0, 0, 0, 0.6) inset;
}
</style>

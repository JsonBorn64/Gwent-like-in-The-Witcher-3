<template>
    <div class="row_wrapper">
        <div class="field_extra-cage" @click="extraCageClick" ref="cage">
            <transition name="fade">
                <single-card
                    v-if="extraCage?.id"
                    :card="extraCage"
                    :place="'cage'"
                    :cards-count="cards.length"
                    :active-card="activeCard"
                />
            </transition>
        </div>
        <div class="field_row" ref="row">
            <cards-group
                @cardClicked="getClickedCard"
                :cards="cards"
                :active-card="activeCard"
                :place="'field'"
            />
        </div>
        <div class="field_total-count">
            {{ rowTotalCount }}
        </div>
    </div>
</template>

<script>
import CardsGroup from './CardsGroup.vue';
import SingleCard from './SingleCard.vue';

export default {
  components: { CardsGroup, SingleCard },
  props: {
    cardsProp: {
      type: Array,
      required: true
    },
    extraCage: {
      type: Object,
      default: null
    },
    weatherCards: {
      type: Array,
      default: () => []
    },
    place: {
      type: String,
      default: 'dropped'
    },
    rowType: {
      type: String,
      required: true
    },
    activeCard: {
      type: Object,
      default: null
    }
  },
  computed: {
    rowTotalCount() {
      this.updateCardComputedValue();
      this.extraCageRoyalHornInflunce();
      let totalResult = 0;
      this.cards.forEach(card => {
        if (card.computedValue) totalResult += card.computedValue;
      });
      this.$emit('rowTotalCount', totalResult, this.rowType);
      return totalResult;
    },
    cards() {
      return this.cardsProp.slice();
    }
  },
  mounted() {
    this.backgroundImg(this.rowType);
  },
  updated() {
    this.showTurnsTips();
    if (this.activeCard?.role === 'scarecrow') {
      this.$refs.row.style.overflow = 'visible';
    } else {
      this.$refs.row.style.overflow = 'hidden';
    }
  },
  methods: {
    updateCardComputedValue() {
      // reset computedValue
      this.cards.forEach(card => {
        if (card.computedValue) card.computedValue = card.defaultValue;
      });
      // Weather influence
      this.weatherInfluence();
      // Handshakes bonus
      this.cards.forEach(card => {
        for (let i = 0; i < this.cards.length; i++) {
          if (this.cards[i].id !== card.id && this.cards[i].name === card.name && this.cards[i].handshake) {
            if (this.weatherCards.findIndex(wCard => (wCard.influence === this.rowType)) !== -1) {
              this.cards[i].computedValue += 1;
            } else {
              this.cards[i].computedValue += this.cards[i].defaultValue;
            }
          }
        }
      });
      // PlusOnePoint bonus
      this.cards.forEach(card => {
        for (let i = 0; i < this.cards.length; i++) {
          if (this.cards[i].id !== card.id && card.plusOnePoint && !this.cards[i].hero) {
            this.cards[i].computedValue += 1;
          }
        }
      });
      // Troubadour bonus
      this.cards.forEach(card => {
        for (let i = 0; i < this.cards.length; i++) {
          if (this.cards[i].id !== card.id && card.troubadour && !this.cards[i].hero) {
            this.cards[i].computedValue *= 2;
            this.cards[i].doubled = true;
          }
        }
      });
    },
    extraCageRoyalHornInflunce() {
      if (this.extraCage?.troubadour) {
        this.cards.forEach(card => {
          if (!card.doubled && !card.hero) card.computedValue *= 2;
        });
      }
    },
    weatherInfluence() {
      this.weatherCards.forEach(weatherCard => {
        if ((weatherCard?.frost && this.rowType === 'front')
        || (weatherCard?.haze && this.rowType === 'mid')
        || (weatherCard?.rain && this.rowType === 'back')) {
          this.cards.forEach(card => {
            if (!card.hero) card.computedValue = 1;
          });
        }
      });
    },
    extraCageClick() {
      this.$emit('extraCageClick', `${this.rowType}RowExtraCage`);
    },
    backgroundImg(rowType) {
      const { row } = this.$refs;
      if (rowType === 'front') row.style.background = 'url("src/assets/текстуры/sword.svg") center no-repeat';
      if (rowType === 'mid') row.style.background = 'url("src/assets/текстуры/bow.svg") center no-repeat';
      if (rowType === 'back') row.style.background = 'url("src/assets/текстуры/balista.svg") center no-repeat';
    },
    getClickedCard(card) {
      this.$emit('cardClicked', card, this.rowType);
    },
    showTurnsTips() {
      const defaultShadow = '0 0 0 transparent, 0 -16px 30px 0px #00000099 inset';
      const yellowShadow = '0 0 4px 2px #A07F33, 0 -16px 30px 0px #00000099 inset';
      if (this.activeCard?.role === this.rowType && !this.activeCard?.spy) {
        this.$refs.row.style.boxShadow = yellowShadow;
        this.$refs.cage.style.boxShadow = defaultShadow;
      } else if (this.activeCard?.role === 'extra' && !this.extraCage?.id) {
        this.$refs.cage.style.boxShadow = yellowShadow;
        this.$refs.row.style.boxShadow = defaultShadow;
      } else if (this.activeCard?.role === 'execution') {
        this.$refs.row.style.boxShadow = yellowShadow;
        this.$refs.cage.style.boxShadow = defaultShadow;
      } else if (this.activeCard?.role === 'clear') {
        this.$refs.row.style.boxShadow = yellowShadow;
        this.$refs.cage.style.boxShadow = yellowShadow;
      } else {
        this.$refs.row.style.boxShadow = defaultShadow;
        this.$refs.cage.style.boxShadow = defaultShadow;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.row_wrapper {
    display: flex;
    width: 100%;
    position: relative;

    &>div:not(:last-child) {
        box-shadow: 0 0 0 transparent, 0 -16px 30px 0px #00000099 inset;
        background-color: rgba(0, 0, 0, 0.1) !important;
        box-sizing: border-box;
        transition: box-shadow 300ms;
    }
}

.field_total-count {
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: #A07F33;
    border-radius: 50%;
    height: 34px;
    width: 34px;
    top: 50%;
    transform: translateY(-50%);
    left: -16px;
    font-weight: 400;
    color: black;
    text-shadow: 0 0 3px white;
    box-shadow: 0 0 10px black;
}

.field_extra-cage {
    display: flex;
    justify-content: center;
    min-width: 120px;
    margin-right: 5px;
    text-align: center;
    background: url("src/assets/текстуры/dudka.svg") center no-repeat;
    background-size: 110px;
    overflow: hidden;
}

.field_row {
    width: 100%;
    height: 120px;
    background-size: 110px !important;
    overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

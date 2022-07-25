<template>
    <div class="row_wrapper">
        <div class="field_extra-cage" @click="extraCageClick">
            <Card :card="extraCage" :isHand="isHand" :isCage="true" :cardsCount="cards.length" />
        </div>
        <div class="field_row" ref="row">
            <CardsGroup @cardClicked="getClickedCardId" :cards="cards" :scarecrowActive="scarecrowActive" :isHand="isHand" />
        </div>
        <div class="field_total-count">{{ rowTotalCount }}</div>
    </div>
</template>

<script>
import CardsGroup from './CardsGroup.vue';
import Card from './Card.vue';
export default {
    components: { CardsGroup, Card },
    props: {
        cards: {
            type: Array,
            required: true,
        },
        extraCage: {
            type: Object,
            default: {},
        },
        isHand: {
            type: Boolean,
            required: false,
        },
        rowType: {
            type: String,
            required: true,
        },
        scarecrowActive: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        rowTotalCount() {
            this.updateCardComputedValue();
            this.extraCageRoyalHornInflunce();
            let totalResult = 0;
            this.cards.forEach(card => {
                totalResult += card.computedValue;
            });
            this.$emit("rowTotalCount", totalResult, this.rowType);
            return totalResult;
        },
    },
    methods: {
        updateCardComputedValue() {
            // reset computedValue
            this.cards.forEach(card => {
                card.computedValue = card.defaultValue;
            });
            // Weather influence
            this.extraCageWeatherInflunce()
            // Handshakes bonus
            this.cards.forEach(card => {
                for (let i = 0; i < this.cards.length; i++) {
                    if (this.cards[i].id !== card.id && this.cards[i].name === card.name && this.cards[i].handshake) {
                        if (this.extraCage.role == 'weather') {
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
            if (this.extraCage.troubadour) {
                this.cards.forEach(card => {
                    if (!card.doubled && !card.hero) card.computedValue *= 2;
                });
            }
        },
        extraCageWeatherInflunce() {
            if (this.extraCage.frost || this.extraCage.haze || this.extraCage.rain) {
                this.cards.forEach(card => {
                    if (!card.hero) card.computedValue = 1;
                });
            }
        },
        extraCageClick() {
            this.$emit("extraCageClick", this.rowType + "RowExtraCage");
        },
        backgroundImg(rowType) {
            const row = this.$refs.row
            if (rowType == 'front') row.style.background = 'url("src/assets/текстуры/sword.svg") center no-repeat'
            if (rowType == 'mid') row.style.background = 'url("src/assets/текстуры/bow.svg") center no-repeat'
            if (rowType == 'back') row.style.background = 'url("src/assets/текстуры/balista.svg") center no-repeat'
        },
        getClickedCardId(cardId) {
            this.$emit("cardClicked", cardId, this.rowType);
        },
    },
    mounted() {
        this.backgroundImg(this.rowType)
    },
    updated() {
        if (this.scarecrowActive) {
            this.$refs.row.style.overflow = 'visible';
        } else {
            this.$refs.row.style.overflow = 'hidden';
        }
    }
}
</script>

<style lang="scss" scoped>
.row_wrapper {
    display: flex;
    width: 100%;
    position: relative;

    &>div:not(:last-child) {
        box-shadow: 0 -16px 30px 0px rgba(0, 0, 0, 0.6) inset;
        box-sizing: border-box;
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
    min-width: 125px;
    margin-right: 5px;
    text-align: center;
    background: url("src/assets/текстуры/dudka.svg") center no-repeat;
    background-size: 110px;
}

.field_row {
    width: 100%;
    height: 120px;
    background-size: 110px !important;
    overflow: hidden;
}
</style>
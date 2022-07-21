<template>
    <div class="row_wrapper">
        <div class="field_total-count">{{ rowTotalCount }}</div>
        <div class="field_extra-cage" @click="extraCageClick" >
            <Card :card="extraCage" :isHand="isHand" :cardsCount="cards.length" />
        </div>
        <div class="field_row" ref="fieldRow">
            <CardsGroup :cards="cards" :isHand="isHand" />
        </div>
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
    },
    computed: {
        rowTotalCount() {
            this.updateCardComputedValue();
            this.extraCageInflunce();
            let totalResult = 0;
            this.cards.forEach(card => {
                totalResult += card.computedValue;
            });
            this.$emit("rowTotalCount", totalResult, this.rowType);
            return totalResult;
        },
    },
    methods: {
        getFieldRowWidth() {
            this.fieldRowWidth = this.refs.fieldRow.style.clientWidth;
        },
        updateCardComputedValue() {
            // reset computedValue
            this.cards.forEach(card => {
                card.computedValue = card.defaultValue;
            });
            // Handshakes bonus
            this.cards.forEach(card => {
                for (let i = 0; i < this.cards.length; i++) {
                    if (this.cards[i].id !== card.id && this.cards[i].name === card.name && this.cards[i].handshake) {
                        this.cards[i].computedValue += this.cards[i].defaultValue;
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
        extraCageInflunce() {
            if (this.extraCage.troubadour) {
                this.cards.forEach(card => {
                    if (!card.doubled) card.computedValue *= 2;
                });
            }
        },
        extraCageClick() {
            this.$emit("extraCageClick", this.rowType);
        },
    },
}
</script>

<style lang="scss" scoped>
.row_wrapper {
    display: flex;
    width: 100%;

    &>div {
        background-color: #290D02;
    }
}

.field_total-count {
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 10px auto 0;
    border-radius: 50%;
    min-width: 38px;
    height: 38px;
    line-height: 0;
}

.field_extra-cage {
    display: flex;
    justify-content: center;
    min-width: 90px;
    box-sizing: border-box;
    height: 125px;
    margin-right: 10px;
    text-align: center;
}

.field_row {
    width: 100%;
    height: 125px;
    overflow: hidden;
}
</style>
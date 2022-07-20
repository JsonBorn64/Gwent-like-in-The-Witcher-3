<template>
    <div class="row_wrapper">
        <div class="field_total-count">{{ rowTotalCount }}</div>
        <div class="field_extra-cage">
            <Card :card="frontRowExtraCage" :isHand="isHand" :cardsCount="cards.length" />
        </div>
        <div class="field_row">
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
        frontRowExtraCage: {
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
            // Handshakes bonus
            this.cards.forEach(card => {
                for (let i = 0; i < this.cards.length; i++) {
                    if (this.cards[i].name === card.name && this.cards[i].id !== card.id && this.cards[i].handshake) {
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
                    }
                }
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.row_wrapper {
    display: flex;

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
    width: 38px;
    height: 38px;
    line-height: 0;
}

.field_extra-cage {
    display: flex;
    justify-content: center;
    width: 130px;
    height: 125px;
    margin-right: 10px;
    text-align: center;
}

.field_row {
    width: 810px;
    height: 125px;
    overflow: hidden;
}
</style>
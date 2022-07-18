<template>
    <div class="row_wrapper">
        <div class="field_total-count">{{ rowTotalCount }}</div>
        <!-- <div class="field_extra-cage"></div> -->
        <div class="field_row">
            <CardsGroup :cards="cards" :isHand="isHand" />
        </div>
    </div>
</template>

<script>
import CardsGroup from './CardsGroup.vue';
export default {
    components: { CardsGroup },
    props: {
        cards: {
            type: Array,
            required: true,
        },
        isHand: {
            type: Boolean,
            required: false,
        },
    },
    computed: {
        rowTotalCount() {
            this.updateCardComputedValue();
            let totalResult = 0;
            this.cards.forEach(card => {
                totalResult += card.computedValue;
            });
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
                        this.cards[i].computedValue *= 2;
                    }
                }
            });
            // PlusOnePoint bonus
            this.cards.forEach(card => {
                for (let i = 0; i < this.cards.length; i++) {
                    if (this.cards[i].id !== card.id && card.plusOnePoint) {
                        this.cards[i].computedValue += 1;
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
    width: 100px;
    height: 190px;
    border: 1px solid;
    margin-right: 10px;
}

.field_row {
    width: 810px;
    height: 125px;
    overflow: hidden;
}
</style>
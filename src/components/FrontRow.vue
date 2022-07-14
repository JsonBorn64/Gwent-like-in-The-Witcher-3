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
            let relativeCards = this.cards.filter(card => card.relative);
            relativeCards.forEach(card => {
                for (let i = 0; i < relativeCards.length; i++) {
                    if (relativeCards[i].name === card.name && relativeCards[i].id !== card.id) {
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
        background-color: rgb(226, 200, 152);
    }
}

.field_total-count {
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 10px auto 0;
    border: 1px solid;
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
    width: 790px;
    height: 130px;
    border: 1px solid;
    overflow: hidden;
}
</style>
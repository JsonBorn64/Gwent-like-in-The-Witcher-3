<template>
    <div class="row_wrapper">
        <div class="field_total-count">{{ rowTotalCount }}</div>
        <div class="field_extra-cage"></div>
        <div class="field_row">
            <CardsGroup :cards="cards" />
        </div>
    </div>
</template>

<script>
import CardsGroup from './CardsGroup.vue';
export default {
    props: {
        card: {
            type: Object,
            // required: true,
        },
    },
    data() {
        return {
            cards: [{
                id: 1,
                name: "гребанная пехтура",
                src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - гребанная пехтура.webp",
                defaultValue: 1,
                computedValue: 1,
                fixed: false,
                role: "front",
                active: false,
                relative: true,
                spy: false,
                plusOnePoint: false,
            },
            {
                id: 2,
                name: "гребанная пехтура",
                src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - гребанная пехтура.webp",
                defaultValue: 1,
                computedValue: 1,
                fixed: false,
                role: "front",
                active: false,
                relative: true,
                spy: false,
                plusOnePoint: false,
            },
            {
                id: 12,
                name: "боец синих полосок",
                src: "src/assets/Карты гвинт webp/1. Королевства севера/4 - боец синих полосок.webp",
                defaultValue: 4,
                computedValue: 4,
                fixed: false,
                role: "front",
                active: false,
                relative: true,
                spy: false,
                plusOnePoint: false,
            },],
        };
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
    components: { CardsGroup }
}
</script>

<style lang="scss" scoped>
.row_wrapper {
    display: flex;
    pointer-events: none;

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
    height: 190px;
    border: 1px solid;
    overflow: hidden;
}
</style>
<template>
    <div @click="unactiveAllCards" class="main_wrapper">

        <GameField
            @frontRowClick="rowClick('front')"
            @midRowClick="rowClick('mid')"
            @backRowClick="rowClick('back')"
            @cardRowClicked="cardInRowClicked"
            @extraCageClick="extraCageClick"
            :frontRow="frontRow"
            :frontRowExtraCage="frontRowExtraCage"
            :midRow="midRow"
            :midRowExtraCage="midRowExtraCage"
            :backRow="backRow"
            :backRowExtraCage="backRowExtraCage"
            :activeCard="activeCard"
            :isHand="false"
        />
        <div class="hand">
            <CardsGroup :cards="hand" :isHand="true" @cardClicked="activateCard" />
        </div>

    </div>
</template>


<script>
import GameField from "./components/GameField.vue";
import CardsGroup from "./components/CardsGroup.vue";
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
            activeCard: null,
        };
    },
    methods: {
        activateCard(cardClicked) {
            this.unactiveAllCards()
            this.activeCard = cardClicked
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
            this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
            getBackCard.computedValue = getBackCard.defaultValue;
            this.hand.push(getBackCard)
            this[`${rowType}Row`] = this[`${rowType}Row`].filter(item => item.id !== card.id);
            this[`${rowType}Row`].unshift(this.activeCard)
            this.activeCard = null;
        },
        rowClick(rowType) {
            if (this.activeCard.role === rowType) {
                this.activeCard.active = false;
                this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
                this[`${rowType}Row`].push(this.activeCard);
                this[`${rowType}Row`].sort((a, b) => a.id - b.id);
            }
            if (this.activeCard.role == 'execution') {
                const allCards = this.frontRow.concat(this.midRow, this.backRow);
                const maxValue = Math.max(...allCards.map(card => {
                    if (!card.hero) { return card.computedValue } else { return -Infinity }
                }));
                const rowTypes = ['front', 'mid', 'back']
                rowTypes.forEach(type => {
                    this[`${type}Row`] = this[`${type}Row`].filter(card => {
                        if (!card.hero) { return card.computedValue !== maxValue} else { return true }
                    });
                });
                this.activeCard.active = false;
                this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
            }
            if (this.activeCard.role == 'clear') {
                const extraCages = ['frontRowExtraCage', 'midRowExtraCage', 'backRowExtraCage'];
                extraCages.forEach(cage => {
                    if (!this[cage].troubadour) this[cage] = {}
                });
                this.activeCard.active = false;
                this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
            }
        },
        extraCageClick(cageType) {
            if (this.activeCard.troubadour && !this[cageType].id) {
                this.activeCard.active = false;
                this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
                this[cageType] = this.activeCard
            }
            if (this.activeCard.frost && cageType == 'frontRowExtraCage' && !this[cageType].id) {
                this.activeCard.active = false;
                this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
                this[cageType] = this.activeCard
            }
            if (this.activeCard.haze && cageType == 'midRowExtraCage' && !this[cageType].id) {
                this.activeCard.active = false;
                this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
                this[cageType] = this.activeCard
            }
            if (this.activeCard.rain && cageType == 'backRowExtraCage' && !this[cageType].id) {
                this.activeCard.active = false;
                this.hand = this.hand.filter(card => this.activeCard.id !== card.id);
                this[cageType] = this.activeCard
            }
        },
    },
    mounted() {
        fetch("src/assets/колоды json/королевства_севера.json")
            .then(res => res.json())
            .then(data => {
                let cards = data.sort(() => 0.5 - Math.random());
                this.hand = cards.slice(0, 18).sort((a, b) => a.id - b.id);
            });
    },
}
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&display=swap');

.main_wrapper {
    background-color: #3D200C;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Oswald', sans-serif;
    min-height: 100vh;
    background: url("src/assets/текстуры/1579847875_43-p-tekstura-dereva-75.webp") center/cover no-repeat;
}

.hand {
    max-width: 940px;
    width: calc(100% - 20px);
    height: 120px;
    margin-bottom: 40px;
    box-shadow: 0 -6px 10px 6px rgba(0, 0, 0, 0.4) inset;
}
</style>

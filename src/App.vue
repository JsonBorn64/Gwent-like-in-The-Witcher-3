<template>
    <div @click="unactiveAllCards" class="main_wrapper">

        <GameField @frontRowClick="rowClick('front')" @midRowClick="rowClick('mid')" @backRowClick="rowClick('back')"
            @cardRowClicked="cardInRowClicked" :frontRow="frontRow" :frontRowExtraCage="frontRowExtraCage"
            :midRow="midRow" :midRowExtraCage="midRowExtraCage" :backRow="backRow" :backRowExtraCage="backRowExtraCage"
            :scarecrowActive="scarecrowActive" @extraCageClick="extraCageClick" :isHand="false" />
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
            scarecrowActive: false,
        };
    },
    methods: {
        activateCard(cardClickedId) {
            this.unactiveAllCards()
            this.hand.find(card => card.id === cardClickedId).active = true;
            if (cardClickedId == -15 || cardClickedId == -16 || cardClickedId == -17) {
                this.scarecrowActive = true;
            }
        },
        cardInRowClicked(cardId, rowType) {
            const activeCard = this.hand.find(card => card.active === true);
            const getBackCard = this[`${rowType}Row`].find(card => card.id === cardId);
            this.hand.find(card => card.id === activeCard.id).active = false;
            this.hand = this.hand.filter(card => activeCard.id !== card.id);
            getBackCard.computedValue = getBackCard.defaultValue;
            this.hand.push(getBackCard)
            this[`${rowType}Row`] = this[`${rowType}Row`].filter(card => cardId !== card.id);
            this[`${rowType}Row`].unshift(activeCard)
            this.scarecrowActive = false;
        },
        unactiveAllCards() {
            this.hand.forEach(card => {
                card.active = false;
            });
            this.activeCard = null;
            this.scarecrowActive = false;
        },
        rowClick(rowType) {
            const activeCard = this.hand.find(card => card.active === true);
            if (activeCard && activeCard.role === rowType) {
                this.hand.find(card => card.id === activeCard.id).active = false;
                this.hand = this.hand.filter(card => activeCard.id !== card.id);
                this[`${rowType}Row`].push(activeCard);
                this[`${rowType}Row`].sort((a, b) => a.id - b.id);
            }
            if (activeCard && activeCard.role == 'execution') {
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
                this.hand.find(card => card.id === activeCard.id).active = false;
                this.hand = this.hand.filter(card => activeCard.id !== card.id);
            }
            if (activeCard && activeCard.role == 'clear') {
                const extraCages = ['frontRowExtraCage', 'midRowExtraCage', 'backRowExtraCage'];
                extraCages.forEach(cage => {
                    if (!this[cage].troubadour) this[cage] = {}
                });
                this.hand.find(card => card.id === activeCard.id).active = false;
                this.hand = this.hand.filter(card => activeCard.id !== card.id);
            }
        },
        extraCageClick(cageType) {
            const activeCard = this.hand.find(card => card.active === true);
            if (activeCard && activeCard.troubadour && !this[cageType].id) {
                this.hand.find(card => card.id === activeCard.id).active = false;
                this.hand = this.hand.filter(card => activeCard.id !== card.id);
                this[cageType] = activeCard
            }
            if (activeCard && activeCard.frost && cageType == 'frontRowExtraCage' && !this[cageType].id) {
                this.hand.find(card => card.id === activeCard.id).active = false;
                this.hand = this.hand.filter(card => activeCard.id !== card.id);
                this[cageType] = activeCard
            }
            if (activeCard && activeCard.haze && cageType == 'midRowExtraCage' && !this[cageType].id) {
                this.hand.find(card => card.id === activeCard.id).active = false;
                this.hand = this.hand.filter(card => activeCard.id !== card.id);
                this[cageType] = activeCard
            }
            if (activeCard && activeCard.rain && cageType == 'backRowExtraCage' && !this[cageType].id) {
                this.hand.find(card => card.id === activeCard.id).active = false;
                this.hand = this.hand.filter(card => activeCard.id !== card.id);
                this[cageType] = activeCard
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

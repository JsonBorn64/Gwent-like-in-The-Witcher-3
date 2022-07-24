<template>
    <div @click="unactiveAllCards" class="main_wrapper">

        <GameField @frontRowClick="rowClick('front')" @midRowClick="rowClick('mid')" @backRowClick="rowClick('back')"
            :frontRow="frontRow" :frontRowExtraCage="frontRowExtraCage" :midRow="midRow"
            :midRowExtraCage="midRowExtraCage" :backRow="backRow" :backRowExtraCage="backRowExtraCage" @extraCageClick="extraCageClick" 
            :isHand="false" />
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
        };
    },
    methods: {
        activateCard(cardClickedId) {
            this.unactiveAllCards()
            this.hand.find(item => item.id === cardClickedId).active = true;
            this.activeCard = cardClickedId;
        },
        unactiveAllCards() {
            this.hand.forEach(item => {
                item.active = false;
            });
            this.activeCard = null;
        },
        rowClick(rowType) {
            const activeCard = this.hand.find(item => item.active === true);
            if (activeCard && activeCard.role === rowType) {
                this.hand.find(item => item.id === activeCard.id).active = false;
                this.hand = this.hand.filter(item => activeCard.id !== item.id);
                this[`${rowType}Row`].push(activeCard);
                this[`${rowType}Row`].sort((a, b) => a.id - b.id);
            }
        },
        extraCageClick(cageType) {
            let activeCard = this.hand.find(item => item.active === true);
            if (activeCard && activeCard.role === "extra" && !this[cageType].id) {
                this.hand.find(item => item.id === activeCard.id).active = false;
                this.hand = this.hand.filter(item => activeCard.id !== item.id);
                this[cageType] = activeCard
            }
        },
    },
    mounted() {
        fetch("src/assets/колоды json/королевства_севера.json")
            .then(res => res.json())
            .then(data => {
                let cards = data.sort((a, b) => 0.5 - Math.random());
                this.hand = cards.slice(0, 12).sort((a, b) => a.id - b.id);
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

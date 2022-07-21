<template>
    <div @click="unactiveAllCards" class="main_wrapper">

        <GameField @frontRowClick="frontRowClick" @midRowClick="midRowClick" @backRowClick="backRowClick"
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
        frontRowClick() {
            let activeCard = this.hand.find(item => item.active === true);
            if (activeCard && activeCard.role === "front") {
                this.hand.find(item => item.id === activeCard.id).active = false;
                this.hand = this.hand.filter(item => activeCard.id !== item.id);
                this.frontRow.push(activeCard);
            }
            this.frontRow.sort((a, b) => a.id - b.id);
        },
        midRowClick() {
            let activeCard = this.hand.find(item => item.active === true);
            if (activeCard && activeCard.role === "mid") {
                this.hand.find(item => item.id === activeCard.id).active = false;
                this.hand = this.hand.filter(item => activeCard.id !== item.id);
                this.midRow.push(activeCard);
            }
            this.midRow.sort((a, b) => a.id - b.id);
        },
        backRowClick() {
            let activeCard = this.hand.find(item => item.active === true);
            if (activeCard && activeCard.role === "back") {
                this.hand.find(item => item.id === activeCard.id).active = false;
                this.hand = this.hand.filter(item => activeCard.id !== item.id);
                this.backRow.push(activeCard);
            }
            this.backRow.sort((a, b) => a.id - b.id);
        },
        extraCageClick(rowType) {
            let activeCard = this.hand.find(item => item.active === true);
            if (activeCard && activeCard.role === "extra" && !this.frontRowExtraCage.id) {
                this.hand.find(item => item.id === activeCard.id).active = false;
                this.hand = this.hand.filter(item => activeCard.id !== item.id);
                if (rowType == 'front') this.frontRowExtraCage = activeCard;
                if (rowType == 'mid') this.midRowExtraCage.push(activeCard);
                if (rowType == 'back') this.backRowExtraCage.push(activeCard);
            }
        },
    },
    mounted() {
        fetch("src/assets/колоды json/королевства_севера.json")
            .then(res => res.json())
            .then(data => {
                let cards = data.sort((a, b) => 0.5 - Math.random());
                this.hand = cards.slice(0, 10).sort((a, b) => a.id - b.id);
            });
    },
}
</script>


<style lang="scss" scoped>
.main_wrapper {
    background-color: #3D200C;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;
    min-height: 100vh;
}

.hand {
    max-width: 920px;
    width: calc(100% - 20px);
    height: 125px;
    margin-top: auto;
    margin-bottom: 40px;
    background-color: #290D02;
}
</style>

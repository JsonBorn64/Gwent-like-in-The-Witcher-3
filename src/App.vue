<template>
    <div @click="unactiveAllCards" class="main_wrapper">

        <GameField @frontRowClick="frontRowClick" :frontRow="frontRow" :isHand="false" />
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
            hand: [
                {
                    id: 1,
                    name: "гребанная пехтура",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - гребанная пехтура.webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
                    handshake: true,
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
                    handshake: true,
                    spy: false,
                    plusOnePoint: false,
                },
                {
                    id: 3,
                    name: "каэвенский осадной мастер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - каэвенский осадной мастер (1).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "back",
                    active: false,
                    handshake: false,
                    spy: false,
                    plusOnePoint: true,
                },
                {
                    id: 4,
                    name: "каэвенский осадной мастер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - каэвенский осадной мастер (2).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "back",
                    active: false,
                    handshake: false,
                    spy: false,
                    plusOnePoint: true,
                },
                {
                    id: 5,
                    name: "каэвенский осадной мастер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - каэвенский осадной мастер (3).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "back",
                    active: false,
                    handshake: false,
                    spy: false,
                    plusOnePoint: true,
                },
                {
                    id: 6,
                    name: "реданский пехотинец",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - реданский пехотинец (1).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
                    handshake: false,
                    spy: false,
                    plusOnePoint: false,
                },
                {
                    id: 7,
                    name: "реданский пехотинец",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - реданский пехотинец (2).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
                    handshake: false,
                    spy: false,
                    plusOnePoint: false,
                },
                {
                    id: 8,
                    name: "талер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - талер.webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "back",
                    active: false,
                    handshake: false,
                    spy: true,
                    plusOnePoint: false,
                },
                {
                    id: 9,
                    name: "ярпен зигрин",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/2 - ярпен зигрин.webp",
                    defaultValue: 2,
                    computedValue: 2,
                    fixed: false,
                    role: "front",
                    active: false,
                    handshake: false,
                    spy: false,
                    plusOnePoint: false,
                },
                {
                    id: 10,
                    name: "боец синих полосок",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/4 - боец синих полосок.webp",
                    defaultValue: 4,
                    computedValue: 4,
                    fixed: false,
                    role: "front",
                    active: false,
                    handshake: true,
                    spy: false,
                    plusOnePoint: false,
                },
                {
                    id: 11,
                    name: "боец синих полосок",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/4 - боец синих полосок.webp",
                    defaultValue: 4,
                    computedValue: 4,
                    fixed: false,
                    role: "front",
                    active: false,
                    handshake: true,
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
                    handshake: true,
                    spy: false,
                    plusOnePoint: false,
                },
            ],
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
            setTimeout(() => {
                this.frontRow.sort((a, b) => a.id - b.id);
                // this.frontRow.sort((a, b) => a.computedValue - b.computedValue);
            }, 300);
        },
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
    width: 950px;
    height: 125px;
    margin-top: auto;
    margin-bottom: 40px;
    background-color: #290D02;
}
</style>

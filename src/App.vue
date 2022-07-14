<template>
    <div @click="unactiveAllCards" class="main_wrapper">

        <GameField :frontRow="frontRow" :isHand="false" />
        <div class="hand">
            <CardsGroup :cards="hand" :isHand="true" @cardClicked="activeCard" />
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
            frontRow: [{
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
                },],
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
                    id: 3,
                    name: "каэвенский осадной мастер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - каэвенский осадной мастер (1).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "back",
                    active: false,
                    relative: false,
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
                    relative: false,
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
                    relative: false,
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
                    relative: false,
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
                    relative: false,
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
                    relative: false,
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
                    relative: false,
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
                    relative: true,
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
                },
            ]
        };
    },
    methods: {
        activeCard(cardClickedId) {
            this.unactiveAllCards() 
            this.hand.find(item => item.id === cardClickedId)
            .active = true;
            // this.hand = this.hand.filter(item => item.id !== cardClickedId);
        },
        unactiveAllCards() {
            this.hand.forEach(item => {
                item.active = false;
            });
            this.addCard()
        },
        addCard() {
            this.card = this.hand[1];
            this.card = {};
        }
    },
}
</script>


<style lang="scss" scoped>
.main_wrapper {
    background-color: wheat;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;
    min-height: 100vh;
}

.hand {
    width: 970px;
    margin-top: auto;
    margin-bottom: 40px;
}
</style>

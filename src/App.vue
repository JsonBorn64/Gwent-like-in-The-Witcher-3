<template>
    <div @click="unactiveAllCards" class="wrapper">

        <GameField />
        <Hand :hand="hand" @cardClicked="activeCard" />

    </div>
</template>


<script>
import GameField from "./components/GameField.vue";
import Hand from "./components/Hand.vue";
export default {
    components: { GameField, Hand },
    data() {
        return {
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
                },
                {
                    id: 3,
                    name: "каэвенский осадной мастер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - каэвенский осадной мастер (1).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
                },
                {
                    id: 4,
                    name: "каэвенский осадной мастер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - каэвенский осадной мастер (2).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
                },
                {
                    id: 5,
                    name: "каэвенский осадной мастер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - каэвенский осадной мастер (3).webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
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
                },
                {
                    id: 8,
                    name: "талер",
                    src: "src/assets/Карты гвинт webp/1. Королевства севера/1 - талер.webp",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
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
                },
            ]
        };
    },
    methods: {
        activeCard(cardClickedId) {
            this.unactiveAllCards() 
            this.hand.find(item => item.id === cardClickedId)
            .active = true;
        },
        unactiveAllCards() {
            this.hand.forEach(item => {
                item.active = false;
            });
        },
    }
}
</script>


<style lang="scss">
body {
    background-color: wheat;
    font-family: sans-serif;
    overflow-x: hidden;
}

.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}
</style>

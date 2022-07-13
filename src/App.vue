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
}

.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}
</style>

<template>
    <div @click="unactiveAllCards" class="wrapper">

        <GameField />
        <Hand :hand="hand" @cardClicked="activeCard" />

    </div>
</template>


<script>
import { createConditionalExpression } from "@vue/compiler-core";
import GameField from "./components/GameField.vue";
import Hand from "./components/Hand.vue";
export default {
    components: { GameField, Hand },
    data() {
        return {
            hand: [
                {
                    id: 1,
                    name: "Фермер",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
                },
                {
                    id: 2,
                    name: "Фермер",
                    defaultValue: 1,
                    computedValue: 1,
                    fixed: false,
                    role: "front",
                    active: false,
                },
                {
                    id: 3,
                    name: "Сабрина",
                    defaultValue: 4,
                    computedValue: 4,
                    fixed: false,
                    role: "front",
                    active: false,
                },
                {
                    id: 4,
                    name: "Вильгефорц",
                    defaultValue: 7,
                    computedValue: 7,
                    fixed: false,
                    role: "front",
                    active: false,
                }
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
}
</style>

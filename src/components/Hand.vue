<template>
    <div class="hand">
        <Card
        v-for="card in hand"
        :key="card.id"
        :card="card"
        @cardClicked="getClickedCardId"
        />
    </div>
</template>

<script>
import Card from "./Card.vue";
export default {
    components: { Card },
    props: {
        hand: {
            type: Array,
            required: true,
        },
    },
    methods: {
        getClickedCardId(clickedCardId) {
            this.$emit("cardClicked", clickedCardId);
        },
    },
}
</script>

<style lang="scss">
.hand {
    position: absolute;
    display: flex;
    gap: 4px;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
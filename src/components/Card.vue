<template>
    <div @click="getClickedCardId" :class="{active: card.active}" class="card">
        <div>{{ card.name }}</div>
        <div class="card_value">{{ card.computedValue }}</div>
        <div class="card_role">{{ card.role }}</div>
    </div>
</template>

<script>
export default {
    props: {
        card: {
            type: Object,
            required: true,
        },
    },
    methods: {
        getClickedCardId() {
            this.$emit("cardClicked", this.card.id);
        },
    },
}
</script>

<style lang="scss">
.card {
    width: 100px;
    height: 150px;
    background-color: rgb(184, 171, 136);
    border: 2px solid;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    display: flex;
    flex-direction: column;
    transition: 300ms;
    position: relative;
    cursor: pointer;

    &:hover {
        transform: translateY(-16px);
    }

    & .card_value {
        position: absolute;
        top: 0px;
        left: 10px;
        transform: translateX(-50%);
        font-size: 22px;
    }

    & .card_role {
        position: absolute;
        top: 0px;
        right: 0;
        font-size: 14px;
    }
}

.active {
    bottom: 300px;
}
</style>
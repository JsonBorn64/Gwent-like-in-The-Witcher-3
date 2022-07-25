<template>
    <div class="player_field">
        <Row @click="frontRowClick" @rowTotalCount="fieldTotalCount" @cardClicked="cardRowClicked" :cards="frontRow"
            :extraCage="frontRowExtraCage" @extraCageClick="extraCageClick" :rowType="'front'" :scarecrowActive="scarecrowActive" :isHand="isHand" />
        <Row @click="midRowClick" @rowTotalCount="fieldTotalCount" @cardClicked="cardRowClicked" :cards="midRow" :extraCage="midRowExtraCage"
            @extraCageClick="extraCageClick" :rowType="'mid'" :scarecrowActive="scarecrowActive" :isHand="isHand" />
        <Row @click="backRowClick" @rowTotalCount="fieldTotalCount" @cardClicked="cardRowClicked" :cards="backRow" :extraCage="backRowExtraCage"
            @extraCageClick="extraCageClick" :rowType="'back'" :scarecrowActive="scarecrowActive" :isHand="isHand" />
        <div class="total_field_count">{{ total }}</div>
    </div>
</template>


<script>
import Row from './Row.vue';
export default {
    components: { Row },
    props: {
        frontRow: {
            type: Array,
            required: true,
        },
        frontRowExtraCage: {
            type: Object,
            default: {},
        },
        midRow: {
            type: Array,
            required: true,
        },
        midRowExtraCage: {
            type: Object,
            default: {},
        },
        backRow: {
            type: Array,
            required: true,
        },
        backRowExtraCage: {
            type: Object,
            default: {},
        },
        isHand: {
            type: Boolean,
            required: true,
        },
        scarecrowActive: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            fieldsTotals: {
                front: 0,
                mid: 0,
                back: 0,
            },
            total: 0
        };
    },
    methods: {
        frontRowClick() {this.$emit("frontRowClick")},
        midRowClick() {this.$emit("midRowClick")},
        backRowClick() {this.$emit("backRowClick")},
        fieldTotalCount(total, rowType) {
            this.fieldsTotals[rowType] = total;
            this.total = this.fieldsTotals.front + this.fieldsTotals.mid + this.fieldsTotals.back;
        },
        extraCageClick(rowType) {
            this.$emit("extraCageClick", rowType);
        },
        cardRowClicked(cardId, rowType) {
            this.$emit("cardRowClicked", cardId, rowType);
        }
    },
}
</script>


<style lang="scss" scoped>
.player_field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: white;
    margin-top: auto;
    padding: 10px;
    position: relative;
    width: 100%;
    max-width: 960px;
    box-sizing: border-box;
}

.total_field_count {
    font-size: 30px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: black;
    text-shadow: 0 0 3px white;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -70px;
    line-height: 0;
}
</style>
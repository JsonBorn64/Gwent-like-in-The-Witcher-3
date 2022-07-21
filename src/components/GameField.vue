<template>
    <div class="player_field">
        <FrontRow @click="frontRowClick" @rowTotalCount="fieldTotalCount" :cards="frontRow"
            :extraCage="frontRowExtraCage" @extraCageClick="extraCageClick" :rowType="'front'" :isHand="isHand" />
        <FrontRow @click="midRowClick" @rowTotalCount="fieldTotalCount" :cards="midRow" :extraCage="midRowExtraCage"
            @extraCageClick="extraCageClick" :rowType="'mid'" :isHand="isHand" />
        <FrontRow @click="backRowClick" @rowTotalCount="fieldTotalCount" :cards="backRow" :extraCage="backRowExtraCage"
            @extraCageClick="extraCageClick" :rowType="'back'" :isHand="isHand" />
        <div class="total_field_count">{{ total }}</div>
    </div>
</template>


<script>
import FrontRow from './FrontRow.vue';
export default {
    components: { FrontRow },
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
        frontRowClick() {
            this.$emit("frontRowClick");
        },
        midRowClick() {
            this.$emit("midRowClick");
        },
        backRowClick() {
            this.$emit("backRowClick");
        },
        fieldTotalCount(total, rowType) {
            this.fieldsTotals[rowType] = total;
            this.total = this.fieldsTotals.front + this.fieldsTotals.mid + this.fieldsTotals.back;
        },
        extraCageClick(rowType) {
            this.$emit("extraCageClick", rowType);
        },
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
    font-weight: 900;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: black;
    text-shadow: 0 0 4px white;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -70px;
    line-height: 0;
}
</style>
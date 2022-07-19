<template>
    <div class="player_field">
        <FrontRow @click="frontRowClick" @rowTotalCount="fieldTotalCount" :cards="frontRow" :rowType="'front'" :isHand="isHand" />
        <FrontRow @click="midRowClick" @rowTotalCount="fieldTotalCount" :cards="midRow" :rowType="'mid'" :isHand="isHand" />
        <FrontRow @click="backRowClick" @rowTotalCount="fieldTotalCount" :cards="backRow" :rowType="'back'" :isHand="isHand" />
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
        midRow: {
            type: Array,
            required: true,
        },
        backRow: {
            type: Array,
            required: true,
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
    },
}
</script>


<style lang="scss" scoped>
.player_field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid;
    color: white;
    margin-top: 20px;
    padding: 10px;
    position: relative;
}

.total_field_count {
    font-size: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -70px;
    line-height: 0;
}
</style>
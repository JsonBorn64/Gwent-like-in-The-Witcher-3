<template>
    <div class="player_field">
        <FrontRow :cards="frontRow" :isHand="isHand" />
        <div class="total_field_count">{{fieldTotalCount}}</div>
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
        isHand: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        fieldTotalCount() {
            return 0;
        },
    },
}
</script>


<style lang="scss" scoped>
.player_field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 2px solid;
    margin-top: 20px;
    padding: 10px;
    position: relative;
}

.total_field_count{
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
<template>
    <div class="player_field">
        <div class="front_field">
            <div class="field_total-count">{{rowTotalCount}}</div>
            <div class="field_extra-cage"></div>
            <div class="field_row"></div>
        </div>
        <div class="middle_field">
            <div class="field_total-count">{{rowTotalCount}}</div>
            <div class="field_extra-cage"></div>
            <div class="field_row"></div>
        </div>
        <div class="back_field">
            <div class="field_total-count">{{rowTotalCount}}</div>
            <div class="field_extra-cage"></div>
            <div class="field_row"></div>
        </div>
        <div class="total_field_count">{{fieldTotalCount}}</div>
    </div>
</template>


<script>
export default {
    computed: {
        rowTotalCount() {
            return 0;
        },
        fieldTotalCount() {
            return 0;
        },
    },
}

</script>


<style lang="scss">
.player_field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 2px solid;
    margin-top: 20px;
    padding: 10px;
    position: relative;
}

.front_field, .middle_field, .back_field {
    display: flex;
    & > div {
        background-color: rgb(226, 200, 152);
    }
}

.field_total-count {
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 10px auto 0;
    border: 1px solid;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    line-height: 0;
}

.field_extra-cage {
    width: 100px;
    height: 150px;
    border: 1px solid;
    margin-right: 10px;
}

.field_row {
    width: 450px;
    height: 150px;
    border: 1px solid;
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
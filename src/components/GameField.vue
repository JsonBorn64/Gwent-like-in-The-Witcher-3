<template>
    <div class="player_field">
        <field-row
            @click="frontRowClick"
            @rowTotalCount="fieldTotalCount"
            @cardClicked="cardRowClicked"
            :cards-prop="frontRow"
            :extra-cage="frontRowExtraCage"
            @extraCageClick="extraCageClick"
            :row-type="'front'"
            :active-card="activeCard"
            :is-hand="isHand"
        />
        <field-row
            @click="midRowClick"
            @rowTotalCount="fieldTotalCount"
            @cardClicked="cardRowClicked"
            :cards-prop="midRow"
            :extra-cage="midRowExtraCage"
            @extraCageClick="extraCageClick"
            :row-type="'mid'"
            :active-card="activeCard"
            :is-hand="isHand"
        />
        <field-row
            @click="backRowClick"
            @rowTotalCount="fieldTotalCount"
            @cardClicked="cardRowClicked"
            :cards-prop="backRow"
            :extra-cage="backRowExtraCage"
            @extraCageClick="extraCageClick"
            :row-type="'back'"
            :active-card="activeCard"
            :is-hand="isHand"
        />
        <div class="total_field_count">
            {{ total }}
        </div>
    </div>
</template>

<script>
import FieldRow from './FieldRow.vue';

export default {
  components: { FieldRow },
  props: {
    frontRow: {
      type: Array,
      required: true
    },
    frontRowExtraCage: {
      type: Object,
      default: null
    },
    midRow: {
      type: Array,
      required: true
    },
    midRowExtraCage: {
      type: Object,
      default: null
    },
    backRow: {
      type: Array,
      required: true
    },
    backRowExtraCage: {
      type: Object,
      default: null
    },
    isHand: {
      type: Boolean,
      required: true
    },
    activeCard: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      fieldsTotals: {
        front: 0,
        mid: 0,
        back: 0
      },
      total: 0
    };
  },
  methods: {
    frontRowClick() { this.$emit('frontRowClick'); },
    midRowClick() { this.$emit('midRowClick'); },
    backRowClick() { this.$emit('backRowClick'); },
    fieldTotalCount(total, rowType) {
      this.fieldsTotals[rowType] = total;
      this.total = this.fieldsTotals.front + this.fieldsTotals.mid + this.fieldsTotals.back;
    },
    extraCageClick(rowType) {
      this.$emit('extraCageClick', rowType);
    },
    cardRowClicked(card, rowType) {
      this.$emit('cardRowClicked', card, rowType);
    }
  }
};
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

<template>
    <div class="player_field">
        <field-row
            @click="backRowClick"
            @rowTotalCount="fieldTotalCount"
            :cards-prop="enemyBackRow"
            :extra-cage="enemyBackRowExtraCage"
            :row-type="'back'"
            :place="'field'"
            :weather-cards="weatherCards"
        />
        <field-row
            @click="midRowClick"
            @rowTotalCount="fieldTotalCount"
            :cards-prop="enemyMidRow"
            :extra-cage="enemyMidRowExtraCage"
            :row-type="'mid'"
            :place="'field'"
            :weather-cards="weatherCards"
        />
        <field-row
            @click="frontRowClick"
            @rowTotalCount="fieldTotalCount"
            :cards-prop="enemyFrontRow"
            :extra-cage="enemyFrontRowExtraCage"
            :row-type="'front'"
            :place="'field'"
            :weather-cards="weatherCards"
        />
        <hr class="fields_separator">
        <field-row
            @click="frontRowClick"
            @rowTotalCount="fieldTotalCount"
            @cardClicked="cardRowClicked"
            :cards-prop="frontRow"
            :extra-cage="frontRowExtraCage"
            @extraCageClick="extraCageClick"
            :row-type="'front'"
            :active-card="activeCard"
            :place="'field'"
            :weather-cards="weatherCards"
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
            :place="'field'"
            :weather-cards="weatherCards"
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
            :place="'field'"
            :weather-cards="weatherCards"
        />
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
    enemyFrontRow: {
      type: Array,
      required: true
    },
    enemyFrontRowExtraCage: {
      type: Object,
      default: null
    },
    enemyMidRow: {
      type: Array,
      required: true
    },
    enemyMidRowExtraCage: {
      type: Object,
      default: null
    },
    enemyBackRow: {
      type: Array,
      required: true
    },
    enemyBackRowExtraCage: {
      type: Object,
      default: null
    },
    weatherCards: {
      type: Array,
      default: () => []
    },
    place: {
      type: String,
      default: 'field'
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
  watch: {
    total(newValue) {
      this.$emit('playerTotalValue', newValue);
    }
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

.fields_separator {
    width: 100%;
    height: 1px;
    background-color: rgb(0, 0, 0);
    border: 1px solid black;
}
</style>

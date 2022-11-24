<template>
    <div class="player_field">
        <field-row
            @enemyRowTotalCount="fieldTotalCount"
            :cards-prop="enemyBackRow"
            :extra-cage="enemyBackRowExtraCage"
            :row-type="'back'"
            :active-card="activeCard"
            :place="'enemyField'"
            :weather-cards="weatherCards"
            :is-enemy="true"
        />
        <field-row
            @enemyRowTotalCount="fieldTotalCount"
            :cards-prop="enemyMidRow"
            :extra-cage="enemyMidRowExtraCage"
            :row-type="'mid'"
            :active-card="activeCard"
            :place="'enemyField'"
            :weather-cards="weatherCards"
            :is-enemy="true"
        />
        <field-row
            @enemyRowTotalCount="fieldTotalCount"
            :cards-prop="enemyFrontRow"
            :extra-cage="enemyFrontRowExtraCage"
            :row-type="'front'"
            :active-card="activeCard"
            :place="'enemyField'"
            :weather-cards="weatherCards"
            :is-enemy="true"
        />
        <hr class="fields_separator">
        <field-row
            @rowTotalCount="fieldTotalCount"
            :cards-prop="frontRow"
            :extra-cage="frontRowExtraCage"
            :row-type="'front'"
            :active-card="activeCard"
            :place="'field'"
            :weather-cards="weatherCards"
        />
        <field-row
            @rowTotalCount="fieldTotalCount"
            :cards-prop="midRow"
            :extra-cage="midRowExtraCage"
            :row-type="'mid'"
            :active-card="activeCard"
            :place="'field'"
            :weather-cards="weatherCards"
        />
        <field-row
            @rowTotalCount="fieldTotalCount"
            :cards-prop="backRow"
            :extra-cage="backRowExtraCage"
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
      total: 0,
      enemyFieldsTotals: {
        front: 0,
        mid: 0,
        back: 0
      },
      enemyTotal: 0
    };
  },
  methods: {
    fieldTotalCount(total, rowType, isEnemy) {
      if (!isEnemy) {
        this.fieldsTotals[rowType] = total;
        this.$store.state.playerTotalCount = this.fieldsTotals.front + this.fieldsTotals.mid + this.fieldsTotals.back;
      } else {
        this.enemyFieldsTotals[rowType] = total;
        this.$store.state.enemyTotalCount = this.enemyFieldsTotals.front + this.enemyFieldsTotals.mid
        + this.enemyFieldsTotals.back;
      }
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
    padding: 10px 10px 10px 20px;
    position: relative;
    width: 100%;
    max-width: 960px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
}

.fields_separator {
    width: 100%;
    height: 1px;
    background-color: rgb(0, 0, 0);
    border: 1px solid black;
    margin: 4px 0;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

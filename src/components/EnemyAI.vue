<template>
    <div />
</template>

<script>
export default {
  props: {
    weatherCards: {
      type: Array,
      default: () => []
    },
    enemyLives: {
      type: Number,
      required: true
    },
    enemyHand: {
      type: Array,
      required: true
    },
    enemyDroppedCards: {
      type: Array,
      default: () => []
    },
    enemyCardsDeck: {
      type: Array,
      required: true
    },
    turn: {
      type: String,
      default: 'player'
    },
    gameState: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hand: this.enemyHand,
      droppedCards: this.enemyDroppedCards,
      cardsDeck: this.enemyCardsDeck,
      lives: this.enemyLives,
      wCards: this.weatherCards,
      frontRow: this.gameState.frontRow,
      midRow: this.gameState.midRow,
      backRow: this.gameState.backRow,
      enemyFrontRow: this.gameState.enemyFrontRow,
      enemyFrontRowExtraCage: this.gameState.enemyFrontRowExtraCage,
      enemyMidRow: this.gameState.enemyMidRow,
      enemyMidRowExtraCage: this.gameState.enemyMidRowExtraCage,
      enemyBackRow: this.gameState.enemyBackRow,
      enemyBackRowExtraCage: this.gameState.enemyBackRowExtraCage
    };
  },
  updated() {
    if (this.turn === 'player') return;
    this.hand = this.enemyHand;
    this.enemyTurn();
    this.$emit('newGameState', {
      hand: this.hand,
      droppedCards: this.droppedCards,
      cardsDeck: this.cardsDeck,
      lives: this.lives,
      weatherCards: this.wCards,
      frontRow: this.frontRow,
      midRow: this.midRow,
      backRow: this.backRow,
      enemyFrontRow: this.enemyFrontRow,
      enemyFrontRowExtraCage: this.enemyFrontRowExtraCage,
      enemyMidRow: this.enemyMidRow,
      enemyMidRowExtraCage: this.enemyMidRowExtraCage,
      enemyBackRow: this.enemyBackRow,
      enemyBackRowExtraCage: this.enemyBackRowExtraCage
    });
  },
  methods: {
    enemyTurn() {
      // Search spy card
      let cardToTurn = this.hand.find(card => card.spy);
      if (cardToTurn) {
        this[`${cardToTurn.role}Row`].push(cardToTurn);
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        this.hand.push(...this.cardsDeck.splice(0, 2));
        this.hand.sort((a, b) => a.id - b.id);
        return;
      }
      // Search hero card
      cardToTurn = this.hand.find(card => card.hero && !card.medic && card.role !== 'scarecrow');
      if (cardToTurn) {
        const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
        this[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        return;
      }
      // Search common card
      cardToTurn = this.hand.find(card => !card.spy && !card.hero && !card.medic
        && card.role !== 'weather' && card.role !== 'execution' && card.role !== 'scarecrow' && card.role !== 'extra');
      if (cardToTurn) {
        const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
        this[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        return;
      }
      // Search execution card
      cardToTurn = this.hand.find(card => card.role === 'execution');
      if (cardToTurn) {
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        this.droppedCards.push(cardToTurn);
        const allCards = this.frontRow.concat(
          this.midRow,
          this.backRow,
          this.enemyFrontRow,
          this.enemyMidRow,
          this.enemyBackRow
        );
        const maxValue = Math.max(...allCards.map(card => {
          if (!card.hero) { return card.computedValue; } return -Infinity;
        }));
        const rowTypes = ['front', 'mid', 'back', 'enemyFront', 'enemyMid', 'enemyBack'];
        rowTypes.forEach(type => {
          this[`${type}Row`] = this[`${type}Row`].filter(card => {
            if (!card.hero && card.computedValue === maxValue
            && (type === 'front' || type === 'mid' || type === 'back')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              this.droppedCards.push(cardToPush);
            }
            if (!card.hero && card.computedValue === maxValue
            && (type === 'enemyFront' || type === 'enemyMid' || type === 'enemyBack')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              this.droppedCards.push(cardToPush);
            }
            if (!card.hero) { return card.computedValue !== maxValue; } return true;
          });
        });
      }
      // Search medic card
      cardToTurn = this.hand.find(card => card.medic);
      if (cardToTurn) {
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
        this[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
        const cardToRecover = this.droppedCards.find(card => !card.hero
          && (card.role === 'front' || card.role === 'mid' || card.role === 'back'));
        if (cardToRecover) {
          this.droppedCards = this.droppedCards.filter(card => card.id !== cardToRecover.id);
          this[`${cardToRecover.role.charAt(0).toUpperCase() + cardToRecover.role.slice(1)}Row`].push(cardToRecover);
        }
        return;
      }
      // Search extra card
      cardToTurn = this.hand.find(card => card.role === 'extra');
      if (cardToTurn) {
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        if (!this.enemyFrontRowExtraCage) {
          this.enemyFrontRowExtraCage = cardToTurn;
          return;
        }
        if (!this.enemyMidRowExtraCage) {
          this.enemyMidRowExtraCage = cardToTurn;
          return;
        }
        if (!this.enemyBackRowExtraCage) {
          this.enemyBackRowExtraCage = cardToTurn;
          return;
        }
      }
      // Search weather card
      cardToTurn = this.hand.find(card => card.role === 'weather');
      if (cardToTurn && !cardToTurn.clear) {
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        this.wCards.push(cardToTurn);
        return;
      }
      if (cardToTurn && cardToTurn.clear) {
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
        this.wCards = [];
        this.droppedCards.push(cardToTurn);
        return;
      }
      // Search scarecrow card
      cardToTurn = this.hand.find(card => card.role === 'scarecrow');
      if (cardToTurn) {
        this.hand = this.hand.filter(card => card.id !== cardToTurn.id);
      }
    }
  }
};
</script>

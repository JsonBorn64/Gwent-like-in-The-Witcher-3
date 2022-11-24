import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      // player data
      playerNickname: 'Геральт',
      playerAvatar: 'src/assets/текстуры/geralt-avatar.jpg',
      playerLives: 2,
      playerTotalCount: 0,
      playerFraction: 'Королевства Севера',
      playerLeader: {
        id: '99',
        name: 'фольтест - предводитель севера',
        src: 'src/assets/Карты гвинт webp/1. Королевства севера/фольтест - предводитель севера.webp',
        role: 'leader'
      },
      activeCard: null,
      medic: false,
      frontRow: [],
      frontRowExtraCage: null,
      midRow: [],
      midRowExtraCage: null,
      backRow: [],
      backRowExtraCage: null,
      hand: [],
      droppedCards: [],
      showDroppedPopup: false,
      cardsDeck: [],
      // enemy data
      enemyNickname: 'Противник',
      enemyAvatar: 'src/assets/текстуры/anonim-avatar.svg',
      enemyLives: 2,
      enemyTotalCount: 0,
      enemyFraction: 'Королевства Севера',
      enemyLeader: {
        id: '98',
        name: 'фольтест - железный владыка',
        src: 'src/assets/Карты гвинт webp/1. Королевства севера/фольтест - железный владыка.webp',
        role: 'leader'
      },
      enemyFrontRow: [],
      enemyFrontRowExtraCage: null,
      enemyMidRow: [],
      enemyMidRowExtraCage: null,
      enemyBackRow: [],
      enemyBackRowExtraCage: null,
      enemyHand: [],
      enemyDroppedCards: [],
      showEnemyDroppedPopup: false,
      enemyCardsDeck: [],
      // common data
      allCards: [],
      allCardsLoaded: false,
      weatherCards: [],
      turn: 'player'
    };
  },
  getters: {
  },
  mutations: {
    sortHandById(state) {
      state.hand = state.hand.sort((a, b) => a.id - b.id);
    },
    changeTurnToPlayer(state) {
      state.turn = 'player';
    }
  },
  actions: {
    getAllCards({ state }) {
      fetch('src/assets/колоды json/королевства_севера.json')
        .then(res => res.json())
        .then(data => {
          state.allCards = data;
          state.allCardsLoaded = true;
        });
    },
    setCardsDecks({ state }) {
      state.cardsDeck = JSON.parse(JSON.stringify(state.allCards.sort(() => 0.5 - Math.random()))).slice(0, 25);
      state.enemyCardsDeck = JSON.parse(JSON.stringify(state.allCards.sort(() => 0.5 - Math.random()))).slice(0, 25);
    },
    addCardToHandFromDeck({ state }) {
      state.hand.push(state.cardsDeck.pop());
    },
    addCardToHandFromDeck_enemy({ state }) {
      state.enemyHand.push(state.enemyCardsDeck.pop());
    },
    activateCard({ state }, cardClicked) {
      state.activeCard = cardClicked;
      state.activeCard.active = true;
    },
    unactiveAllCards({ state }) {
      state.hand.forEach(card => {
        card.active = false;
      });
      state.activeCard = null;
    },
    rowClick({ state }, { rowType, isEnemy }) {
      // Common cards
      if (state.activeCard?.role === rowType && !state.activeCard?.spy && !state.activeCard?.medic && !isEnemy) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state[`${rowType}Row`].push(state.activeCard);
        state[`${rowType}Row`].sort((a, b) => a.id - b.id);
        state.turn = 'enemy';
      }
      // Medic cards
      if (state.activeCard?.role === rowType && state.activeCard?.medic && !isEnemy) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state[`${rowType}Row`].push(state.activeCard);
        state[`${rowType}Row`].sort((a, b) => a.id - b.id);
        const recoverCardExist = state.droppedCards.findIndex(card => (card.role === 'front'
          || card.role === 'mid'
          || card.role === 'back') && !card.hero);
        if (recoverCardExist !== -1) {
          state.medic = true;
          state.showDroppedPopup = true;
        }
        state.turn = 'enemy';
      }
      // spy cards
      if (state.activeCard?.role === rowType && state.activeCard?.spy && isEnemy) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        const rowTypeCapitalFirstLetter = rowType.charAt(0).toUpperCase() + rowType.slice(1);
        state[`enemy${rowTypeCapitalFirstLetter}Row`].push(state.activeCard);
        state[`enemy${rowTypeCapitalFirstLetter}Row`].sort((a, b) => a.id - b.id);
        if (state.cardsDeck.length === 0) return;
        for (let i = 1; i <= 2; i++) {
          setTimeout(() => {
            // state.$refs.hand.style.overflowX = 'hidden';
            state.hand.push(state.cardsDeck.pop());
          }, i * 200);
        }
        setTimeout(() => {
          // state.$refs.hand.style.overflowX = 'visible';
          state.hand.sort((a, b) => a.id - b.id);
        }, 1000);
        state.turn = 'enemy';
      }
      // Execution cards
      if (state.activeCard?.role === 'execution') {
        state.droppedCards.push(state.activeCard);
        const allCards = state.frontRow.concat(
          state.midRow,
          state.backRow,
          state.enemyFrontRow,
          state.enemyMidRow,
          state.enemyBackRow
        );
        const maxValue = Math.max(...allCards.map(card => {
          if (!card.hero) { return card.computedValue; } return -Infinity;
        }));
        const rowTypes = ['front', 'mid', 'back', 'enemyFront', 'enemyMid', 'enemyBack'];
        rowTypes.forEach(type => {
          state[`${type}Row`] = state[`${type}Row`].filter(card => {
            if (!card.hero && card.computedValue === maxValue
            && (type === 'front' || type === 'mid' || type === 'back')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              state.droppedCards.push(cardToPush);
            }
            if (!card.hero && card.computedValue === maxValue
            && (type === 'enemyFront' || type === 'enemyMid' || type === 'enemyBack')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              state.enemyDroppedCards.push(cardToPush);
            }
            if (!card.hero) { return card.computedValue !== maxValue; } return true;
          });
        });
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state.turn = 'enemy';
      }
    },
    cardInRowClicked({ state }, { card, rowType }) {
      const getBackCard = state[`${rowType}Row`].find(item => item.id === card.id);
      state.activeCard.active = false;
      state.hand = state.hand.filter(item => state.activeCard.id !== item.id);
      getBackCard.computedValue = getBackCard.defaultValue;
      state.hand.push(getBackCard);
      state.hand.sort((a, b) => a.id - b.id);
      state[`${rowType}Row`] = state[`${rowType}Row`].filter(item => item.id !== card.id);
      state[`${rowType}Row`].forEach(item => {
        item.doubled = false;
      });
      state[`${rowType}Row`].unshift(state.activeCard);
      state.activeCard = null;
      state.turn = 'enemy';
    },
    medicRecoveredCard({ state }, card) {
      state.medic = false;
      state.showDroppedPopup = false;
      state.droppedCards = state.droppedCards.filter(item => item.id !== card.id);
      if (card.spy && state.cardsDeck.length !== 0) {
        for (let i = 1; i < 3; i++) {
          setTimeout(() => {
            state.$refs.hand.style.overflowX = 'hidden';
            state.hand.push(state.cardsDeck.pop());
          }, i * 300);
        }
        setTimeout(() => {
          state.$refs.hand.style.overflowX = 'visible';
          state.hand.sort((a, b) => a.id - b.id);
        }, 1000);
        if (card.role === 'front') state.enemyFrontRow.push(card);
        if (card.role === 'mid') state.enemyMidRow.push(card);
        if (card.role === 'back') state.enemyBackRow.push(card);
        return;
      }
      if (card.role === 'front') state.frontRow.push(card);
      if (card.role === 'mid') state.midRow.push(card);
      if (card.role === 'back') state.backRow.push(card);
      state.turn = 'enemy';
    },
    weatherCardsClick({ state }) {
      if (state.activeCard?.role === 'weather'
      && !state.activeCard?.clear
      && !state.weatherCards.find(wCard => wCard.influence === state.activeCard?.influence)) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state.weatherCards.push(state.activeCard);
      } else if (state.activeCard?.role === 'weather' && state.activeCard?.clear) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state.droppedCards.push(state.activeCard);
        state.weatherCards = [];
      } else if (state.activeCard?.role !== 'weather') {
        if (state.activeCard) state.activeCard.active = false;
      } else {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state.droppedCards.push(state.activeCard);
      }
      state.turn = 'enemy';
    },
    closePopupMethod({ state }, isEnemy) {
      if (!state.medic && !isEnemy) {
        state.showDroppedPopup = false;
      } else {
        state.showEnemyDroppedPopup = false;
      }
    },
    showPopupMethod({ state }, isEnemy) {
      if (!isEnemy) {
        state.showDroppedPopup = true;
      } else {
        state.showEnemyDroppedPopup = true;
      }
    },
    extraCageClick({ state }, cageType) {
      if (!state[cageType]?.id && state.activeCard?.troubadour) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state[cageType] = state.activeCard;
        state.turn = 'enemy';
      }
    },
    enemyTurn({ state }) {
      // Search spy card
      let cardToTurn = state.enemyHand.find(card => card.spy);
      if (cardToTurn) {
        state[`${cardToTurn.role}Row`].push(cardToTurn);
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        state.enemyHand.push(...state.enemyCardsDeck.splice(0, 2));
        state.enemyHand.sort((a, b) => a.id - b.id);
        return;
      }
      // Search hero card
      cardToTurn = state.enemyHand.find(card => card.hero && !card.medic && card.role !== 'scarecrow');
      if (cardToTurn) {
        const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
        state[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        return;
      }
      // Search common card
      cardToTurn = state.enemyHand.find(card => !card.spy && !card.hero && !card.medic
        && card.role !== 'weather' && card.role !== 'execution' && card.role !== 'scarecrow' && card.role !== 'extra');
      if (cardToTurn) {
        const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
        state[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        return;
      }
      // Search execution card
      cardToTurn = state.enemyHand.find(card => card.role === 'execution');
      if (cardToTurn) {
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        state.enemyDroppedCards.push(cardToTurn);
        const allCards = state.frontRow.concat(
          state.midRow,
          state.backRow,
          state.enemyFrontRow,
          state.enemyMidRow,
          state.enemyBackRow
        );
        const maxValue = Math.max(...allCards.map(card => {
          if (!card.hero) { return card.computedValue; } return -Infinity;
        }));
        const rowTypes = ['front', 'mid', 'back', 'enemyFront', 'enemyMid', 'enemyBack'];
        rowTypes.forEach(type => {
          state[`${type}Row`] = state[`${type}Row`].filter(card => {
            if (!card.hero && card.computedValue === maxValue
            && (type === 'front' || type === 'mid' || type === 'back')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              state.enemyDroppedCards.push(cardToPush);
            }
            if (!card.hero && card.computedValue === maxValue
            && (type === 'enemyFront' || type === 'enemyMid' || type === 'enemyBack')) {
              const cardToPush = JSON.parse(JSON.stringify(card));
              cardToPush.computedValue = card.defaultValue;
              state.enemyDroppedCards.push(cardToPush);
            }
            if (!card.hero) { return card.computedValue !== maxValue; } return true;
          });
        });
        return;
      }
      // Search medic card
      cardToTurn = state.enemyHand.find(card => card.medic);
      if (cardToTurn) {
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
        state[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
        const cardToRecover = state.enemyDroppedCards.find(card => !card.hero
          && (card.role === 'front' || card.role === 'mid' || card.role === 'back'));
        if (cardToRecover) {
          state.enemyDroppedCards = state.enemyDroppedCards.filter(card => card.id !== cardToRecover.id);
          state[`${cardToRecover.role.charAt(0).toUpperCase() + cardToRecover.role.slice(1)}Row`].push(cardToRecover);
        }
        return;
      }
      // Search extra card
      cardToTurn = state.enemyHand.find(card => card.role === 'extra');
      if (cardToTurn) {
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        if (!state.enemyFrontRowExtraCage) {
          state.enemyFrontRowExtraCage = cardToTurn;
          return;
        }
        if (!state.enemyMidRowExtraCage) {
          state.enemyMidRowExtraCage = cardToTurn;
          return;
        }
        if (!state.enemyBackRowExtraCage) {
          state.enemyBackRowExtraCage = cardToTurn;
          return;
        }
      }
      // Search weather card
      cardToTurn = state.enemyHand.find(card => card.role === 'weather');
      if (cardToTurn && !cardToTurn.clear) {
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        state.weatherCards.push(cardToTurn);
        return;
      }
      if (cardToTurn && cardToTurn.clear) {
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        state.weatherCards = [];
        state.enemyDroppedCards.push(cardToTurn);
        return;
      }
      // Search scarecrow card
      cardToTurn = state.enemyHand.find(card => card.role === 'scarecrow');
      if (cardToTurn) {
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
      }
    }
  }
});

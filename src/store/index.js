import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      // player data
      playerNickname: 'Геральт',
      playerAvatar: '/assets/текстуры/geralt-avatar.jpg',
      playerLives: 2,
      playerTotalCount: 0,
      playerFraction: 'Королевства Севера',
      playerLeader: {
        id: '99',
        name: 'фольтест - предводитель севера',
        src: 'assets/Карты гвинт webp/1. Королевства севера/фольтест - предводитель севера.webp',
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
      enemyAvatar: '/assets/текстуры/anonim-avatar.svg',
      enemyLives: 2,
      enemyTotalCount: 0,
      enemyFraction: 'Королевства Севера',
      enemyLeader: {
        id: '98',
        name: 'фольтест - железный владыка',
        src: 'assets/Карты гвинт webp/1. Королевства севера/фольтест - железный владыка.webp',
        role: 'leader'
      },
      enemyActiveCard: null,
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
    },
    sortEnemyRows(state) {
      state.enemyFrontRow = state.enemyFrontRow.sort((a, b) => a.id - b.id);
      state.enemyMidRow = state.enemyMidRow.sort((a, b) => a.id - b.id);
      state.enemyBackRow = state.enemyBackRow.sort((a, b) => a.id - b.id);
    }
  },
  actions: {
    getAllCards({ state }) {
      fetch('assets/колоды json/королевства_севера_cut.json')
        .then(res => res.json())
        .then(data => {
          state.allCards = data;
          state.allCardsLoaded = true;
        });
    },
    setCardsDecks({ state }) {
      state.cardsDeck = JSON.parse(JSON.stringify(state.allCards.sort(() => 0.5 - Math.random()))).slice(0, 30);
      state.enemyCardsDeck = JSON.parse(JSON.stringify(state.allCards.sort(() => 0.5 - Math.random()))).slice(0, 30);
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
      if (state.activeCard?.role === rowType
          && !state.activeCard?.spy && !state.activeCard?.medic && !state.activeCard?.frontExecution && !isEnemy) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state[`${rowType}Row`].push(state.activeCard);
        state[`${rowType}Row`].sort((a, b) => a.id - b.id);
        state.turn = 'enemy';
      }
      // Front execution cards
      if (state.activeCard?.role === rowType && state.activeCard?.frontExecution && !isEnemy) {
        state.activeCard.active = false;
        state.hand = state.hand.filter(card => state.activeCard.id !== card.id);
        state.frontRow.push(state.activeCard);
        state.frontRow.sort((a, b) => a.id - b.id);
        let totalResult = 0;
        state.enemyFrontRow.forEach(card => {
          if (card.computedValue) totalResult += card.computedValue;
        });
        if (totalResult < 10) {
          state.turn = 'enemy';
          return;
        }
        const maxValue = Math.max(...state.enemyFrontRow.map(card => {
          if (!card.hero) { return card.computedValue; } return -Infinity;
        }));
        state.enemyFrontRow = state.enemyFrontRow.filter(card => {
          if (!card.hero && card.computedValue === maxValue) {
            const cardToPush = JSON.parse(JSON.stringify(card));
            cardToPush.computedValue = card.defaultValue;
            state.enemyDroppedCards.push(cardToPush);
          }
          if (!card.hero) { return card.computedValue !== maxValue; } return true;
        });
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
            // state.$refs.hand.style.overflowX = 'hidden';
            state.hand.push(state.cardsDeck.pop());
          }, i * 300);
        }
        setTimeout(() => {
          // state.$refs.hand.style.overflowX = 'visible';
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
    similarIdsCheck({ state }) {
      state.hand.forEach((card, idx) => {
        if (card.id === state.hand[++idx]?.id) card.id += 0.5;
      });
    },
    showCardForNextTurn({ state }) {
      const spy = state.enemyHand.find(card => card.spy);
      const hero = state.enemyHand.find(card => card.hero && !card.medic && card.role !== 'scarecrow');
      const common = state.enemyHand.find(card => !card.spy && !card.hero && !card.medic && !card.frontExecution
        && card.role !== 'weather' && card.role !== 'execution' && card.role !== 'scarecrow' && card.role !== 'extra');
      const frontExecution = state.enemyHand.find(card => card.frontExecution);
      const execution = state.enemyHand.find(card => card.role === 'execution');
      const medic = state.enemyHand.find(card => card.medic);
      const extra = state.enemyHand.find(card => card.role === 'extra');
      const weather = state.enemyHand.find(card => card.role === 'weather');
      const scarecrow = state.enemyHand.find(card => card.role === 'scarecrow');
      const cardToTurn = spy || hero || common || frontExecution || execution || medic || extra || weather || scarecrow;
      state.enemyActiveCard = cardToTurn;
      setTimeout(() => {
        state.enemyActiveCard = null;
      }, 3000);
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
      cardToTurn = state.enemyHand.find(card => !card.spy && !card.hero && !card.medic && !card.frontExecution
        && card.role !== 'weather' && card.role !== 'execution' && card.role !== 'scarecrow' && card.role !== 'extra');
      if (cardToTurn) {
        const cardRoleCapitalLetter = cardToTurn.role.charAt(0).toUpperCase() + cardToTurn.role.slice(1);
        state[`enemy${cardRoleCapitalLetter}Row`].push(cardToTurn);
        state.enemyHand = state.enemyHand.filter(card => card.id !== cardToTurn.id);
        return;
      }
      // Search front execution card
      cardToTurn = state.enemyHand.find(card => card.frontExecution);
      if (cardToTurn) {
        state.enemyHand = state.enemyHand.filter(card => cardToTurn.id !== card.id);
        state.enemyFrontRow.push(cardToTurn);
        let totalResult = 0;
        state.frontRow.forEach(card => {
          if (card.computedValue) totalResult += card.computedValue;
        });
        if (totalResult < 10) return;
        const maxValue = Math.max(...state.frontRow.map(card => {
          if (!card.hero) { return card.computedValue; } return -Infinity;
        }));
        state.frontRow = state.frontRow.filter(card => {
          if (!card.hero && card.computedValue === maxValue) {
            const cardToPush = JSON.parse(JSON.stringify(card));
            cardToPush.computedValue = card.defaultValue;
            state.droppedCards.push(cardToPush);
          }
          if (!card.hero) { return card.computedValue !== maxValue; } return true;
        });
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
          state[`enemy${cardToRecover.role.charAt(0).toUpperCase() + cardToRecover.role.slice(1)}Row`]
            .push(cardToRecover);
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
        if (state.weatherCards.find(wCard => wCard.influence === cardToTurn?.influence)) {
          state.enemyDroppedCards.push(cardToTurn);
          return;
        }
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
        const allCards = state.enemyFrontRow.concat(
          state.enemyMidRow,
          state.enemyBackRow
        );
        const spyCard = allCards.find(card => !card.hero && card.spy);
        const medicCard = allCards.find(card => !card.hero && card.medic);
        const troubadourCard = allCards.find(card => !card.hero && card.troubadour);
        const handshakeCard = allCards.find(card => !card.hero && card.handshake);
        const commonCard = allCards.find(card => !card.hero
          && (card.role === 'front' || card.role === 'mid' || card.role === 'back'));
        const cardToReturn = spyCard || medicCard || troubadourCard || handshakeCard || commonCard;
        if (cardToReturn) {
          state.enemyFrontRow = state.enemyFrontRow.filter(card => card.id !== cardToReturn.id);
          state.enemyMidRow = state.enemyMidRow.filter(card => card.id !== cardToReturn.id);
          state.enemyBackRow = state.enemyBackRow.filter(card => card.id !== cardToReturn.id);
          state.enemyHand.push(cardToReturn);
          state[`enemy${cardToReturn.role.charAt(0).toUpperCase() + cardToReturn.role.slice(1)}Row`]
            .push(cardToTurn);
        }
      }
    }
  }
});

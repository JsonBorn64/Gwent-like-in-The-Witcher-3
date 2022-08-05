<template>
    <div class="player_stats">
        <div class="avatar">
            <img :src="`${avatar}`" alt="">
        </div>
        <div class="stats">
            <div class="stats-up">
                <div class="hand-counter">
                    <img src="src/assets/текстуры/hand cards icon.png" alt="">
                    {{ handCount }}
                </div>
                <div class="lives">
                    <img src="src/assets/текстуры/gem.png" alt="">
                    <img src="src/assets/текстуры/gem.png" alt="">
                </div>
            </div>
            <div class="stats-down">
                <div>{{ nickname }}</div>
                <div>{{ fraction }}</div>
            </div>
        </div>
        <div class="total_field_count" :style="{background: isEnemy ? '#96BBC4' : false}">
            {{ totalCount }}
        </div>
    </div>
</template>

<script>
export default {
  props: {
    nickname: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    leader: {
      type: Object,
      required: true
    },
    lives: {
      type: Number,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
    fraction: {
      type: String,
      required: true
    },
    handCount: {
      type: Number,
      required: true
    },
    isEnemy: {
      type: Boolean,
      default: false
    }
  }
};

</script>

<style lang="scss" scoped>
  .player_stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 110px;
    background-color: rgba(0, 0, 0, 0.4);
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 110px;
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 0;
      left: -10px;
    }
    &::after {
      content: '';
      display: block;
      width: 10px;
      height: 110px;
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 0;
      right: -10px;
    }
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    // box-shadow: 0 0 2px 4px rgb(121, 121, 121);
    & > img {
      width: 100%;
    }
  }

.stats {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-right: 4px;
}
 .stats-up {
    display: flex;
    align-items: center;
    height: 50px;
    font-size: 25px;
    letter-spacing: 1px;
    font-weight: 600;
    color: #DAA64F;
    margin-top: 5px;
 }

 .hand-counter {
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 2px;
    & > img {
        width: 24px;
        margin-right: 4px;
    }
 }

 .stats-down {
    display: flex;
    flex-direction: column;
    height: 50px;
    & > div:first-child {
        color: #DAA64F;
        font-weight: 600;
    }
    & > div:last-child {
        color: #927561;
        font-size: 14px;
        font-weight: 400;
    }
 }

 .lives {
    & > img {
        width: 30px;
        margin-right: 2px;
    }
 }

.total_field_count {
    font-size: 30px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: black;
    background-color: #A07F33;
    text-shadow: 0 0 4px white;
    box-shadow: 0 0 10px black;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -30px;
    z-index: 1;
}
</style>

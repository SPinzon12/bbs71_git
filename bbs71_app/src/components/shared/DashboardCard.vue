<template>
  <loading v-model:active="isLoading" :can-cancel="true" />
  <div class="cardBox row">
    <div v-for="card in cards" class="card col-4 my-3">
      <div class="cardContent d-flex justify-content-between align-items-center">
        <div class="cardInfo d-flex flex-column">
          <div class="numbers">{{ card.number }}</div>
          <div class="cardName">
            <b>{{ card.name }}</b>
          </div>
        </div>
        <div class="icon">
          <i :class="card.icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

export default {
  props: {
    cards: {
      type: Array,
      required: true,
    },
  },
  components: {
    Loading,
  },
  computed: {
    isLoading() {
      return this.$store.state.user.user.type === "airport"
        ? this.$store.state.airport.isLoading
        : this.$store.state.airline.isLoading;
    },
  },
};
</script>

<style scoped>
.cardBox {
  position: relative;
  width: 100%;
  padding: 30px;
  padding-left: 60px;
  padding-top: 0px;
  font-display: grid;
}

.cardBox .card {
  display: flex;
  position: relative;
  border: 3px solid #f6c207;
  background-color: #f6c207;
  border-radius: 20px;
  margin-right: 20px;
  padding: 30px;
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
  width: 30%;
}

.cardBox .card .numbers {
  position: relative;
  font-weight: 500;
  font-size: 2.5em;
}

.cardBox .card .cardName {
  position: relative;
  font-weight: 500;
  font-size: 1.1em;
  margin-top: 5px;
}

.cardBox .card .icon {
  font-size: 2.5em;
}

.cardBox .card:hover {
  background-color: white;
}
</style>

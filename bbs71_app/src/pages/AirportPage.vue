<template>
  <Navbar></Navbar>
  <div class="container">
    <h1 class="airport_name">Airport: {{ airport }}</h1>
    <div class="row">
      <div class="col-md-3">
        <SlideBar :menu-options="menuOptions" :selected="selected" @selected="onMenuOptionSelected"></SlideBar>
      </div>
      <div class="col-md-9">
        <div v-if="selected == 0">
          <div class="form-check form-switch">
            <label class="form-check-label" for="showArrivals"><b>Arrivals/Departures</b></label>
            <input class="form-check-input" type="checkbox" id="showArrivals" v-model="showArrivals">
          </div>
          <div v-if="showArrivals" class="table">
            <FlightTable tableName="Departures" :flights="flights_departure" flightType="departures" />
          </div>
          <div class="table" v-else>
            <FlightTable tableName="Arrivals" :flights="flights_arrival" flightType="arrivals" />
          </div>
        </div>
        <div v-if="selected == 1">
          <h1>Airlines</h1>
        </div>
        <div v-if="selected == 2">
          <h1>Flight routes</h1>
        </div>
        <div v-if="selected == 3">
          <h1>Time on the runway</h1>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>
<script>
import FlightTable from '../components/airport/FlightTableAirport.vue';
import Navbar from '@/components/shared/Navbar.vue';
import Footer from '@/components/shared/Footer.vue';
import SlideBar from "../components/shared/SlideBar.vue";

export default {
  components: {
    FlightTable,
    Navbar,
    Footer,
    SlideBar

  },
  data() {
    return {
      showArrivals: false,
      selected: 0,
      menuOptions: [
        { title: "Arrivals/Departures", iconClass: "fa-regular fa-paper-plane fa-xl" },
        { title: "Airlines", iconClass: "fa-solid fa-cart-flatbed-suitcase fa-xl" },
        { title: "Flight routes", iconClass: "fa-solid fa-plane-up fa-xl" },
        { title: "Time on the runway", iconClass: "fa-solid fa-plane-departure fa-xl" },
      ],
    };
  },
  computed: {
    airport() {
      return this.$store.state.user.user.name
    },
    flights_departure() {
      return this.$store.state.airport.flights_departure
    },
    flights_arrival() {
      return this.$store.state.airport.flights_arrival
    }
  },
  methods: {
    onMenuOptionSelected(index) {
      this.selected = index;
    },
  },
  beforeMount() {
    this.$store.dispatch("airport/getFlightsDep", this.$store.state.user.user);
    this.$store.dispatch("airport/getFlightsArr", this.$store.state.user.user);
  }
};
</script>
<style scoped>
.table {
  min-height: 400px;
  margin-bottom: 12px;
}

.form-check {
  position: relative;
  left: 630px;
  top: 30px;
  width: 300px
}

.airport_name {
  margin-top: 10px;
  font-size: 40px;
  font-weight: 700;
}

.form-check-input[type="checkbox"]:checked {
  background-color: #f6c207;
  border-color: #f6c207;
}

.form-check-input[type="checkbox"] {
  border-color: #f6c207;
}

.form-check-input:not(:checked) {

  border-color: #f6c207;
}
</style>
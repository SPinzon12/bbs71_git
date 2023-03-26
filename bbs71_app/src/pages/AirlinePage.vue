<template>
  <Navbar></Navbar>
  <div class="container">
    <h1 class="aero-name">Airline: {{ airline }}</h1>
    <div class="row">
      <div class="col-md-3">
        <SlideBar :menu-options="menuOptions" :selected="selected" @selected="onMenuOptionSelected"></SlideBar>
      </div>
      <div class="col-md-9">
        <div v-if="selected == 0">
          <FlightTable :flights="flights"></FlightTable>
        </div>
        <div v-if="selected == 1">
          <h1>Airplanes</h1>
        </div>
        <div v-if="selected == 2">
          <h1>Flight routes</h1>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>
<script>
import FlightTable from '../components/airline/FlightTableAirline.vue';
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
      selected: 0,
      menuOptions: [
        { title: "Flights", iconClass: "fa-regular fa-paper-plane fa-xl" },
        { title: "Airplanes", iconClass: "fa-solid fa-plane-up fa-xl" },
        { title: "Flight routes", iconClass: "fa-solid fa-plane-arrival fa-xl" },
      ],
    };
  },
  computed: {
    airline() {
      return this.$store.state.user.user.name
    },
    flights(){
      return this.$store.state.airline.flights
    }
  },
  methods: {
    onMenuOptionSelected(index) {
      this.selected = index;
    },
  },
  beforeMount() {
    this.$store.dispatch("airline/getFlights", this.$store.state.user.user);
  }
};
</script>
<style scoped>
.container {
  min-height: 450px;
  margin-top: 20px
}

.aero-name {
  margin-top: 10px;
  font-size: 40px;
  font-weight: 700;
}
</style>
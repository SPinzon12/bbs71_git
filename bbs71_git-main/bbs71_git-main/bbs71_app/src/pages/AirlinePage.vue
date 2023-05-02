<template>
  <Navbar></Navbar>
  <div class="container">
    <h1 class="aero-name">Airline: {{ airline }}</h1>
    <div class="row">
      <div class="col-md-3">
        <SlideBar
          :menu-options="menuOptions"
          :selected="selected"
          @selected="onMenuOptionSelected"
        ></SlideBar>
      </div>
      <div class="col-md-9">
        <div v-if="selected == 0">
          <FlightTable :flights="flights"></FlightTable>
        </div>
        <div v-if="selected == 1">
          <AircraftTable :airplanes="airplanes" />
        </div>
        <div v-if="selected == 2">
          <FlightRouteTable :routes="routes"/>
        </div>
        <div v-if="selected == 3">
          <DashboardCard :cards="cards" />
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>
<script>
import FlightTable from "../components/airline/FlightTableAirline.vue";
import Navbar from "@/components/shared/Navbar.vue";
import Footer from "@/components/shared/Footer.vue";
import SlideBar from "../components/shared/SlideBar.vue";
import DashboardCard from "../components/shared/DashboardCard.vue";
import AircraftTable from "../components/airline/AircraftFlightsTable.vue";
import FlightRouteTable from "../components/shared/FlightRouteTable.vue";

export default {
  components: {
    FlightTable,
    Navbar,
    Footer,
    SlideBar,
    DashboardCard,
    AircraftTable,
    FlightRouteTable,
  },
  data() {
    return {
      selected: 0,
      menuOptions: [
        { title: "Flights", iconClass: "fa-regular fa-paper-plane fa-xl" },
        { title: "Airplanes", iconClass: "fa-solid fa-plane-up fa-xl" },
        {
          title: "Flight routes",
          iconClass: "fa-solid fa-plane-arrival fa-xl",
        },
        { title: "Dashboard", iconClass: "fa-solid fa-chart-line fa-xl" },
      ],
    };
  },
  computed: {
    airline() {
      return this.$store.state.user.user.name;
    },
    flights() {
      return this.$store.state.airline.flights;
    },
    cards() {
      return this.$store.state.airline.cards;
    },
    airplanes() {
      return this.$store.state.airline.airplanes;
    },
    routes() {
      return this.$store.state.airline.routes;
    },
  },
  methods: {
    onMenuOptionSelected(index) {
      this.selected = index;
    },
  },
  beforeMount() {
    this.$store.dispatch("airline/getFlights", this.$store.state.user.user);
    this.$store.dispatch("airline/getCards", this.$store.state.user.user);
    this.$store.dispatch("airline/getAirplanes", this.$store.state.user.user);
    this.$store.dispatch("airline/getRoutes", this.$store.state.user.user);
  },
};
</script>
<style scoped>
.container {
  min-height: 450px;
  margin-top: 20px;
}

.aero-name {
  margin-top: 10px;
  font-size: 40px;
  font-weight: 700;
}
</style>

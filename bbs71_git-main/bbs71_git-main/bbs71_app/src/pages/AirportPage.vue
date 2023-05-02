<template>
  <Navbar></Navbar>
  <div class="container">
    <h1 class="airport_name">Airport: {{ airport }}</h1>
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
          <div class="form-check form-switch">
            <label class="form-check-label" for="showArrivals"
              ><b>Arrivals/Departures</b></label
            >
            <input
              class="form-check-input"
              type="checkbox"
              id="showArrivals"
              v-model="showArrivals"
            />
          </div>
          <div v-if="showArrivals" class="table">
            <FlightTable
              tableName="Departures"
              :flights="flights_departure"
              flightType="departures"
            />
          </div>
          <div class="table" v-else>
            <FlightTable
              tableName="Arrivals"
              :flights="flights_arrival"
              flightType="arrivals"
            />
          </div>
        </div>
        <div v-if="selected == 1">
          <AirlineTable :airlines="airlines" />
        </div>
        <div v-if="selected == 2">
          <FlightRouteTable :routes="routes"/>
        </div>
        <div v-if="selected == 3">
          <DashboardCard :cards="cards" />
        </div>
        <div v-if="selected == 4">
          <h1>Time on the runway</h1>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>
<script>
import FlightTable from "../components/airport/FlightTableAirport.vue";
import Navbar from "@/components/shared/Navbar.vue";
import Footer from "@/components/shared/Footer.vue";
import SlideBar from "../components/shared/SlideBar.vue";
import DashboardCard from "../components/shared/DashboardCard.vue";
import AirlineTable from "../components/airport/AirlineTableAirport.vue";
import FlightRouteTable from "../components/shared/FlightRouteTable.vue";

export default {
  components: {
    FlightTable,
    Navbar,
    Footer,
    SlideBar,
    DashboardCard,
    AirlineTable,
    FlightRouteTable,
  },
  data() {
    return {
      showArrivals: false,
      selected: 0,
      menuOptions: [
        {
          title: "Arrivals/Departures",
          iconClass: "fa-regular fa-paper-plane fa-xl",
        },
        {
          title: "Airlines",
          iconClass: "fa-solid fa-cart-flatbed-suitcase fa-xl",
        },
        { title: "Flight routes", iconClass: "fa-solid fa-plane-up fa-xl" },
        { title: "Dashboard", iconClass: "fa-solid fa-chart-line fa-xl" },
        // {
        //   title: "Time on the runway",
        //   iconClass: "fa-solid fa-plane-departure fa-xl",
        // }
      ],
    };
  },
  computed: {
    airport() {
      return this.$store.state.user.user.name;
    },
    flights_departure() {
      return this.$store.state.airport.flights_departure;
    },
    flights_arrival() {
      return this.$store.state.airport.flights_arrival;
    },
    cards() {
      return this.$store.state.airport.cards;
    },
    airlines() {
      return this.$store.state.airport.airlines;
    },
    routes() {
      return this.$store.state.airport.routes;
    },
  },
  methods: {
    onMenuOptionSelected(index) {
      this.selected = index;
    },
  },
  beforeMount() {
    this.$store.dispatch("airport/getFlightsDep", this.$store.state.user.user);
    this.$store.dispatch("airport/getFlightsArr", this.$store.state.user.user);
    this.$store.dispatch("airport/getCards", this.$store.state.user.user);
    this.$store.dispatch("airport/getAirlines", this.$store.state.user.user);
    this.$store.dispatch("airport/getRoutes", this.$store.state.user.user);
  },
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
  width: 300px;
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

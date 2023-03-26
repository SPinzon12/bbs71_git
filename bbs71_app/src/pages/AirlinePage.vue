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
      flights: [
        { '_id': '6410b30118b407031e6fe950', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George' }, 'crsDepTime': '07:24', 'depTime': '07:14', 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': '07:24', 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix' }, 'crsArrTime': '08:43', 'arrTime': '08:18', 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': '08:13', 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHX', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': '01:19', 'actualElapsedTime': '01:04' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': false, 'isDiverted': false, 'airTime': '00:49', 'flightNumber': 'OO 3133' } }, 
        { '_id': '6410b30118b407031e6fe951', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix' }, 'crsDepTime': '09:22', 'depTime': '09:17', 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': '09:40', 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George' }, 'crsArrTime': '10:40', 'arrTime': '10:31', 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': '10:28', 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': '01:18', 'actualElapsedTime': '01:14' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': false, 'isDiverted': false, 'airTime': '00:48', 'flightNumber': 'OO 3134' } }
      ],
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
    }
  },
  methods: {
    onMenuOptionSelected(index) {
      this.selected = index;
    },
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
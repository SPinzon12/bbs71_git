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
      flights_departure: [
      { '_id': '6410b30118b407031e6fe950', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George' }, 'crsDepTime': '07:24', 'depTime': '07:14', 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': '07:24', 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix' }, 'crsArrTime': '08:43', 'arrTime': '08:18', 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': '08:13', 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHX', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': '01:19', 'actualElapsedTime': '01:04' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': false, 'isDiverted': false, 'airTime': '00:49', 'flightNumber': 'OO 3133' } }, 
        { '_id': '6410b30118b407031e6fe951', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix' }, 'crsDepTime': '09:22', 'depTime': '09:17', 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': '09:40', 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George' }, 'crsArrTime': '10:40', 'arrTime': '10:31', 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': '10:28', 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': '01:18', 'actualElapsedTime': '01:14' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': false, 'isDiverted': false, 'airTime': '00:48', 'flightNumber': 'OO 3134' } }
      ],
      flights_arrival: [
        { '_id': '6410b30118b407031e6fe950', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George' }, 'crsDepTime': '07:24', 'depTime': '07:14', 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': '07:24', 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix' }, 'crsArrTime': '08:43', 'arrTime': '08:18', 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': '08:13', 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHX', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': '01:19', 'actualElapsedTime': '01:04' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': false, 'isDiverted': false, 'airTime': '00:49', 'flightNumber': 'OO 3133' } }, 
        { '_id': '6410b30118b407031e6fe951', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix' }, 'crsDepTime': '09:22', 'depTime': '09:17', 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': '09:40', 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George' }, 'crsArrTime': '10:40', 'arrTime': '10:31', 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': '10:28', 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': '01:18', 'actualElapsedTime': '01:14' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': false, 'isDiverted': false, 'airTime': '00:48', 'flightNumber': 'OO 3134' } },
        { '_id': '6410b30118b407031e6fe950', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George' }, 'crsDepTime': '07:24', 'depTime': '07:14', 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': '07:24', 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix' }, 'crsArrTime': '08:43', 'arrTime': '08:18', 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': '08:13', 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHX', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': '01:19', 'actualElapsedTime': '01:04' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': true, 'isDiverted': false, 'airTime': '00:49', 'flightNumber': 'OO 3133' } }, 
        { '_id': '6410b30118b407031e6fe951', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix' }, 'crsDepTime': '09:22', 'depTime': '09:17', 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': '09:40', 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George' }, 'crsArrTime': '10:40', 'arrTime': '10:31', 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': '10:28', 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': '01:18', 'actualElapsedTime': '01:14' }, 'flightInfo': { 'flightDate': "2021, 3, 3, 0, 0", 'isCancelled': false, 'isDiverted': true, 'airTime': '00:48', 'flightNumber': 'OO 3134' } }
      ],
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
  background-color:#f6c207;
  border-color: #f6c207;
}

.form-check-input[type="checkbox"] {
  border-color: #f6c207;
}

.form-check-input:not(:checked) {

  border-color: #f6c207;
}
</style>
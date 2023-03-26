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
            <FlightTable tableName="Departures" :flights="flights_arrival" flightType="arrivals" />
          </div>
          <div class="table" v-else>
            <FlightTable tableName="Arrivals" :flights="flights_departure" flightType="departures" />
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
        { 'id': '640cf1b249b9b098688cab16', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George, UT' }, 'crsDepTime': 724.0, 'depTime': 714.0, 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': 724.0, 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix, AZ' }, 'crsArrTime': 843.0, 'arrTime': 818.0, 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': 813.0, 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHX', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': 79.0, 'actualElapsedTime': 64.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'DOR', 'originAirportID': 14107, 'originCityName': 'Bogota' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
      ],
      flights_arrival: [
        { 'id': '640cf1b249b9b098688cab16', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George, UT' }, 'crsDepTime': 724.0, 'depTime': 714.0, 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': 724.0, 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix, AZ' }, 'crsArrTime': 843.0, 'arrTime': 818.0, 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': 813.0, 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHX', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': 79.0, 'actualElapsedTime': 64.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Wingo', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' }
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
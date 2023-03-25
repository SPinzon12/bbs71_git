<template>
    <h1>Aerolinea</h1>
    <div>
        <FlightTable :flights="flights"></FlightTable>
    </div>
</template>
<script>
import FlightTable from '../components/airline/FlightTableAirline.vue';

export default {
  components: {
    FlightTable,
  },
  data() {
    return {
      flights: [
        { 'id': '640cf1b249b9b098688cab16', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George, UT' }, 'crsDepTime': 724.0, 'depTime': 714.0, 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': 724.0, 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix, AZ' }, 'crsArrTime': 843.0, 'arrTime': 818.0, 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': 813.0, 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'SkyWest Airlines Inc.', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHX', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': 79.0, 'actualElapsedTime': 64.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab16', 'departure': { 'airport': { 'origin': 'SGU', 'originAirportID': 14794, 'originCityName': 'St. George, UT' }, 'crsDepTime': 724.0, 'depTime': 714.0, 'depDelay': -10.0, 'depDel15': 0.0, 'wheelsOff': 724.0, 'taxiOut': 10.0 }, 'arrival': { 'airport': { 'dest': 'PHX', 'destAirportID': 14107, 'destCityName': 'Phoenix, AZ' }, 'crsArrTime': 843.0, 'arrTime': 818.0, 'arrDelay': -25.0, 'arrDel15': 0.0, 'wheelsOn': 813.0, 'taxiIn': 5.0 }, 'aircraft': { 'tailNumber': 'N728SK' }, 'airline': { 'name': 'Avianca', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'SGU', 'originAirportID': 14794 }, 'to': { 'dest': 'PHS', 'destAirportID': 14107 }, 'distance': 262.0, 'crsElapsedTime': 79.0, 'actualElapsedTime': 64.0 }, 'date': '' },
        { 'id': '640cf1b249b9b098688cab17', 'departure': { 'airport': { 'origin': 'PHX', 'originAirportID': 14107, 'originCityName': 'Phoenix, AZ' }, 'crsDepTime': 922.0, 'depTime': 917.0, 'depDelay': -5.0, 'depDel15': 0.0, 'wheelsOff': 940.0, 'taxiOut': 23.0 }, 'arrival': { 'airport': { 'dest': 'SGU', 'destAirportID': 14794, 'destCityName': 'St. George, UT' }, 'crsArrTime': 1040.0, 'arrTime': 1031.0, 'arrDelay': -9.0, 'arrDel15': 0.0, 'wheelsOn': 1028.0, 'taxiIn': 3.0 }, 'aircraft': { 'tailNumber': 'N752SK' }, 'airline': { 'name': 'Wingo', 'iata': 'OO' }, 'route': { 'from': { 'origin': 'PHX', 'originAirportID': 14107 }, 'to': { 'dest': 'SGU', 'destAirportID': 14794 }, 'distance': 262.0, 'crsElapsedTime': 78.0, 'actualElapsedTime': 74.0 }, 'date': '' },
      ],
    };
  }
};
</script>
<style scoped>
    
</style>
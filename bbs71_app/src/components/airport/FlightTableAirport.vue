<template>
  <div class="container">
    <div class="form-group">
      <label class="table-name">
        <i :class="tableName === 'Arrivals' ? 'fas fa-plane-arrival' : 'fas fa-plane-departure'"></i>
        {{ tableName }}
      </label>
      <input type="text" class="form-control" v-model="filterField" placeholder="Write the flight, airline or city...">
    </div>

    <table class="table">
      <thead class="table-dark">
        <tr>
          <th scope="col">Date</th>
          <th v-if="flightType === 'arrivals'" scope="col">Origin</th>
          <th scope="col">Airline</th>
          <th v-if="flightType !== 'arrivals'" scope="col">Destination</th>
          <th scope="col">Flight</th>
        </tr>
      </thead>
      <tbody class="overflow-auto">
        <tr v-for="(flight, i) in filteredFlights" v-bind:key="flight.id" @click="handleRowClick(flight)">
          <td class="table-light">{{ flight.data }}</td>
          <td v-if="flightType === 'arrivals'" class="table-light">{{ flightType === 'arrivals' ? flight.route.from.origin
            :
            flight.route.to.dest }}</td>
          <td class="table-light">{{ flight.airline.name }}</td>
          <td v-if="flightType !== 'arrivals'" class="table-light">{{ flightType !== 'arrivals' ? flight.route.to.dest :
            flight.route.from.origin }}</td>
          <td class="table-light">{{ flight.id }}</td>
        </tr>
      </tbody>
      <tbody v-if="filteredFlights.length === 0">
        <tr>
          <td colspan="5">
            <div class="alert alert-warning text-center" role="alert">
              No flights found.
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="row" v-if="selectedFlight">
    <flight-card :flight="selectedFlight" @close="closeCard" />
  </div>
</template>

<script>
import FlightCard from '@/components/shared/FlightCard.vue';

export default {
  components: {
    FlightCard
  },
  props: {
    tableName: {
      type: String,
      required: true
    },
    flights: {
      type: Array,
      required: true
    },
    flightType: {
      type: String,
      required: true,
      validator: value => {
        return ['arrivals', 'departures'].includes(value)
      }
    }
  },
  data() {
    return {
      filterField: '',
      selectedFlight: null,
    };
  },

  computed: {
    filteredFlights() {
      return this.flights.filter(flight => {
        const filterText = this.filterField.toLowerCase();
        const airlineText = flight.airline.name.toLowerCase();
        const originText = flight.route.from.origin.toLowerCase();
        const destText = flight.route.to.dest.toLowerCase();
        const flightNumber = flight.id.toLowerCase()
        console.log(flightNumber)
        if (this.flightType === 'arrivals') {
          const cityText = flight.departure.airport.originCityName.toLowerCase();
          return cityText.startsWith(filterText) ||
            airlineText.startsWith(filterText) ||
            flightNumber.startsWith(filterText) ||
            originText.startsWith(filterText);
        }
        const cityText = flight.arrival.airport.destCityName.toLowerCase();
        return destText.startsWith(filterText) ||
          airlineText.startsWith(filterText) || cityText.startsWith(filterText) || flightNumber.startsWith(filterText)
      })
    }
  },
  methods: {
    handleRowClick(flight) {
      console.log("Se hizo clic en la fila:", flight);
      this.selectedFlight = flight;
    },
    closeCard() {
      this.selectedFlight = null;
    }
  }
}
</script>

<style scoped>
.page-item {
  padding: 0px
}

.pagination {
  position: relative;
  left: 40%;
  width: 100px
}

.container {
  margin-top: 50px;
}

.form-group {
  background-color: #f6c207;
  border-radius: 10px 10px 0px 0px;
  height: 60px;
}

.table-name {
  font-size: 35px;
  font-weight: 600;
  margin-left: 15px;
}

.form-control {
  width: 600px;
  position: relative;
  bottom: 120px;
}
</style>

<template>
  <div class="container">
    <div class="form-group">
      <label class="table-name">
        <i
          :class="
            tableName === 'Arrivals'
              ? 'fas fa-plane-arrival'
              : 'fas fa-plane-departure'
          "
        ></i>
        {{ tableName }}
      </label>
      <input
        type="text"
        class="form-control"
        v-model="filterField"
        placeholder="Write the flight, airline or city..."
      />
    </div>
    <table class="table">
      <thead class="table-dark">
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Scheduled time</th>
          <th v-if="flightType === 'arrivals'" scope="col">Origin</th>
          <th scope="col">Airline</th>
          <th v-if="flightType !== 'arrivals'" scope="col">Destination</th>
          <th scope="col">Flight</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody class="overflow-auto">
        <tr
          v-for="(flight, i) in filteredFlights"
          v-bind:key="flight.id"
          @click="handleRowClick(flight)"
        >
          <td class="table-light">{{ flight.flightInfo.flightDate }}</td>
          <td class="table-light">
            {{
              flightType === "arrivals"
                ? flight.arrival.crsArrTime
                : flight.departure.crsDepTime
            }}
          </td>
          <td v-if="flightType === 'arrivals'" class="table-light">
            {{
              flightType === "arrivals"
                ? flight.route.from.origin
                : flight.route.to.dest
            }}
          </td>
          <td class="table-light">{{ flight.airline.name }}</td>
          <td v-if="flightType !== 'arrivals'" class="table-light">
            {{
              flightType !== "arrivals"
                ? flight.route.to.dest
                : flight.route.from.origin
            }}
          </td>
          <td class="table-light">{{ flight.flightInfo.flightNumber }}</td>
          <td
            class="table-light"
            :style="{
              color:
                flight.flightInfo.isCancelled || flight.flightInfo.isDiverted
                  ? 'red'
                  : 'green',
            }"
          >
            <b>{{
              flight.flightInfo.isDiverted
                ? "Diverted"
                : flight.flightInfo.isCancelled
                ? "Cancelled"
                : "Arrived"
            }}</b>
          </td>
        </tr>
      </tbody>
      <tbody v-if="filteredFlights.length === 0">
        <tr>
          <td colspan="6">
            <div class="alert alert-warning text-center" role="alert">
              No flights found.
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="btn-toolbar"
      role="toolbar"
      aria-label="Toolbar with button groups"
    >
      <div
        class="btn-group mr-2 mx-auto"
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <button
          v-if="page != 1"
          @click="page--"
          type="button"
          class="btn btn-warning"
        >
          <i class="fa-solid fa-angles-left"></i>
        </button>
        <button
          v-for="(pageNumber, i) in setFlights.slice(page - 1, page + 2)"
          :key="i"
          @click="page = pageNumber"
          type="button"
          :class="{ 'btn btn-warning': page != pageNumber, 'btn btn-dark': page == pageNumber }"
        >
          {{ pageNumber }}
        </button>
        <button
          v-if="page < pages.length"
          @click="page++"
          type="button"
          class="btn btn-warning"
        >
          <i class="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </div>
  </div>
  <div class="row" v-if="selectedFlight">
    <flight-card :flight="selectedFlight" @close="closeCard" />
  </div>
</template>

<script>
import FlightCard from "@/components/shared/FlightCard.vue";

export default {
  components: {
    FlightCard,
  },
  props: {
    tableName: {
      type: String,
      required: true,
    },
    flights: {
      type: Array,
      required: true,
    },
    flightType: {
      type: String,
      required: true,
      validator: (value) => {
        return ["arrivals", "departures"].includes(value);
      },
    },
  },
  data() {
    return {
      filterField: "",
      selectedFlight: null,
      page: 1,
      perPage: 10,
      pages: [],
      totalFlights: 0,
    };
  },
  computed: {
    filteredFlights() {
      const filtered = this.flights.filter((flight) => {
        const filterText = this.filterField.toLowerCase();
        const airlineText = flight.airline.name.toLowerCase();
        const originText = flight.route.from.origin.toLowerCase();
        const destText = flight.route.to.dest.toLowerCase();
        const flightNumber = flight.flightInfo.flightNumber.toLowerCase();
        if (this.flightType === "arrivals") {
          const cityText =
            flight.departure.airport.originCityName.toLowerCase();
          return (
            cityText.startsWith(filterText) ||
            airlineText.startsWith(filterText) ||
            flightNumber.startsWith(filterText) ||
            originText.startsWith(filterText)
          );
        }
        const cityText = flight.arrival.airport.destCityName.toLowerCase();
        return (
          destText.startsWith(filterText) ||
          airlineText.startsWith(filterText) ||
          cityText.startsWith(filterText) ||
          flightNumber.startsWith(filterText)
        );
      });
      this.totalFlights = filtered.length;
      return this.paginate(filtered);
    },
    setFlights() {
      console.log(this.totalFlights)
      let numberOfPages = Math.ceil(this.totalFlights / this.perPage);
      this.pages = [];
      for (let i = 1; i <= numberOfPages; i++) {
        this.pages.push(i);
      }
      return this.pages;
    },
  },
  methods: {
    handleRowClick(flight) {
      console.log("Se hizo clic en la fila:", flight);
      this.selectedFlight = flight;
    },
    closeCard() {
      this.selectedFlight = null;
    },
    paginate(flights) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return flights.slice(from, to);
    },
  },
};
</script>

<style scoped>
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

.btn {
  color: #212529;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.btn:active:focus,
.btn:focus {
  box-shadow: none !important;
}

.btn-dark {
  color: #fff;
}
</style>

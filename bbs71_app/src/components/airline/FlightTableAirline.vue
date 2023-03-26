<template>
    <div class="container">
        <div class="row">
            <div class="col-5">
                <section class="dropdown-wrapper">
                    <div @click="isVisibleOrigin = !isVisibleOrigin" class="selected-item">
                        <span v-if="selectedOrigin">{{ selectedOrigin }}</span>
                        <span v-else><i class="fa-solid fa-plane-departure fa-xl" style="color: #ffcc14;"></i> Select
                            Origin</span>
                        <svg :class="isVisibleOrigin ? 'dropdown' : ''" class="drop-down-icon"
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                        </svg>
                    </div>
                    <div :class="isVisibleOrigin ? 'visible' : 'invisible'" v-if="isVisibleOrigin" class="dropdown-popover">
                        <input v-model="filterTextOrigin" type="text" placeholder="Buscar por Origen">
                        <span v-if="filterOrigin.length === 0">No Data Available</span>
                        <div class="options">
                            <ul>
                                <li @click="allOrigins()">All Origins</li>
                                <li @click="selectOrigin(city)" v-for="city in filterOrigin">{{ city }}</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
            <div class="col-1">
                <i class="fa-solid fa-person-walking-luggage fa-2xl" style="color: #f4c210; margin-left:10px"></i>
            </div>
            <div class="col-6">
                <section class="dropdown-wrapper">
                    <div @click="isVisibleDestination = !isVisibleDestination" class="selected-item">
                        <span v-if="selectedDestination">{{ selectedDestination }}</span>
                        <span v-else><i class="fa-solid fa-plane-arrival fa-xl" style="color: #ffca0a;"></i> Select
                            Destination</span>
                        <svg :class="isVisibleDestination ? 'dropdown' : ''" class="drop-down-icon"
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                        </svg>
                    </div>
                    <div :class="isVisibleDestination ? 'visible' : 'invisible'" v-if="isVisibleDestination"
                        class="dropdown-popover">
                        <input v-model="filterTextDestination" type="text" placeholder="Search Origin">
                        <span v-if="filterDestination.length === 0">No Data Available</span>
                        <div class="options">
                            <ul>
                                <li @click="allDests()">All Destinations</li>
                                <li @click="selectDestination(city)" v-for="city in filterDestination">{{ city }}</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <div class="header">
            <h3>Flights</h3>
        </div>
        <div>
            <table class="table">
                <thead class="table-dark">
                    <tr>
                        <th>Number</th>
                        <th>Airplane</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Status</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="flight in filteredFlights" :key="flight.id" @click="handleRowClick(flight)">
                        <td class="table-light">{{ flight.flightInfo.flightNumber }}</td>
                        <td class="table-light">{{ flight.aircraft.tailNumber }}</td>
                        <td class="table-light">{{ flight.route.from.origin }}</td>
                        <td class="table-light">{{ flight.route.to.dest }}</td>
                        <td class="table-light"
                            :style="{ color: flight.flightInfo.isCancelled || flight.flightInfo.isDiverted ? 'red' : 'green' }">
                            {{
                                flight.flightInfo.isDiverted ? 'Diverted' : (flight.flightInfo.isCancelled ? 'Cancelled' :
                                    'Arrived') }}</td>
                        <td class="table-light">{{ flight.departure.depTime }}</td>
                        <td class="table-light">{{ flight.arrival.arrTime }}</td>
                    </tr>
                </tbody>
                <tbody v-if="filteredFlights.length === 0">
                    <tr>
                        <td colspan="4">
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
    </div>
</template>

<script>
import FlightCard from '../shared/FlightCard.vue';
export default {
    components: {
        FlightCard
    },
    props: {
        flights: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            origin: "",
            filterTextOrigin: "",
            selectedOrigin: null,
            isVisibleOrigin: false,
            destination: "",
            filterTextDestination: "",
            selectedDestination: null,
            isVisibleDestination: false,
            selectedFlight: null,
        };
    },
    computed: {
        filterOrigin() {
            const filterText = this.filterTextOrigin.toLowerCase();
            console.log(filterText)
            if (this.filterTextOrigin === "") {
                return this.filteredCitiesOrigin;
            }
            return this.filteredCitiesOrigin.filter((city) => {
                const originText = this.getAirportCode(city).toLowerCase();
                const cityText = city.split('(')[0].trim().toLowerCase();
                return originText.startsWith(filterText) || cityText.startsWith(filterText);
            })
        },
        filterDestination() {
            const filterText = this.filterTextDestination.toLowerCase();
            if (this.filterTextDestination === "") {
                return this.filteredCitiesDestination;
            }
            return this.filteredCitiesDestination.filter((city) => {
                const destText = this.getAirportCode(city).toLowerCase();
                const cityText = city.split('(')[0].trim().toLowerCase();
                return destText.startsWith(filterText) || cityText.startsWith(filterText);
            })
        },
        filteredFlights() {
            // Si no se ha seleccionado ningún origen o destino, devolver todos los vuelos
            if (this.origin === "" && this.destination === "") {
                return this.flights;
            }
            // Si solo se ha seleccionado un origen o destino, filtrar los vuelos correspondientes
            if (this.origin !== "" && this.destination === "") {
                const originAirportCode = this.getAirportCode(this.origin);
                return this.flights.filter(
                    (flight) => flight.route.from.origin === originAirportCode
                );
            }
            if (this.origin === "" && this.destination !== "") {
                const destinationAirportCode = this.getAirportCode(this.destination);
                return this.flights.filter(
                    (flight) => flight.route.to.dest === destinationAirportCode
                );
            }
            // Si se han seleccionado tanto el origen como el destino, filtrar por ambos
            const originAirportCode = this.getAirportCode(this.origin);
            const destinationAirportCode = this.getAirportCode(this.destination);
            return this.flights.filter(
                (flight) =>
                    flight.route.from.origin === originAirportCode &&
                    flight.route.to.dest === destinationAirportCode
            );
        },
        filteredCitiesOrigin() {
            const cities = [];
            const selectedDestinationCode = this.destination ? this.getAirportCode(this.destination) : null;
            for (const flight of this.flights) {
                const city = `${flight.departure.airport.originCityName} (${flight.route.from.origin})`;
                if (!cities.includes(city) && (!selectedDestinationCode || flight.route.to.dest === selectedDestinationCode)) {
                    cities.push(city);
                }
            }
            return cities;
        },
        filteredCitiesDestination() {
            const cities = [];
            const selectedOriginCode = this.origin ? this.getAirportCode(this.origin) : null;
            for (const flight of this.flights) {
                const city = `${flight.arrival.airport.destCityName} (${flight.route.to.dest})`;
                if (!cities.includes(city) && (!selectedOriginCode || flight.route.from.origin === selectedOriginCode)) {
                    cities.push(city);
                }
            }
            return cities;
        },
        // filteredCities() {
        //     let cities = [];
        //     for (let flight of this.flights) {
        //         if (
        //             !cities.includes(
        //                 `${flight.departure.airport.originCityName} (${flight.route.from.origin})`
        //             )
        //         ) {
        //             cities.push(
        //                 `${flight.departure.airport.originCityName} (${flight.route.from.origin})`
        //             );
        //         }
        //         if (
        //             !cities.includes(
        //                 `${flight.arrival.airport.destCityName} (${flight.route.to.dest})`
        //             )
        //         ) {
        //             cities.push(
        //                 `${flight.arrival.airport.destCityName} (${flight.route.to.dest})`
        //             );
        //         }
        //     }
        //     return cities;
        // },
    },
    methods: {
        pagination() {
            return Math.ceil(filteredFlights.length / this.elementsByPages)
        },
        getAirportCode(cityString) {
            return cityString.split("(")[1].replace(")", "");
        },
        selectOrigin(city) {
            this.selectedOrigin = city;
            this.origin = city;
            this.isVisibleOrigin = false;
        },
        allOrigins() {
            this.origin = '';
            this.selectedOrigin = null;
            this.isVisibleOrigin = false;
        },
        selectDestination(city) {
            this.selectedDestination = city;
            this.destination = city;
            this.isVisibleDestination = false;
        },
        allDests() {
            this.destination = '';
            this.selectedDestination = null;
            this.isVisibleDestination = false;
        },
        handleRowClick(flight) {
            console.log("Se hizo clic en la fila:", flight);
            this.selectedFlight = flight;
        },
        closeCard() {
            this.selectedFlight = null;
        }

    }
};
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

section {
    position: relative;
    z-index: 1;
}

.header {
    background-color: #f6c207;
    border-radius: 10px 10px 0px 0px;
    height: 50px;
    margin-top: 20px
}

h3 {
    margin-bottom: 0px;
    font-size: 35px;
    font-weight: 600;
    margin-left: 15px;
}

.table-dark {
    margin-top: 50px
}

.dropdown-wrapper {
    max-width: 350px;
    position: relative;
    margin: 0 auto;
}

.dropdown-wrapper .selected-item {
    height: 40px;
    border: 2px solid lightgray;
    border-radius: 5px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;

}

.selected-item .drop-down-icon,
.selected-item .drop-down-icon.dropdown {
    transition: all 0.4s ease;
}

.selected-item .drop-down-icon {
    transform: rotate(0deg);
}

.selected-item .drop-down-icon.dropdown {
    transform: rotate(180deg);
}

.dropdown-wrapper .dropdown-popover {
    position: absolute;
    border: 2px solid lightgray;
    top: 41px;
    left: 0;
    right: 0;
    background-color: #fff;
    max-width: 100%;
    padding: 20px;
    visibility: hidden;
    transition: all 0.5s linear;
    max-height: 0px;
    overflow: hidden;
}

.dropdown-wrapper .dropdown-popover.visible {
    max-height: 450px;
    visibility: visible;
    border-radius: 5px;
}


.dropdown-popover .options {
    width: 100%;
}



.dropdown-popover ul {
    width: 100%;
    list-style: none;
    text-align: left;
    padding-left: 0px;
    overflow-y: scroll;
    overflow-x: hidden;
    border: 1px solid lightgray;
}

.dropdown-popover li {
    width: 100%;
    border-bottom: 1px solid lightgray;
    padding: 10px;
    background-color: #f1f1f1;
    cursor: pointer;
    font-size: 16px;
}

.dropdown-popover li:hover {
    background: rgba(255, 196, 0, 0.467);
    color: white;
    font-weight: bold;
}

.dropdown-popover input {
    width: 100%;
    height: 30px;
    border: 2px solid lightgray;
    font-size: 16px;
    padding-left: 8px;
    border-radius: 5px;
}
</style>
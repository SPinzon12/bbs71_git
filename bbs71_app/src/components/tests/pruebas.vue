<template>
    <div>
      <h1>Dashboard</h1>
        <DashboardCard :cards="cards"/>
    </div>
  </template>
<script>
import FlightTable from '../airline/FlightTableAirline.vue';
import DashboardCard from '../shared/DashboardCard.vue';

export default {
    components: {
        FlightTable,
        DashboardCard
    },
    data() {
        return {
            cards: [
                {
                    number: 14700,
                    name: "Vuelos",
                    icon: "fa-solid fa-helicopter",
                },
                {
                    number: 5000,
                    name: "Hoteles",
                    icon: "fa-solid fa-hotel",
                },
                {
                    number: 100,
                    name: "Cruceros",
                    icon: "fa-solid fa-ship",
                },
                {
                    number: 100,
                    name: "Cruceros",
                    icon: "fa-solid fa-ship",
                }
            ],
        };
    },
}
</script>
<style scoped></style>
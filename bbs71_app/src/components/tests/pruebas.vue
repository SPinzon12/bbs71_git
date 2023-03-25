<template>
    <div>
        <h1>Pruebas</h1>
        <SlideBar :menu-options="menuOptions" @selected="selectMenu"></SlideBar>
        <div v-if="selected == 0">
            <h1>Routes</h1>
        </div>
        <div v-if="selected == 1">
            <h1>Arrivals/Departures</h1>
        </div>
        <div v-if="selected == 2">
            <h1>Runway</h1>
        </div>
        <div v-if="selected == 3">
            <h1>Airlines</h1>
        </div>
    </div>
</template>
  
<script>
import SlideBar from "../shared/SlideBar.vue";

export default {
    components: {
        SlideBar,
    },
    data() {
        return {
            selected: "",
            menuOptions: [
                { title: "Arrivals/Departures", iconClass: "fa-regular fa-paper-plane fa-xl" },
                { title: "Airlines", iconClass: "fa-solid fa-cart-flatbed-suitcase fa-xl" },
                { title: "Flight routes", iconClass: "fa-solid fa-plane-up fa-xl" },
                { title: "Time on the runway", iconClass: "fa-solid fa-plane-departure fa-xl" },
            ],
        };
    },
    methods: {
        selectMenu(Option) {
            this.selected = Option;
        },
    },
};
</script>
<style scoped></style>
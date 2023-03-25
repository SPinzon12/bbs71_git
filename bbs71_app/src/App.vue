<template>
  <!-- <div>
    <Pruebas></Pruebas>
  </div> -->
  <!-- <div>
    <Airport></Airport>
  </div> -->
  <!-- <div>
    <Airline></Airline>
  </div> -->
  <!-- <div>
    <Login></Login>
  </div> -->
  <router-view></router-view>
</template>

<script>
import Pruebas from '@/components/tests/pruebas.vue'
import Airport from './pages/AirportPage.vue';
import Airline from './pages/AirlinePage.vue';
import Login from './pages/LoginPage.vue';
import Navbar from './components/shared/Navbar.vue';

export default {
  components: {
    Pruebas,
    Airport,
    Airline,
    Login,
    Navbar
  },
  data() {
    return {}
  }
};
</script>


<style scoped></style>

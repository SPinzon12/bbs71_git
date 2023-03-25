<template>
  <div class="col-md-6 offset-md-3">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ flight.id }}</h5>
        <p class="card-text">Origen: {{ flight.route.from.origin }}</p>
        <p class="card-text">Aerolínea: {{ flight.airline.name }}</p>
        <p class="card-text">Destino: {{ flight.route.to.dest }}</p>
        <p class="card-text">Fecha: {{ flight.data }}</p>
        <!-- Agrega aquí más detalles del vuelo -->
        <button @click="$emit('close')">Cerrar</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['flight']
}
</script>
<style scoped>
.card {
  position: relative;
  z-index: 1;
}
</style>
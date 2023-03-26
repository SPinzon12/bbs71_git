<template>
  <div class="cardt d-flex">
    <div class="card-body">
      <div class="row" id="a1">
        <h4 class="card-title">{{ flight.aircraft.tailNumber }}</h4>
        <h5>{{ flight.airline.name }}</h5>
        <button @click="$emit('close')" class="bi bi-x-circle-fill"></button>
      </div>
      <div class="row">
        <img src="../../assets/img_static/Avion.jpg" class="cardImag">
      </div>
      <div class="row d-flex" id="a2">
        <div class="col-5 text-center">
          <h5 class="card-text"><b>Origin</b></h5>
          <h6>{{ flight.departure.airport.originCityName }} ({{ flight.route.from.origin }})</h6>
        </div>
        <div class="col-2 text-center">
          <i class="fa-solid fa-plane fa-beat fa-2xl" style="color: #f1b407; margin-top:30px"></i>
        </div>
        <div class="col-5 text-center">
          <h5 class="card-text"><b>Destination</b></h5>
          <h6>{{ flight.arrival.airport.destCityName }} ({{ flight.route.to.dest }})</h6>
        </div>
      </div>
      <div class="row text-center" id="a3">
        <div class="col">
          <h5 class="card-text"><b>Dep Time</b></h5>
          <h6>{{ flight.departure.depTime }}</h6>
        </div>
        <div class="col">
          <h5 class="card-text"><b>Arr Time</b></h5>
          <h6>{{ flight.arrival.arrTime }}</h6>
        </div>
      </div>
      <div class="row text-center" id="a4">
        <h5 :style="{ color: flight.flightInfo.isCancelled || flight.flightInfo.isDiverted ? 'red' : 'green' }">
          <b>{{
            flight.flightInfo.isDiverted ? 'Diverted' : (flight.flightInfo.isCancelled ? 'Cancelled' :
              'Arrived') }}</b>
        </h5>
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
.card-title {
  font-weight: 500;
}

button {
  background-color: transparent;
  border: none;
  position: relative;
  bottom: 60px;
  left: 140px;
  font-size: 20px;
}

.cardImag {
  height: 200px;
  width: 100%;
  padding: 0px;
  border-bottom: 2px solid;
}

.cardt {
  position: fixed;
  z-index: 1;
  width: 300px;
  padding: 0px;
  bottom: 25%;
  left: 40%;
}

.card-body {
  padding: 0px;
}

.col-5 {
  margin-top: 10px;
}

#a1 {
  background-color: #f6c207;
  border-radius: 20px 20px 0px 0px;
  height: 65px;
  border-bottom: 2px solid;

}

#a2 {
  background-color: rgb(208, 208, 208);


}

#a3 {
  background-color: rgb(208, 208, 208);
}

#a4 {
  background-color: rgb(208, 208, 208);
  border-radius: 0px 0px 20px 20px;
  height: 50px;
}
</style>
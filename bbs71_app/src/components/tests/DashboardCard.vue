<template>
  <div>
    <h1>Card</h1>
    <div class="cardBox row">
      <div class="card col mx-3">
        <div class="cardContent d-flex justify-content-between align-items-center">
          <div class="cardInfo d-flex flex-column">
            <div class="numbers">14700</div>
            <div class="cardName">Vuelos</div>
          </div>
          <div class="icon">
            <i class="fa-solid fa-helicopter"></i>
          </div>
        </div>
      </div>
      <div class="card col mx-3">
        <div class="cardContent d-flex justify-content-between align-items-center">
          <div class="cardInfo d-flex flex-column">
            <div class="numbers">14700</div>
            <div class="cardName">Vuelos</div>
          </div>
          <div class="icon">
            <i class="fa-solid fa-helicopter"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.cardBox {
  position: relative;
  width: 100%;
  padding: 20px;
  font-display: grid;
}

.cardBox .card {
  display: flex;
  position: relative;
  border: 3px solid #f6c207;
  background-color: #f6c207;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
}

.cardBox .card .numbers {
  position: relative;
  font-weight: 500;
  font-size: 2.5em;
}

.cardBox .card .cardName {
  position: relative;
  font-weight: 500;
  font-size: 1.1em;
  margin-top: 5px;
}

.cardBox .card .icon {
  font-size: 3em;
}

.cardBox .card:hover {
  background-color: white;
}
</style>




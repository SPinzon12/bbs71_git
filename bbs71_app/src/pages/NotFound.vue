<template>
    <div>
        <h1>Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <router-link to="/">Ir a la página de inicio</router-link>
    </div>
</template>
  
<script>
export default {
    name: "NotFound",
};
</script>
  
<style scoped>
h1 {
    font-size: 3em;
    text-align: center;
}

p {
    text-align: center;
    margin-top: 1em;
}
</style>
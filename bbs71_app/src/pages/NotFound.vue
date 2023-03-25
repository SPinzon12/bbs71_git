<template>
    <Navbar></Navbar>
    <div class="container">
        <h1>Página no encontrada - 404</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <router-link to="/">Ir a la página de inicio</router-link>
    </div>
    <Footer></Footer>
</template>
  
<script>
import Navbar from '@/components/shared/Navbar.vue';
import Footer from '@/components/shared/Footer.vue';


export default {
    components: {
    Navbar,
    Footer
  },
    name: "NotFound",
};
</script>
  
<style scoped>
.container{
    min-height: 420px;
}
h1 {
    font-size: 3em;
    text-align: center;
    margin-top:30px
}

p {
    text-align: center;
    margin-top: 1em;
}
</style>
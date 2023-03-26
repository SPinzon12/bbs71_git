<template>
    <div class="navigation">
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item" @click="activateNavItem(0)">
                <span class="icon"><i class="fa-regular fa-paper-plane fa-xl"></i></span>
                <span class="title">Arrivals/Departures</span>
            </li>
            <li class="nav-item" @click="activateNavItem(1)">
                <span class="icon"><i class="fa-solid fa-cart-flatbed-suitcase fa-xl"></i></span>
                <span class="title">Airlines</span>
            </li>
            <li class="nav-item" @click="activateNavItem(2)">
                <span class="icon"><i class="fa-solid fa-plane-up fa-xl"></i></span>
                <span class="title">Flight routes</span>
            </li>
            <li class="nav-item" @click="activateNavItem(3)">
                <span class="icon"><i class="fa-solid fa-plane-departure fa-xl"></i></span>
                <span class="title">Time on the runway</span>
            </li>
        </ul>
    </div>
</template>
  
<script>
export default {
    methods: {
        activateNavItem(index) {
            const navItems = document.querySelectorAll(".nav-item");
            navItems.forEach((item) => {
                item.classList.remove("active");
            });
            navItems[index].classList.add("active");

            // emitir evento componenteSeleccionado con la opción seleccionada
            if (index === 0) {
                this.$emit("selected", "Arrivals/Departures");
            } else if (index === 1) {
                this.$emit("selected", "Airlines");
            } else if (index === 2) {
                this.$emit("selected", "Routes");
            } else if (index === 3) {
                this.$emit("selected", "Runway");
            }
        },
    },
};
</script>

<style scoped>
.navigation {
    margin-top: 20px;
    position: fixed;
    left: 20px;
    background: #f6c207;
    height: 80%;
    width: 300px;
    border-radius: 10px;
    border-left: 5px solid #f6c207;
    box-sizing: initial;
    transition: 0.5s;
}

.navigation ul {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    padding-left: 5px;
    padding-top: 40px;
}

.navigation ul li {
    list-style: none;
    position: relative;
    width: 100%;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    cursor: pointer;
}

.navigation ul li.active {
    background: #fff;
    font-size: 1.2rem;
}

.nav-item {
    margin-bottom: 10px;
    position: relative;
    display: block;
    width: 100%;
    display: flex;
    font-size: 1.1rem;
}

.icon {
    position: relative;
    display: block;
    min-width: 60px;
    height: 60px;
    line-height: 70px;
    text-align: center;
}


.title {
    position: relative;
    display: block;
    padding-left: 10px;
    height: 60px;
    line-height: 60px;
    white-space: normal;
}
</style>



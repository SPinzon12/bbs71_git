<template>
    <div class="navigation">
        <ul class="nav nav-pills flex-column mb-auto">
            <li v-for="(option, index) in menuOptions" class="nav-item"
                :class="index === 0 && selected === 0 ? 'active' : ''" @click="activateNavItem(index)">
                <span class="icon"><i :class="option.iconClass"></i></span>
                <span class="title">{{ option.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        menuOptions: {
            type: Array,
            required: true,
        },
        selected: {
            type: Number,
            required: true,
        },
    }, 
    methods: {
        activateNavItem(index) {
            const navItems = document.querySelectorAll(".nav-item");
            navItems.forEach((item) => {
                item.classList.remove("active");
            });
            navItems[index].classList.add("active");

            // emitir evento componenteSeleccionado con la opción seleccionada
            this.$emit("selected", index);
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



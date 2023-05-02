<template>
    <div class="navigation">
        <ul class="nav nav-pills flex-column mb-auto">
            <li v-for="(option, index) in menuOptions" class="nav-item" :class="{ active: selected === index }"
                @click="activateNavItem(index)" :key="index">
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
            // emitir evento componenteSeleccionado con la opción seleccionada
            this.$emit("selected", index);
        },
    },
};
</script>

<style scoped>
.navigation {
    margin-top: 20px;
    position: relative;
    left: -20px;
    background: #f6c207;
    width: 300px;
    border-radius: 10px;
    border-left: 5px solid #f6c207;
    box-sizing: initial;
    transition: 0.5s;
    margin-bottom: 40px;
}

.navigation ul {
    top: 0px;
    left: 0px;
    width: 100%;
    padding-left: 5px;
    padding-top: 20px;
    padding-bottom: 20px;
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
    font-weight: bold;
}

.nav-item {
    margin-bottom: 10px;
    position: relative;
    display: block;
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



<template>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
    </div>
    <section class=" gradient-form" style="background-color: #eee;">
        <div class="container">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-xl-10">
                    <div class="card rounded-3 text-black">
                        <div class="row g-0">
                            <div class="col-lg-6">
                                <div class="card-body p-md-5 mx-md-4">

                                    <div class="text-center">
                                        <!-- <img src="/src/img/logoc.png" style="width: 185px;" alt="logo"> -->
                                        <h4 class="mt-1 mb-5 pb-1">We are BlackBird</h4>
                                    </div>

                                    <form>
                                        <p>Inicia Sesion</p>

                                        <div class="form-outline mb-4">
                                            <input type="text" id="form2Example11" class="form-control"
                                                placeholder="Nombre de Usuario" v-model="login_form.user" required />
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="password" id="form2Example22" class="form-control"
                                                placeholder="Contraseña" v-model="login_form.password" required />
                                        </div>

                                        <div class="text-center pt-1 mb-5 pb-1">
                                            <button @click="login" class="btn btn-primary btn-block fa-lg mb-3"
                                                type="button">Log
                                                in</button>
                                            <br>
                                            <a class="text-muted">Olvidaste tu contraseña?</a>
                                        </div>

                                    </form>

                                </div>
                            </div>
                            <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                                <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                                    <h4 class="mb-4">Somos mas que simple "Pajaro Negro"</h4>
                                    <p class="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                        eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud
                                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
export default {
    data() {
        return {
            login_form: {},
        };
    },
    computed: {
        errorMessage() {
            return this.$store.state.user.error_message;
        },
    },
    methods: {
        login() {
            this.$store.dispatch("login", {
                password: this.login_form.password,
                user: this.login_form.user,
            });
        },
    },
};
</script>
  
<style>
.container {
    margin-bottom: 20px;
    margin-top: 20px;
}

.btn {
    height: 30px;
    border: none;
    background-color: #fb9120;
}

.btn1 {
    height: 34px;
    border: none;
    background-color: #fb9120;
    color: white
}

.gradient-custom-2 {
    /* fallback for old browsers */
    background: #fccb90;

    /* Chrome 10-25, Safari 5.1-6 */
    background: -webkit-linear-gradient(to right, #f6c207, #d8363a, black);

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: linear-gradient(to right, #f6c207, #d8363a, black);
}

@media (min-width: 768px) {
    .gradient-form {
        height: 100vh !important;
    }
}

@media (min-width: 769px) {
    .gradient-custom-2 {
        border-top-right-radius: .3rem;
        border-bottom-right-radius: .3rem;
    }
}
</style>
<template>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
    </div>
    <div class="container-fluid">
    <section class="gradient-form d-flex">
        <div class="container">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-xl-10">
                    <div class="card text-black">
                        <div class="row g-0">
                            <div class="col-lg-6">
                                <div class="card-body p-md-5 mx-md-4">

                                    <div class="text-center">
                                        <!-- <img src="/src/img/logoc.png" style="width: 185px;" alt="logo"> -->
                                        <h4 class="mt-1 mb-5 pb-1">We are BlackBird</h4>
                                    </div>

                                    <form>
                                        <p>Sign In</p>

                                        <div class="form-outline mb-4">
                                            <input type="text" id="form2Example11" class="form-control"
                                                placeholder="Username" v-model="login_form.user" required />
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="password" id="form2Example22" class="form-control"
                                                placeholder="Password" v-model="login_form.password" required />
                                        </div>

                                        <div class="text-center pt-1 mb-5 pb-1">
                                            <button @click="login" class="btn btn-primary btn-block fa-lg mb-3"
                                                type="button">Log
                                                in</button>
                                            <br>
                                            <a class="text-muted">Did you forget your password?</a>
                                        </div>

                                    </form>

                                </div>
                            </div>
                            <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                                <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                                    <h4 class="mb-4">We are just a single "BlackBird"</h4>
                                    <p class="small mb-0">BlackBird is a web platform that provides comprehensive data analysis and insights on aviation activities in Colombia. Our platform offers a user-friendly interface to access information on flight schedules, takeoffs, landings, airlines, and airports, among other key metrics. Stay up-to-date with the latest aviation trends and make informed decisions with BlackBird.</p> <h9 class="frase">¡BlackBird has you covered!</h9>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
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
  
<style scoped>
.frase{
    margin-top:15px
}
.row{
    border-color: #8d8d8d;
}
.card{
    border-radius: 20px;
    border-color: #8d8d8d;
}

.container-fluid{
    padding:0px
}
.container {
    margin-bottom: 20px;
    margin-top: 20px;
}

.btn {
    height: 30px;
    border: none;
    background-color: #fb9120;
    font-weight: 500;
    font-size: 17px;
    padding-bottom: 5px ;
    height: 50px;
}

.btn1 {
    height: 34px;
    border: none;
    background-color: #fb9120;
    color: white
}

.gradient-custom-2 {
    /* fallback for old browsers */
    background-color: #f6c207;

    /* Chrome 10-25, Safari 5.1-6 */
    background: -webkit-linear-gradient(to right, #f6c207, #d8363a);

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: linear-gradient(to right, #f6c207, #d8363a);
    border-color: #8d8d8d;
    
}

@media (min-width: 768px) {
    .gradient-form {
        height: 100vh !important;
        background-color: #8d8d8d;
        border-color: #8d8d8d;
    }
}

@media (min-width: 769px) {
    .gradient-custom-2 {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        border-color: #8d8d8d;

    }
}
</style>
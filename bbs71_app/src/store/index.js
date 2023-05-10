import { createStore } from "vuex";
import userStore from './user';
import airportStore from './airport'
import airlineStore from './airline'

export default createStore({
    modules:{
        user: userStore,
        airline: airlineStore,
        airport: airportStore,
    }
});

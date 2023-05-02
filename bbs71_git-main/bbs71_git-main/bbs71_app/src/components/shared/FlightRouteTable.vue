<template>
    <loading v-model:active="isLoading" :can-cancel="true" />
    <div class="container">
        <div class="form-group">
            <label class="table-name">
                <h1><i class="fa-regular fa-plane-tail"></i> Flight routes</h1>
            </label>
        </div>
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Route</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Flight Statistics</th>
                    <!-- <th scope="col">Cancelled</th>
                    <th scope="col">Diverted</th> -->
                    <th scope="col">Avg. Time</th>
                    <th scope="col">Scheduled Time</th>
                </tr>
            </thead>
            <tbody class="overflow-auto">
                <tr v-for="(route, i) in   displayedRoutes  " v-bind:key="i">
                    <td class="table-light">
                        <span :style="{
                                'font-weight': $store.state.user.user.type === 'airport' &&
                                    (route.origin === $store.state.user.user.name.substring(
                                        $store.state.user.user.name.indexOf('(') + 1,
                                        $store.state.user.user.name.indexOf(')')
                                    ))
                                    ? 'bold'
                                    : 'normal'
                            }">
                            {{ route.originCityName }}
                        </span>
                        <i class="fa-regular fa-plane"></i>
                        <span :style="{
                            'font-weight': $store.state.user.user.type === 'airport' &&
                                (route.dest === $store.state.user.user.name.substring(
                                    $store.state.user.user.name.indexOf('(') + 1,
                                    $store.state.user.user.name.indexOf(')')
                                ))
                                ? 'bold'
                                : 'normal'
                        }">
                            {{ route.destCityName }}
                        </span>
                    </td>
                    <td class="table-light">{{ route.distance }}</td>
                    <td class="table-light">
                        <span>{{ route.count }}</span>
                        <span class="mx-0">/</span>
                        <span>{{ route.cancelled }}</span>
                        <span class="mx-0">/</span>
                        <span>{{ route.diverted }}</span>
                    </td>
                    <!-- <td class="table-light">{{ route.cancelled }}</td>
                    <td class="table-light">{{ route.diverted }}</td> -->
                    <td :class="{
                        'text-success':
                            route.routeInfo.avgActElapsedTime <=
                            route.routeInfo.avgCrsElapsedTime,
                        'text-danger':
                            route.routeInfo.avgActElapsedTime >
                            route.routeInfo.avgCrsElapsedTime,
                    }
                        " class="table-light">
                        <b>{{ route.routeInfo.avgActElapsedTime }}</b>
                    </td>
                    <td class="table-light">{{ route.routeInfo.avgCrsElapsedTime }}</td>
                </tr>
            </tbody>
            <tbody v-if="displayedRoutes.length === 0">
                <tr>
                    <td colspan="7">
                        <div class="alert alert-warning text-center" role="alert">
                            No routes found.
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
            <div class="btn-group mr-2 mx-auto" role="group" aria-label="Button group with nested dropdown">
                <button v-if="page != 1" @click="page--" type="button" class="btn btn-warning">
                    <i class="fa-solid fa-angles-left"></i>
                </button>
                <button v-for="(  pageNumber, i  ) in   setRoutes.slice(page - 1, page + 2)  " @click="page = pageNumber"
                    :class="{
                            'btn btn-warning': page != pageNumber,
                            'btn btn-dark': page == pageNumber,
                        }
                        " type="button">
                    {{ pageNumber }}
                </button>
                <button v-if="page < pages.length" @click="page++" type="button" class="btn btn-warning">
                    <i class="fa-solid fa-angles-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
export default {
    props: {
        routes: {
            type: Array,
            required: true,
        },
    },
    components: {
        Loading,
    },
    data() {
        return {
            page: 1,
            perPage: 10,
            pages: [],
        };
    },
    computed: {
        displayedRoutes() {
            return this.paginate(this.routes);
        },
        setRoutes() {
            let numberOfPages = Math.ceil(this.routes.length / this.perPage);
            this.pages = [];
            for (let i = 1; i <= numberOfPages; i++) {
                this.pages.push(i);
            }
            return this.pages;
        },
        isLoading() {
            return this.$store.state.user.user.type === "airport"
                ? this.$store.state.airport.isLoading
                : this.$store.state.airline.isLoading;
        },
    },
    methods: {
        paginate(routes) {
            let page = this.page;
            let perPage = this.perPage;
            let from = page * perPage - perPage;
            let to = page * perPage;
            return routes.slice(from, to);
        },
    },
};
</script>

<style scoped>
.container {
    margin-top: 20px;
}

.form-group {
    background-color: #f6c207;
    border-radius: 10px 10px 0px 0px;
    height: 60px;
}

.table-name {
    font-size: 35px;
    font-weight: 600;
    margin-left: 15px;
}

span {
    padding-left: 10px;
    padding-right: 10px;
}

.btn {
    color: #212529;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.btn:active:focus,
.btn:focus {
    box-shadow: none !important;
}

.btn-dark {
    color: #fff;
}
</style>

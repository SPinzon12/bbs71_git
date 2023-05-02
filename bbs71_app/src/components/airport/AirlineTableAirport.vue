<template>
    <div class="container">
        <div class="form-group">
            <label class="table-name">
                <h1><i class="fa-solid fa-ticket-airline"></i> Airlines</h1>
            </label>
        </div>
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Airline</th>
                    <th scope="col">Number of Flights</th>
                </tr>
            </thead>
            <tbody class="overflow-auto">
                <tr v-for="(airline, i) in displayedAirlines" v-bind:key="airline.iata">
                    <td class="table-light"><b>({{ airline.iata }})</b> {{ airline.name }}</td>
                    <td class="table-light">{{ airline.count }}</td>
                </tr>
            </tbody>
            <tbody v-if="displayedAirlines.length === 0">
                <tr>
                    <td colspan="2">
                        <div class="alert alert-warning text-center" role="alert">
                            No airlines found.
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
                <button v-for="(pageNumber, i) in setAirlines.slice(page - 1, page + 2)" @click="page = pageNumber"
                    :class="{ 'btn btn-warning': page != pageNumber, 'btn btn-dark': page == pageNumber }" type="button">
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
export default {
    props: {
        airlines: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            page: 1,
            perPage: 8,
            pages: [],
        };
    },
    computed: {
        displayedAirlines() {
            return this.paginate(this.airlines)
        },
        setAirlines() {
            let numberOfPages = Math.ceil(this.airlines.length / this.perPage);
            this.pages = [];
            for (let i = 1; i <= numberOfPages; i++) {
                this.pages.push(i);
            }
            return this.pages;
        }
    },
    methods: {
        paginate(airlines) {
            let page = this.page;
            let perPage = this.perPage;
            let from = page * perPage - perPage;
            let to = page * perPage;
            return airlines.slice(from, to);
        }
    }
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
  
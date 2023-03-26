<template>
  <div class="container-fluid frame">
    <nav class="navbar navbar-expand-lg">
      <!-- Container wrapper -->
      <div class="container-fluid">
        <!-- Navbar brand -->
        <img id="logo" src="/src/assets/img_static/logoc.png" />
        <h1 class="title">BlackBird</h1>

        <!-- Toggle button -->
        <button class="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fas fa-bars"></i>
        </button>

        <!-- Collapsible wrapper -->
        <div class="collapse navbar-collapse" id="navbarSupportedContent">

          <form class="d-flex align-items-center w-100 form-search">
            <div class="input-group">
              <input type="search" class="form-control" placeholder="Buscar..." />
            </div>
            <a href="#!" class="text-white"><i class="fas fa-search ps-3"></i></a>
          </form>

          <ul class="navbar-nav ms-3">
            <li class="nav-item me-3">
              <a class="nav-link d-flex align-items-center">Aereopuerto</a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center me-3">
                <i class="fas fa-bookmark pe-2"></i> Aereolineas
              </a>
            </li>
            <ul class="navbar-nav d-flex flex-row me-2">
              <li>
                <div class="login-options">
                  <router-link class="btn" id="loginOption" to="/login">
                    <i class="fa-solid fa-user"></i> Inicia Sesion
                  </router-link>
                </div>
              </li>
            </ul>
          </ul>
        </div>
        <!-- Collapsible wrapper -->
      </div>
      <!-- Container wrapper -->
    </nav>
  </div>
</template>

<script>


</script>

<style scoped>
.fa-solid{
  margin-bottom: 5px;
}

.login-options{
  width: 140px;
}
.frame {
  padding: 0px;
}

.navbar {
  background-color: black;
}

.nav-link {
  color: white
}

#logo {
  height: 100px;
  width: 100px;
  margin-right: 10px;
}
#loginOption{
  margin-top: 5px;
}

.title {
  color: #f6c207;
  margin-right: 20px;
}

.btn {
    height: 30px;
    border: none;
    color:white;
}

.dropdown-menu {
  color: black
}

.dropdown:hover {
  color: #e86920
}

i {
  color: #e86920;
}
</style>

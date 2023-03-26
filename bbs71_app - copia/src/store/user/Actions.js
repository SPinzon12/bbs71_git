import { apiBBS71 } from "../../api/api";
import router from "@/router";

export async function login(context, details) {
  const { user, password } = details;
  try{
    const api = await apiBBS71.post("/user/login", {
      user: user,
      password: password,
    });
    if (api.status == 200) {
      const { data } = api;
      console.log(data);
      context.commit("set_user", data.usuario);
      if (data.usuario.type === "airport") {
        router.push({ name: "airport", params: { id: data.usuario.user_id } });
      } else {
        router.push({ name: "airline", params: { id: data.usuario.user_id } });
      }
      
    }
  }catch(err){
    console.error(err);
    const message = err.response.data.error; // asumiendo que el mensaje de error se devuelve en una llave llamada "error" en la respuesta de la API
    context.commit("set_error_message", message);
  }




}

export async function logout(context) {
  context.commit("clear_user");
  router.push("/");
}

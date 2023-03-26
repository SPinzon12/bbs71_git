// import { apiAlmacen } from '../../api/api';

// export async function getProducts (context) {
//     const api = await apiAlmacen.get('/products')
//     if (api.status == 200){
//       const { data } = api
//       context.commit('setProducts', data.inProduct)
//     } 
// }

// export async function findProduct (context, details) {
//     const { id } = details;
//     const api = await apiAlmacen.get(`/products/${id}`)
//     if (api.status == 200){
//         const { data } = api
//         console.log(api)
//         context.commit('setProduct',data.product)
//     }
// }

// export async function newProduct (context, details) {
//     console.log(details)
//     const api = await apiAlmacen.post('/products/new', details)
//     if (api.status == 200){
//         console.log(api.data)
//         context.dispatch('getProducts')
//     }
// }

// export async function editProduct (context, details) {
//     const { id, ...product } = details;
//     const api = await apiAlmacen.put(`/products/${id}`, product)
//     if (api.status == 200){
//         console.log(api.data)
//         context.dispatch('getProducts')
//     }
// }

// export async function delProduct (context, details) {
//     const { id } = details;
//     const api = await apiAlmacen.delete(`/products/${id}`)
//     if (api.status == 200){
//         console.log(api.data)
//         context.dispatch('getProducts')
//     }
// }

// export async function close (context) {
//     context.commit('unsetProduct')
// }
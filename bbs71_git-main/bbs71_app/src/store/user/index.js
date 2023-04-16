import state from './State';
import * as mutations from './Mutations'
import * as actions from './Actions'

const users = {
    state: state,
    actions: actions,
    mutations: mutations
}
export default users;
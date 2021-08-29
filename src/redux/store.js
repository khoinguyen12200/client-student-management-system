import {createStore,combineReducers,applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import managerReducer,{actions as managerActions} from './manager';


const reducer = combineReducers({
    manager:managerReducer,
})

const store = createStore(reducer,applyMiddleware(thunk));


export const actions = {
    manager:managerActions
}
export default store;
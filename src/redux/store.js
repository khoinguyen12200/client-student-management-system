import {createStore,combineReducers,applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import managerReducer,{actions as managerActions} from './manager';
import departmentsReducer,{actions as departmentsActions} from './departments';
import majorsReducer,{actions as majorsActions} from './majors'
import classReducer,{actions as classActions} from './classMajor'

const reducer = combineReducers({
    manager:managerReducer,
    departments:departmentsReducer,
    majors:majorsReducer,
    class:classReducer
})

const store = createStore(reducer,applyMiddleware(thunk));


export const actions = {
    manager:managerActions,
    departments:departmentsActions,
    majors:majorsActions,
    class:classActions,
}
export default store;
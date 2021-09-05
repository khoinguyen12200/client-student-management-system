import {createStore,combineReducers,applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import managerReducer,{actions as managerActions} from './manager';
import departmentsReducer,{actions as departmentsActions} from './departments';
import majorsReducer,{actions as majorsActions} from './majors'
import classReducer,{actions as classActions} from './classMajor'
import instructorReducer,{actions as instructorActions} from './instructor'
import studentReducer,{actions as studentActions} from './student'



const reducer = combineReducers({
    manager:managerReducer,
    departments:departmentsReducer,
    majors:majorsReducer,
    class:classReducer,
    instructor:instructorReducer,
    student:studentReducer,
})

const store = createStore(reducer,applyMiddleware(thunk));


export const actions = {
    manager:managerActions,
    departments:departmentsActions,
    majors:majorsActions,
    class:classActions,
    instructor:instructorActions,
    student:studentActions,
}
export default store;
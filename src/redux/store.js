import {createStore,combineReducers,applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import accountReducer,{actions as accountActions} from './account';
import departmentsReducer,{actions as departmentsActions} from './departments';
import majorsReducer,{actions as majorsActions} from './majors'
import classReducer,{actions as classActions} from './classMajor'
import instructorReducer,{actions as instructorActions} from './instructor'
import studentReducer,{actions as studentActions} from './student'
import editableReducer,{actions as editableActions} from './editable'
import managerReducer,{actions as managerActions} from './manager'

const reducer = combineReducers({
    account:accountReducer,
    departments:departmentsReducer,
    majors:majorsReducer,
    class:classReducer,
    instructor:instructorReducer,
    student:studentReducer,
    editable:editableReducer,
    manager:managerReducer,
})

const store = createStore(reducer,applyMiddleware(thunk));


export const actions = {
    account:accountActions,
    departments:departmentsActions,
    majors:majorsActions,
    class:classActions,
    instructor:instructorActions,
    student:studentActions,
    editable:editableActions,
    manager:managerActions,
}
export default store;
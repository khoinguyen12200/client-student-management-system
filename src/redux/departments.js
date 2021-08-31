import axios from "axios"

const initialState = {
    list:[]
}

const name = {
    setDepartments:"departments-set-departments"
}

function setDepartments(d){
    return { type: name.setDepartments, payload: d}
}

const reloadDepartments = () => async(dispatch)=>{
    const res = await axios.get("/api/manager/department");
    dispatch(actions.setDepartments(res.data))
}


export const actions = {
    setDepartments,reloadDepartments,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setDepartments:
            const d = action.payload;
            return { ...state, list:d };

        default:
            return { ...state };
    }
};

export default reducer;
import axios from "axios"

const initialState = {
    list:[]
}

const name = {
    setClass:"class-major-set-class"
}

function setClass(d){
    return { type: name.setClass, payload: d}
}

const reloadClass = () => async(dispatch)=>{
    const res = await axios.get("/api/manager/class-major");
    dispatch(actions.setClass(res.data))
}


export const actions = {
    setClass,reloadClass,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setClass:
            const d = action.payload;
            return { ...state, list:d };

        default:
            return { ...state };
    }
};

export default reducer;
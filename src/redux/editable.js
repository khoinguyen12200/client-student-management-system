import axios from "axios"

const initialState = {
    info:null
}

const name = {
    setEditable:"editable-set-edit"
}

function setEditable(ed) {
    return { type: name.setEditable, payload: ed}
}

const reloadEditable = () => async(dispatch)=>{
    const res = await axios.get("/api/editable");
    console.log(res.data)
    dispatch(actions.setEditable(res.data))
}


export const actions = {
    setEditable,reloadEditable,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setEditable:
            const ed = action.payload;
            return {...state,info:ed};

        default:
            return { ...state };
    }
};

export default reducer;
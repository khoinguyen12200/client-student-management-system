import axios from "axios"

const initialState = {
    list:[]
}

const name = {
    setManagerList:"manager-set-list"
}

function setManagerList(list) {
    return { type: name.setManagerList, payload: list}
}

const reloadManager = () => async(dispatch)=>{
    const res = await axios.get("/api/manager",{withCredentials:true});
    console.log(res.data)
    dispatch(actions.setManagerList(res.data))
}


export const actions = {
    setManagerList,reloadManager,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setManagerList:
            const d = action.payload;
            return { ...state, list:d };

        default:
            return { ...state };
    }
};

export default reducer;
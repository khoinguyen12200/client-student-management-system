import axios from "axios"

const initialState = {
    list:[]
}

const name = {
    setInstructorList:"instructor-set-list"
}

function setInstructorList(list) {
    return { type: name.setInstructorList, payload: list}
}

const reloadInstructor = () => async(dispatch)=>{
    const res = await axios.get("/api/instructor");
    dispatch(actions.setInstructorList(res.data))
}


export const actions = {
    setInstructorList,reloadInstructor,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setInstructorList:
            const d = action.payload;
            return { ...state, list:d };

        default:
            return { ...state };
    }
};

export default reducer;
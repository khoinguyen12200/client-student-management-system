import axios from "axios"

const initialState = {
    list:[]
}

const name = {
    setStudentList:"student-set-list"
}

function setStudentList(list) {
    return { type: name.setStudentList, payload: list}
}

const reloadStudent = () => async(dispatch)=>{
    const res = await axios.get("/api/student");
    dispatch(actions.setStudentList(res.data))
}


export const actions = {
    setStudentList,reloadStudent,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setStudentList:
            const d = action.payload;
            return { ...state, list:d };

        default:
            return { ...state };
    }
};

export default reducer;
import axios from "axios"

const initialState = {
    list:[]
}

const name = {
    setMajor:"majors-set-majors"
}

function setMajors(d){
    return { type: name.setMajor, payload: d}
}

const reloadMajors = () => async(dispatch)=>{
    const res = await axios.get("/api/manager/major");
    console.log("res",res)
    dispatch(actions.setMajors(res.data))
}


export const actions = {
    setMajors,reloadMajors,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setMajor:
            const majors = action.payload;
            console.log(majors)
            return { ...state, list:majors };

        default:
            return { ...state };
    }
};

export default reducer;
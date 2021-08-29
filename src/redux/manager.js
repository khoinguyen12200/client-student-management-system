import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { sha256 } from "js-sha256";

const initialState = {
    info: null,
};

function setInfo(info) {
    return { type: name.setInfo, payload: info };
}
const login = (values, onDone) => async (dispatch, getState) => {
    try {
        const { account, password } = values;
        const formdata = { account, password: sha256(password) };
        const res = await axios.post("/api/manager/login", formdata);
        const { e, m, info } = res.data;
        console.log(res.data);
        dispatch(actions.setInfo(info));
        if (e) throw new Error(m);
        toast(m, { type: "success" });
        if (onDone ) onDone(true);
    } catch (e) {
        toast(e.message, { type: "error" });
        if (onDone) onDone(false);
    }

    
};

const autoLogin = () => async (dispatch, getState) =>{
    const current = Cookies.get("csrf_access_token")
   
    if(current){
        try{
            const res = await axios.get("/api/manager/auto-login", {},{withCredentials:true});
            console.log(res)
            const { e, m, info } = res.data;
            if(e) throw new Error(m);
            dispatch(actions.setInfo(info));
        }catch(e){
            
        }
       
    }
}

const logout = () => (dispatch, getState) =>{
    Cookies.remove("csrf_access_token")
    Cookies.remove("access_token_cookie")
    dispatch(actions.setInfo(null))
}

const name = {
    setInfo: "manager-set-info",
};
export const actions = {
    setInfo,
    login,
    logout,
    autoLogin,
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case name.setInfo:
            const info = action.payload;
            return { ...state, info };
        default:
            return { ...state };
    }
};

export default reducer;

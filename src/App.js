import logo from "./logo.svg";
import axios from "axios";
import React from "react";
import "./styles.scss";

import { Switch, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Manager from "./pages/Manager";

import "react-toastify/dist/ReactToastify.css";

import { useSelector, useDispatch } from "react-redux";
import { actions } from "./redux/store";

function App() {
    const info = useSelector((state) => state.account.info);
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(actions.account.autoLogin());
    }, []);
    React.useEffect(() => {
        if (!info) return;
        dispatch(actions.departments.reloadDepartments());
        dispatch(actions.majors.reloadMajors());
        dispatch(actions.class.reloadClass())
        dispatch(actions.instructor.reloadInstructor());
        dispatch(actions.student.reloadStudent())
        dispatch(actions.editable.reloadEditable())
        dispatch(actions.manager.reloadManager())
    }, [info]);
    return (
        <div className="App">
            <ToastContainer />
            {/* <div>
                <Navbar />
            </div> */}
            <div>
                <Switch>
                    {/* <Route path="/" exact>
                        <Home />
                    </Route> */}
                    <Route path="/" exact>
                        <Login />
                    </Route>
                    {info && (
                        <Route path="/manager">
                            <Manager />
                        </Route>
                    )}
                </Switch>
            </div>
        </div>
    );
}

export default App;

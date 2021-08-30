import React from "react";
import { Switch, Route, Link ,useLocation,Redirect } from "react-router-dom";
import { AiFillLeftCircle } from "react-icons/ai";
import {FaSchool} from 'react-icons/fa'
import { MdSupervisorAccount } from "react-icons/md";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";


import Account from "./Account"
import ChangePassword from "./ChangePassword";
import ChangeName from "./ChangeName";

import Deparment from "./Deparment"

const variants = {
    expanded: {
        width: 150,
        x: 10,
    },
    collapsed: {
        width: 0,
        x: 0,
    },
};

export default function Manager() {
    const info = useSelector((state) => state.manager.info);
    
    const location = useLocation();
    const [expanded, setExpanded] = React.useState(true);
    const toggleNav = () => {
        setExpanded(!expanded);
    };
    return (
        <div className="manager-page">
            
            {location.pathname === "/manager" && <Redirect to="/manager/account"/>}
            <div className="manager-nav">
                <div className="title">
                    <motion.div
                        variants={variants}
                        initial={!expanded ? "expanded" : "collapsed"}
                        animate={expanded ? "expanded" : "collapsed"}
                        transition={{ type: "tween", duration: 0.5 }}
                        className="name"
                    >
                        {info.FULL_NAME}
                    </motion.div>
                    <motion.div
                        animate={!expanded ? { rotateY: 180 } : { rotateY: 0 }}
                        transition={{ type: "tween", duration:0.8}}
                        className="toggle"
                    >
                        <AiFillLeftCircle onClick={toggleNav} />
                    </motion.div>
                </div>
                <div className="nav-content">
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/account"
                        icon={<MdSupervisorAccount/>}
                    >
                        Tài khoản
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/department"
                        icon={<FaSchool />}
                    >
                        Khoa - Đoàn thể
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/account2"
                        icon={<MdSupervisorAccount />}
                    >
                        Tài khoản
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/account3"
                        icon={<MdSupervisorAccount />}
                    >
                        Tài khoản
                    </LinkIcon>
                </div>
            </div>
            <div className="manager-content">
                <Switch>
                    <Route path="/manager/account" exact><Account/></Route>
                    <Route path="/manager/account/change-password" exact><ChangePassword/></Route>
                    <Route path="/manager/account/change-name" exact> <ChangeName/></Route>
                    <Route path="/manager/department" exact><Deparment/></Route>
                </Switch>
            </div>
        </div>
    );
}

function LinkIcon({ icon, link, children, expanded }) {
    const location = useLocation();
    const enbled = React.useMemo(()=>{
        return location.pathname.indexOf(link) !== -1
    },[location,link])


    return (
        <Link to={link} className={enbled ? "link enabled" :"link"}>
            <div className="icon">{icon}</div>
            <motion.div
                variants={variants}
                initial={!expanded ? "expanded" : "collapsed"}
                animate={expanded ? "expanded" : "collapsed"}
                transition={{ type: "tween", duration: 0.5 }}
                className="name"
            >
                <div>{children}</div>
            </motion.div>
        </Link>
    );
}

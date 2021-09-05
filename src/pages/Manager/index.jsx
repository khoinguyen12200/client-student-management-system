import React from "react";
import { Switch, Route, Link ,useLocation,Redirect } from "react-router-dom";
import { AiFillLeftCircle,AiFillDatabase } from "react-icons/ai";
import {FaSchool,FaChalkboardTeacher} from 'react-icons/fa'
import {HiUserGroup,HiKey} from 'react-icons/hi'
import {MdAccountBox} from 'react-icons/md'
import { MdSchool } from "react-icons/md";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";


import Account from "./Account"
import ChangePassword from "./ChangePassword";
import ChangeName from "./ChangeName";

import Deparment from "./Deparment"
import Major from "./Major"
import MajorClass from './MajorClass'
import Instructor from "./Instructor"
import Student from "./Student"
import DetailClass from "./DetailClass"


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
                       
                    >
                        <div  className="name">
                            <HiKey className="mr-2"/>
                            {info.FULL_NAME}
                        </div>
                       
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
                        icon={<MdAccountBox/>}
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
                        link="/manager/major"
                        icon={<AiFillDatabase />}
                    >
                        Chuyên ngành
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/class-major"
                        icon={<HiUserGroup />}
                    >
                        Lớp chuyên ngành
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/instructor"
                        icon={<FaChalkboardTeacher />}
                    >
                        Giáo viên cố vấn
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/student"
                        icon={<MdSchool />}
                    >
                        Sinh viên
                    </LinkIcon>
                </div>
            </div>
            <div className="manager-content">
                <Switch>
                    <Route path="/manager/account" exact><Account/></Route>
                    <Route path="/manager/account/change-password" exact><ChangePassword/></Route>
                    <Route path="/manager/account/change-name" exact> <ChangeName/></Route>
                    <Route path="/manager/department" exact><Deparment/></Route>
                    <Route path="/manager/major" exact><Major/></Route>
                    <Route path="/manager/class-major" exact><MajorClass/></Route>
                    <Route path="/manager/class-major/:name"><DetailClass/></Route>
                    <Route path="/manager/instructor" exact><Instructor/></Route>
                    <Route path="/manager/student" exact><Student/></Route>
                    
                    
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

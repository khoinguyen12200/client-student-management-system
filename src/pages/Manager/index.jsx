import React from "react";
import { Switch, Route, Link, useLocation, Redirect } from "react-router-dom";
import {
    AiFillLeftCircle,
    AiFillDatabase,
    AiFillSetting,
} from "react-icons/ai";
import { FaSchool, FaChalkboardTeacher, FaUserTie } from "react-icons/fa";
import { HiUserGroup, HiKey } from "react-icons/hi";
import { MdAccountBox } from "react-icons/md";
import { MdSchool } from "react-icons/md";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import * as Const from "../../const";
import Account from "./Account";
import ChangePassword from "./ChangePassword";
import ChangeName from "./ChangeName";

import Deparment from "./Deparment";
import Major from "./Major";
import MajorClass from "./MajorClass";
import Instructor from "./Instructor";
import Student from "./Student";
import DetailClass from "./DetailClass";
import System from "./System";
import Administrator from "./Administrator";

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
    const info = useSelector((state) => state.account.info);
    const editable = useSelector((state) => state.editable.info);
    const location = useLocation();
    const [expanded, setExpanded] = React.useState(true);
    const toggleNav = () => {
        setExpanded(!expanded);
    };
    return (
        <div className="manager-page">
            {location.pathname === "/manager" && (
                <Redirect to="/manager/account" />
            )}
            <div className="manager-nav">
                <div className="title">
                    <motion.div
                        variants={variants}
                        initial={!expanded ? "expanded" : "collapsed"}
                        animate={expanded ? "expanded" : "collapsed"}
                        transition={{ type: "tween", duration: 0.5 }}
                    >
                        <div className="name">
                            <HiKey className="mr-2" />
                            {info.FULL_NAME}
                        </div>
                    </motion.div>
                    <motion.div
                        animate={!expanded ? { rotateY: 180 } : { rotateY: 0 }}
                        transition={{ type: "tween", duration: 0.8 }}
                        className="toggle"
                    >
                        <AiFillLeftCircle onClick={toggleNav} />
                    </motion.div>
                </div>
                <div className="nav-content">
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/account"
                        icon={<MdAccountBox />}
                    >
                        T??i kho???n
                    </LinkIcon>
                    {info?.ROOT == 1 && (
                        <LinkIcon
                            expanded={expanded}
                            link={Const.paths.system}
                            icon={<AiFillSetting />}
                        >
                            H??? th???ng
                        </LinkIcon>
                    )}
                    <LinkIcon
                        expanded={expanded}
                        link={Const.paths.administrator}
                        icon={<FaUserTie />}
                    >
                        Qu???n tr??? vi??n
                    </LinkIcon>

                    <LinkIcon
                        expanded={expanded}
                        link="/manager/department"
                        icon={<FaSchool />}
                    >
                        Khoa - ??o??n th???
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/major"
                        icon={<AiFillDatabase />}
                    >
                        Chuy??n ng??nh
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/class-major"
                        icon={<HiUserGroup />}
                    >
                        L???p chuy??n ng??nh
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/instructor"
                        icon={<FaChalkboardTeacher />}
                    >
                        Gi??o vi??n c??? v???n
                    </LinkIcon>
                    <LinkIcon
                        expanded={expanded}
                        link="/manager/student"
                        icon={<MdSchool />}
                    >
                        Sinh vi??n
                    </LinkIcon>
                </div>
            </div>
            <div className="manager-content">
                <Switch>
                    <Route path="/manager/account" exact>
                        <Account />
                    </Route>
                    <Route path="/manager/account/change-password" exact>
                        <ChangePassword />
                    </Route>
                    <Route path="/manager/account/change-name" exact>
                        <ChangeName />
                    </Route>
                    <Route path="/manager/department" exact>
                        <Deparment />
                    </Route>
                    <Route path="/manager/major" exact>
                        <Major />
                    </Route>
                    <Route path="/manager/class-major" exact>
                        <MajorClass />
                    </Route>
                    <Route path="/manager/class-major/:name">
                        <DetailClass />
                    </Route>
                    <Route path="/manager/instructor" exact>
                        <Instructor />
                    </Route>
                    <Route path="/manager/student" exact>
                        <Student />
                    </Route>
                    {info?.ROOT && (
                        <Route path={Const.paths.system} exact>
                            <System />
                        </Route>
                    )}
                    <Route path={Const.paths.administrator} exact>
                        <Administrator />
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

function LinkIcon({ icon, link, children, expanded }) {
    const location = useLocation();
    const enbled = React.useMemo(() => {
        return location.pathname.indexOf(link) !== -1;
    }, [location, link]);

    return (
        <Link to={link} className={enbled ? "link enabled" : "link"}>
            
            <div className="bot"/>
            <div className="topback"/>
            <div className="top"/>
            <div className="botback"/>
            <div className="content">
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
            </div>
        </Link>
    );
}

import { motion } from "framer-motion";
import React from "react";
import { useLocation } from "react-router-dom";

export default function Shadow() {
    const location = useLocation();

    const [position, setPosition] = React.useState(null);
    React.useEffect(() => {
        setTimeout(() => {
            const ob = getPositionByRelativePath(location.pathname);
            setPosition(ob);
        }, 100);
    }, [location]);

    const animate = position
        ? {
              x: position.x,
              y: position.y+1,
              width: position.w,
              height : position.h,
          }
        : undefined;


    return (
        <motion.div
            transition={{ type: "spring", damping: 15 }}
            className="shadow-navbar"
            animate={animate}
        />
    );
}

const NAV_ID = "navbar-nav";

function getPositionByRelativePath(pathName) {
    let str = pathName + "";
    const result = getElementPosition(str);
    if (result) return result;
    while (str.lastIndexOf("/") !== -1) {
        const last = str.lastIndexOf("/");
        str = str.slice(0, last);
        const result = getElementPosition(str);
        if (result) return result;
    }
    return null;
}

function getElementPosition(pathName) {
    const element = document.getElementById(NAV_ID);
    if (element) {
        const node = findNode(element, pathName);
        if (node) return getPosition(element, node);
    }
    return null;
}
function getPosition(parent, child) {
    var x = 0;
    var w = 0;
    var h = 0;
    var y = 0;
    if (parent && child) {
        const boundParent = parent.getBoundingClientRect();
        const boundChild = child.getBoundingClientRect();
        x = boundChild.x - boundParent.x;
        y = boundChild.y - boundParent.y;
        w = boundChild.width;
        h = boundChild.height;
    }
    return { x, y, w, h };
}
function findNode(element, pathName) {
    if (checkNode(element, pathName)) return element;

    const childs = element.children;
    for (let i = 0; i < childs.length; i++) {
        const node = findNode(childs[i], pathName);
        if (node) return node;
    }
}

function checkNode(element, pathName) {
    return (
        (element.tagName === "a" || element.tagName === "A") &&
        element.getAttribute("href") === pathName
    );
}

import React from "react";
import { Link } from "react-router-dom";
import Shadow from "./ShadowNav";
import { useSelector } from "react-redux";

export default function Navbar() {
    const info = useSelector((state) => state.manager.info);

    return (
        <>
            <div id="navbar-nav" className="mynavbar">
                <div className="nav-content">
                    <div className="space1">
                        <Link to="/">Trang chủ</Link>
                    </div>
                    <div className="space2">
                        {info == null ? (
                            <Link to="/login">Đăng nhập</Link>
                        ) : (
                            <Link to="/manager">{info.FULL_NAME}</Link>
                        )}
                    </div>
                </div>

                <Shadow />
            </div>
        </>
    );
}

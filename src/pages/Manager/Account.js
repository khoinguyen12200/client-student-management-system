import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { actions } from "../../redux/store";
import { Redirect } from "react-router-dom";
import * as Validation from "../../const/Validation"


export default function Account() {
    const dispatch = useDispatch();
    const info = useSelector((state) => state.manager.info);
    const [redirect, setRedirect] = React.useState(null);

    function logout() {
        setRedirect("/login");
        setTimeout(() => {
            dispatch(actions.manager.logout());
        }, 1000);
    }
    return (
        <div className="account-page p-3">
            {redirect && <Redirect to={redirect} />}
            <h1>Thông tin tài khoản</h1>
            <div className="content mt-5">
                <div className="input-group mb-3">
                    <span className="input-group-text">Tên đăng nhập</span>
                    <div className="form-control">{info.ACCOUNT}</div>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Mật khẩu</span>
                    <div className="form-control">******</div>
                    <Link
                        to="/manager/account/change-password"
                        className="btn btn-secondary"
                    >
                        Thay đổi
                    </Link>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Tên hiển thị</span>
                    <div className="form-control">{info.FULL_NAME}</div>
                    <Link to="/manager/account/change-name" className="btn btn-secondary">Thay đổi</Link>
                </div>
                <div className="btn-space">
                    <button onClick={logout} className="btn btn-outline-danger">
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
}

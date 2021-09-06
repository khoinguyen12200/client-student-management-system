import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { actions } from "../../redux/store";
import { Redirect } from "react-router-dom";
import * as Validation from "../../const/Validation";
import * as Const from "../../const";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
export default function Account() {
    const dispatch = useDispatch();
    const info = useSelector((state) => state.account.info);
    const [redirect, setRedirect] = React.useState(null);

    return (
        <div className="account-page p-3">
            <h1 className="page-title">Thông tin tài khoản</h1>
            <div className="content mt-5">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Tên đăng nhập</span>
                    </div>

                    <div className="form-control">{info.ACCOUNT}</div>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Mật khẩu</span>
                    </div>

                    <div className="form-control">******</div>
                    <div className="input-group-append">
                        <Link
                            to="/manager/account/change-password"
                            className="btn btn-secondary"
                        >
                            Thay đổi
                        </Link>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Tên hiển thị</span>
                    </div>

                    <div className="form-control">{info.FULL_NAME}</div>
                    <div className="input-group-append">
                        <Link
                            to="/manager/account/change-name"
                            className="btn btn-secondary"
                        >
                            Thay đổi
                        </Link>
                    </div>
                </div>
                <div className="btn-space"><LogOutButton/></div>
            </div>
        </div>
    );
}

function LogOutButton({}) {
    const dispatch = useDispatch();
    const [redirect, setRedirect] = React.useState(null);

    function logout() {
        setRedirect(Const.paths.login);
        setTimeout(() => {
            dispatch(actions.account.logout());
        }, 1000);
    }

    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };

    return (
        <>
            {redirect && <Redirect to={redirect} />}
            <button onClick={toggle} className="btn btn-outline-danger">
                Đăng xuất
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Xác nhận đăng xuất</ModalHeader>
                <ModalBody>
                    <div className="alert alert-danger">
                        Bạn có muốn đăng xuất khỏi tài khoản hiện tại ?
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={logout}
                        type="submit"
                        color="danger"
                    >
                        Xác nhận
                    </Button>
                    <Button type="button" color="secondary" onClick={toggle}>
                        Hủy bỏ
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

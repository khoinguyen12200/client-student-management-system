import React from "react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Redirect, useLocation, Link } from "react-router-dom";
import axios from "axios";

import { MdModeEdit } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlineSearch, AiFillFileAdd } from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import * as Validation from "../../const/Validation";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../redux/store";
import InputField, {
    FormikField,
    FormikSelectField,
    SelectField,
    LoadingButton,
} from "../../components/InputField";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { sha256 } from "js-sha256";
import * as Const from "../../const";

export default function Administrator() {
    const info = useSelector((state) => state.account.info);
    return (
        <div className="admin-page p-3">
            <center className="mb-3">
                <h1 className="page-title">Quản trị viên</h1>
            </center>
            <div className="headSpace mt-3">
                <div></div>
                <div>{info?.ROOT == 1 && <AddManager />}</div>
            </div>
            <List />
        </div>
    );
}

function AddManager({}) {
    const dispatch = useDispatch();
    const initialValues = {
        account: "",
        password: "",
        confirmPassword: "",
        fullName: "",
    };
    const validationSchema = Yup.object({
        account: Validation.account,
        password: Validation.password,
        confirmPassword: Validation.confirmPassword,
        fullName: Validation.name,
    });

    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        const { account, password, fullName } = values;
        setSubmitting(true);
        try {
            const sendData = {
                account,
                password: sha256(password),
                fullName,
            };
            const res = await axios.post("/api/manager", sendData, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.manager.reloadManager());
            resetForm(initialValues);
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    return (
        <>
            <button onClick={toggle} className="btn btn-outline-primary">
                <AiFillFileAdd /> Thêm tài khoản quản trị
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Thêm tài khoản quản trị viên
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <FormikField
                                    type="text"
                                    label="Tài khoản"
                                    name="account"
                                />
                                <FormikField
                                    type="password"
                                    label="Mật khẩu"
                                    name="password"
                                />
                                <FormikField
                                    type="password"
                                    label="Nhập lại mật khẩu"
                                    name="confirmPassword"
                                />
                                <FormikField
                                    label="Tên hiển thị"
                                    name="fullName"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <LoadingButton
                                    type="submit"
                                    loading={formik.isSubmitting}
                                    className="btn btn-primary mr-2"
                                >
                                    Xác nhận
                                </LoadingButton>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={toggle}
                                >
                                    Hủy bỏ
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
}

function List() {
    const info = useSelector((state) => state.account.info);
    const managers = useSelector((state) => state.manager.list);
    return (
        <table class="table table-striped table-bordered mt-3">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#ID</th>
                    <th scope="col">Tài khoản</th>
                    <th scope="col">Tên hiển thị</th>
                    <th scope="col"><center>Quyền quản trị</center></th>
                    {info?.ROOT == 1 && (
                        <th scope="col">
                            <center>Hành động</center>
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {managers.map((manager) => (
                    <Manager manager={manager} />
                ))}
            </tbody>
        </table>
    );
}

function Manager({ manager }) {
    const info = useSelector((state) => state.account.info);
    const { ID, ACCOUNT, FULL_NAME, ROOT } = manager;
    return (
        <tr>
            <th scope="col">{ID}</th>
            <td>{ACCOUNT}</td>
            <td>{FULL_NAME}</td>
            <td>
                {ROOT == 1 && (
                    <center className="checkedKey">
                        <FaKey />
                    </center>
                )}
            </td>
            {info?.ROOT == 1 && (
                <td className="col-md-auto">
                    <center>
                        {ROOT ? (
                            <ChangeRootManager manager={manager} />
                        ) : (
                            <DeleteManager manager={manager} />
                        )}
                    </center>
                </td>
            )}
        </tr>
    );
}

function ChangeRootManager({ manager }) {
    const dispatch = useDispatch();
    const initialValues = { password: "", toId: "" };
    const validationSchema = Yup.object({
        password: Validation.password,
        toId: Validation.id,
    });
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        const sendData = {
            toId: values.toId,
            password: sha256(values.password),
        };
        try {
            const res = await axios.patch(
                "/api/manager/change-root",
                sendData,
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.manager.reloadManager());
            dispatch(actions.account.autoLogin());
            resetForm(initialValues);
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    const managers = useSelector((state) => state.manager.list);
    const dataSelect = React.useMemo(() => {
        return managers.map((m) => ({ key: m.ACCOUNT, value: m.ID }));
    }, [managers]);
    return (
        <>
            <button onClick={toggle} className="btn btn-primary">
                <FaKey /> Chuyển quyền quản trị
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Yêu cầu xác nhận thay đổi quyền quản trị
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <div className="alert alert-danger">
                                    Hành động thay đổi quyền quản trị sẽ không
                                    thể hoàn lại, Bạn có chắc muốn nhường quyền
                                    quản trị cho người khác không ?
                                </div>
                                <FormikField
                                    label="Xác nhận mật khẩu"
                                    name="password"
                                    type="password"
                                />
                                <FormikSelectField
                                    label="Người nhận quyền quản trị"
                                    data={dataSelect}
                                    defaultValue={null}
                                    name="toId"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <LoadingButton
                                    type="submit"
                                    loading={formik.isSubmitting}
                                    className="btn btn-danger mr-2"
                                >
                                    Xác nhận
                                </LoadingButton>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={toggle}
                                >
                                    Hủy bỏ
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
}

function DeleteManager({ manager }) {
    const dispatch = useDispatch();
    const initialValues = { password: "" };
    const validationSchema = Yup.object({
        password: Validation.password,
    });
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        const sendData = {
            id: manager.ID,
            password: sha256(values.password),
        };
        try {
            const res = await axios.delete(
                "/api/manager",
                { data: sendData },
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.manager.reloadManager());
            resetForm(initialValues);
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    return (
        <>
            <button onClick={toggle} className="btn btn-danger">
                <BsFillTrashFill /> Xóa tài khoản
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Yêu cầu xác nhận xóa</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <div className="alert alert-danger">
                                    Hành động này có thể ảnh hưởng nghiêm trọng
                                    đến dữ liệu khác, hãy xác nhận mật khẩu nếu
                                    bạn thật sự muốn xóa !
                                </div>
                                <FormikField
                                    label="Mật khẩu"
                                    name="password"
                                    type="password"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <LoadingButton
                                    type="submit"
                                    loading={formik.isSubmitting}
                                    className="btn btn-danger mr-2"
                                >
                                    Xác nhận xóa
                                </LoadingButton>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={toggle}
                                >
                                    Hủy bỏ
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
}

import React from "react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Redirect, useLocation, Link } from "react-router-dom";
import axios from "axios";

import { MdModeEdit } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlineSearch, AiFillFileAdd } from "react-icons/ai";
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
import { EditStudent, DeleteStudent } from "./DetailClass";

export default function System() {
    const editable = useSelector((state) => state.editable.info);

    return (
        <div className="system-page p-3">
            <center className="mb-3">
                <h1 className="page-title">Quản lý hệ thống</h1>
            </center>
            <div className="headSpace">
                <table class="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Quyền thày đổi hệ thống</th>
                        </tr>
                    </thead>
                    <tbody>
                        <SystemCheckRow
                            checked={editable?.DEPARTMENT}
                            updateKey="department"
                            label="Cho phép thay đổi Khoa"
                        />
                        <SystemCheckRow
                            checked={editable?.MAJOR}
                            updateKey="major"
                            label="Cho phép thay đổi Chuyên ngành"
                        />
                        <SystemCheckRow
                            checked={editable?.CLASS}
                            updateKey="class"
                            label="Cho phép thay đổi Lớp"
                        />
                        <SystemCheckRow
                            checked={editable?.INSTRUCTOR}
                            updateKey="instructor"
                            label="Cho phép thay đổi giáo viên cố vấn"
                        />
                        <SystemCheckRow
                            checked={editable?.STUDENT}
                            updateKey="student"
                            label="Cho phép thay đổi sinh viên"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SystemCheckRow({ checked, updateKey, label }) {
    const [disabled, setDisabled] = React.useState(false);
    const initialValues = { password: "" };
    const validationSchema = Yup.object({
        password: Validation.password,
    });

    const dispatch = useDispatch();
    function onChange(e) {
        setNewCheck(e.target.checked);
    }
    const [newCheck, setNewCheck] = React.useState(null);
    const toggle = () => {
        setNewCheck(null);
    };

    async function onSubmit(values, { setSubmitting }) {
        setSubmitting(true);

        setDisabled(true);

        try {
            const dataform = {
                [updateKey]: newCheck,
                password: sha256(values.password),
            };

            const res = await axios.patch(`/api/editable`, dataform, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.editable.reloadEditable());
        } catch (e) {
            toast(e.message, { type: "error" });
            toggle();
        }
        setDisabled(false);

        setSubmitting(false);
    }

    return (
        <tr>
            <div className="p-3">
                <div class="custom-control custom-switch">
                    <input
                        disabled={disabled}
                        checked={checked}
                        onChange={onChange}
                        type="checkbox"
                        class="custom-control-input"
                        id={`switch${updateKey}`}
                    />
                    <label
                        class="custom-control-label mr-2"
                        for={`switch${updateKey}`}
                    >
                        {label}
                    </label>
                    {checked ? (
                        <span class="badge badge-success" role="alert">
                            Đang mở
                        </span>
                    ) : (
                        <span class="badge badge-danger" role="alert">
                            Đang tắt
                        </span>
                    )}
                </div>
            </div>
            <Modal isOpen={newCheck !== null} toggle={toggle}>
                <ModalHeader toggle={toggle}>Yêu cầu xác nhận</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <div className="alert alert-danger">
                                    {`Bạn có muốn ${
                                        newCheck ? "MỞ" : "TẮT"
                                    } quyền chỉnh sửa nội dung này không ?`}
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
        </tr>
    );
}

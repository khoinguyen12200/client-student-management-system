import React from "react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { MdModeEdit } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import * as Validation from "../../const/Validation";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../redux/store";
import InputField, {
    FormikField,
    LoadingButton,
} from "../../components/InputField";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { sha256 } from "js-sha256";

export default function Departments() {
    const [departments, setDepartments] = React.useState([]);

    const [filtter, setFiltter] = React.useState("");

    const departmentsAfterFilter = React.useMemo(()=>{

        let str = filtter.toLowerCase().trim();
        if(str == "") return departments
        const arr = departments.filter((department) => {
            let {ID,NAME,SORT_NAME} = department;
            ID = ID + "";
            ID = ID.toLowerCase(); NAME = NAME.toLowerCase(); SORT_NAME = SORT_NAME.toLowerCase();
            if(ID.includes(str) || NAME.includes(str) || SORT_NAME.includes(str)) return true;
            return false
        })
       
        return arr;
    },[departments,filtter])

    async function getDepartments() {
        const res = await axios.get("/api/manager/department");
        setDepartments(res.data);
    }
    React.useEffect(() => {
        getDepartments();
    }, []);
    return (
        <div className="department p-3">
            <center>
                <h1>Khoa - Đoàn</h1>
            </center>
            <div className="department-content p-2">
                <div className="headSpace">
                    <div>
                        <div class="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <AiOutlineSearch />
                                    Tìm kiếm
                                </span>
                            </div>
                            <input
                                value={filtter}
                                onChange={(e) => setFiltter(e.target.value)}
                                type="text"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <AddModal onData={getDepartments} />
                </div>
                <div className="table-container mt-3">
                    <table class="table table-bordered table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Tên rút gọn</th>
                                <th scope="col">
                                    <center>Hành động</center>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentsAfterFilter.map((department) => (
                                <Department
                                    department={department}
                                    key={department.ID}
                                    onData={getDepartments}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AddModal({ onData }) {
    const initialValues = {
        id: "",
        name: "",
        sortName: "",
    };
    const validationSchema = Yup.object({
        name: Validation.departmentName,
        sortName: Validation.departmentSortName,
    });

    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        try {
            let data = values;
            if (values.id != "" || values.id != null) data.id = values.id;
            console.log(data);
            const res = await axios.post(
                "/api/manager/department/insert",
                data,
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            onData();
            resetForm(initialValues);
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    return (
        <>
            <button onClick={toggle} className="btn btn-outline-primary">
                Thêm
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Thêm khoa</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <FormikField
                                    type="number"
                                    label="ID"
                                    placeholder="Có thể bỏ trống"
                                    name="id"
                                />
                                <FormikField label="Tên khoa" name="name" />
                                <FormikField
                                    label="Tên viết tắt"
                                    name="sortName"
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

function Department({ department, onData }) {
    const { ID, NAME, SORT_NAME } = department;
    return (
        <tr>
            <th>{ID}</th>
            <td>{NAME}</td>
            <td>{SORT_NAME}</td>
            <td>
                <center>
                    <EditDepartmentModal
                        onData={onData}
                        department={department}
                    />
                    <DeleteDepartmentModal
                        onData={onData}
                        department={department}
                    />
                </center>
            </td>
        </tr>
    );
}

function EditDepartmentModal({ onData, department }) {
    const initialValues = React.useMemo(() => {
        return {
            name: department.NAME,
            sortName: department.SORT_NAME,
            id: department.ID,
        };
    }, [department]);
    const validationSchema = Yup.object({
        name: Validation.departmentName,
        sortName: Validation.departmentSortName,
        id: Validation.id,
    });
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        let sendData = { id: department.ID };
        if (values.id !== department.ID) sendData.newId = values.id;
        if (values.name !== department.NAME) sendData.name = values.name;
        if (values.sortName !== department.SORT_NAME)
            sendData.sortName = values.sortName;
        try {
            const res = await axios.post(
                "/api/manager/department/update",
                sendData,
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            onData();
            resetForm(initialValues);
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    return (
        <>
            <button onClick={toggle} className="btn btn-warning mr-1">
                <MdModeEdit /> Chỉnh sửa
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Chỉnh sửa</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <FormikField label="ID" name="id" />
                                <FormikField label="Tên khoa" name="name" />
                                <FormikField
                                    label="Tên viết tắt"
                                    name="sortName"
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

function DeleteDepartmentModal({ onData, department }) {
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
            id: department.ID,
            password: sha256(values.password),
        };

        try {
            const res = await axios.post(
                "/api/manager/department/delete",
                sendData,
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            onData();
            resetForm(initialValues);
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    return (
        <>
            <button onClick={toggle} className="btn btn-danger">
                <BsFillTrashFill /> Xóa
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

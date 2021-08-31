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
    FormikSelectField,
    LoadingButton,
} from "../../components/InputField";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { sha256 } from "js-sha256";

export default function MajorsPage() {
    const [search, setSearch] = React.useState("");
    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);

    const [departFilter, setDepartFilter] = React.useState(-1);
    function onSelectChange(e) {
        setDepartFilter(e.target.value);
    }

    const majorsAfterFilter = React.useMemo(() => {
        try {

            const arr = majors.filter((major) => {
                let { ID, DEPARTMENT, NAME, SORT_NAME } = major;
                ID = (ID + "").trim().toLowerCase();

                NAME = (NAME + "").trim().toLowerCase();
                SORT_NAME = (SORT_NAME + "").trim().toLowerCase();

                if (
                    ID.includes(search) ||
                    NAME.includes(search) ||
                    SORT_NAME.includes(search)
                ) {
                    return true;
                }
                return false;
            });
            const arr2 = arr.filter((major)=>(departFilter==-1 || major.DEPARTMENT == departFilter))
            return arr2;
        } catch (err) {
            return [];
        }
    }, [majors, search, departFilter]);

    return (
        <div className="major-page p-3">
            <center className="mb-3">
                <h1>Chuyên ngành</h1>
            </center>
            <div className="headSpace">
                <div className="head1">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <AiOutlineSearch />
                                Tìm kiếm
                            </span>
                        </div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <label
                                className="input-group-text"
                                for="inputGroupSelect01"
                            >
                                Lọc theo khoa
                            </label>
                        </div>
                        <select
                            onChange={onSelectChange}
                            className="custom-select"
                            id="inputGroupSelect01"
                        >
                            <option selected value={-1}>
                                Chọn giá trị
                            </option>
                            {departments.map(({ ID, NAME }) => (
                                <option key={ID} value={ID}>
                                    {NAME}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <AddModal departments={departments} />
                </div>
            </div>
            <div className="list">
                <MajorList majors={majorsAfterFilter} />
            </div>
        </div>
    );
}

function AddModal({ departments }) {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };

    const dataSelect = React.useMemo(() => {
        try {
            const arr = departments.map((department) => ({
                key: department.NAME,
                value: department.ID,
            }));
            return arr;
        } catch (e) {
            return [];
        }
    }, [departments]);
    const initialValues = {
        id: "",
        name: "",
        sortName: "",
        department: "",
    };
    const validationSchema = Yup.object({
        name: Validation.departmentName,
        sortName: Validation.departmentSortName,
        department: Validation.id,
    });
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        try {
            let data = values;
            if (values.id != "" || values.id != null) data.id = values.id;
            console.log(data);
            const res = await axios.post("/api/manager/major/insert", data, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.majors.reloadMajors());
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
                <ModalHeader toggle={toggle}>Thêm chuyên ngành</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <FormikSelectField
                                    defaultValue={null}
                                    data={dataSelect}
                                    label="Khoa"
                                    name="department"
                                />
                                <FormikField
                                    type="number"
                                    label="ID"
                                    placeholder="Có thể bỏ trống"
                                    name="id"
                                />
                                <FormikField label="Tên ngành" name="name" />
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

function MajorList({ majors }) {
    return (
        <div className="major-list mt-3">
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">ID</th>

                        <th scope="col">Tên chuyên ngành</th>
                        <th scope="col">Tên rút gọn</th>
                        <th scope="col">Thuộc khoa</th>
                        <th scope="col">
                            <center>Hành động</center>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {majors &&
                        majors.map((major) => (
                            <Major major={major} key={major.ID} />
                        ))}
                </tbody>
            </table>
        </div>
    );
}

function Major({ major }) {
    const { ID, NAME, SORT_NAME, DEPARTMENT } = major;
    const departments = useSelector((state) => state.departments.list);
    const departmentName = React.useMemo(() => {
        const d = departments.find((de) => de.ID === DEPARTMENT);
        return d && d.NAME;
    }, [departments, DEPARTMENT]);
    return (
        <tr>
            <th scope="row">{ID}</th>

            <td>{NAME}</td>
            <td>{SORT_NAME}</td>
            <td>{departmentName || ""}</td>
            <td>
                <center>
                    <EditMajor major={major} />
                    <DeleteMajorModal major={major} />
                </center>
            </td>
        </tr>
    );
}

function EditMajor({ major }) {
    const dispatch = useDispatch();
    const departments = useSelector((state) => state.departments.list);
    const dataSelect = React.useMemo(() => {
        try {
            const arr = departments.map((department) => ({
                key: department.NAME,
                value: department.ID,
            }));
            return arr;
        } catch (e) {
            return [];
        }
    }, [departments]);
    const initialValues = React.useMemo(() => {
        return {
            department: major.DEPARTMENT,
            name: major.NAME,
            sortName: major.SORT_NAME,
            id: major.ID,
        };
    }, [major]);
    const validationSchema = Yup.object({
        name: Validation.majorName,
        sortName: Validation.majorSortName,
        id: Validation.id,
    });
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        let sendData = { id: major.ID };
        if (values.id !== major.ID) sendData.newId = values.id;
        if (values.name !== major.NAME) sendData.name = values.name;
        if (values.sortName !== major.SORT_NAME)
            sendData.sortName = values.sortName;
        if (values.department !== major.DEPARTMENT)
            sendData.department = values.department;
        try {
            const res = await axios.post(
                "/api/manager/major/update",
                sendData,
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.majors.reloadMajors());
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
                <ModalHeader toggle={toggle}>
                    Chỉnh sửa chuyên ngành
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <FormikSelectField
                                    defaultValue={major.DEPARTMENT}
                                    data={dataSelect}
                                    label="Khoa"
                                    name="department"
                                />
                                <FormikField label="ID" name="id" />
                                <FormikField
                                    label="Tên chuyên ngành"
                                    name="name"
                                />
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

function DeleteMajorModal({ major }) {
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
            id: major.ID,
            password: sha256(values.password),
        };

        try {
            const res = await axios.post(
                "/api/manager/major/delete",
                sendData,
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.majors.reloadMajors());
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

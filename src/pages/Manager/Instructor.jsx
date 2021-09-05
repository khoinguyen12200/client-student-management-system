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
    FormikSelectField,
} from "../../components/InputField";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { sha256 } from "js-sha256";
import { date } from "yup/lib/locale";
import * as Const from "../../const";

export default function InstructorPage() {
    // -------------- STATE
    const [search, setSearch] = React.useState("");

    const instructors = useSelector((state) => state.instructor.list);

    const arrAfterFiltter = React.useMemo(() => {
        let arr = instructors.concat([]);
        arr = arr.filter(ins => {
            const {FULL_NAME,INSTRUCTOR_ID} = ins;
            const v1 = (FULL_NAME+"").toLowerCase().trim();
            const v2 = (INSTRUCTOR_ID+"").trim().toLowerCase();
            return v1.includes(search) || v2.includes(search);
        })
        return arr;
    },[instructors,search])

    return (
        <div className="instructor-page p-3">
            <center className="mb-3">
                <h1 className="page-title">Giáo viên cố vấn</h1>
            </center>
            <div className="headSpace">
                <div>
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
                </div>
                <AddModal />
            </div>
            <InstructorList list={arrAfterFiltter} />
        </div>
    );
}

function AddModal({}) {
    const dispatch = useDispatch();
    const initialValues = {
        instructorId: "",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        citizenId: "",
    };
    const validationSchema = Yup.object({
        fullName: Validation.name,
        instructorId: Validation.instructorId,
        dateOfBirth: Validation.dateOfBirth,
        gender: Validation.gender,
        citizenId: Validation.citizenId,
    });

    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        try {
            const res = await axios.post("/api/instructor", values, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.instructor.reloadInstructor());
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
                <ModalHeader toggle={toggle}>Thêm giáo viên</ModalHeader>
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
                                    label="Mã cán bộ"
                                    name="instructorId"
                                />
                                <FormikField
                                    type="text"
                                    label="Họ và tên"
                                    name="fullName"
                                />
                                <FormikField
                                    label="Ngày sinh"
                                    name="dateOfBirth"
                                    type="date"
                                />
                                <FormikSelectField
                                    label="Giới tính"
                                    name="gender"
                                    data={Validation.dataSelectGender}
                                    defaultValue={null}
                                />
                                <FormikField
                                    label="Căn cước công dân"
                                    name="citizenId"
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

function InstructorList({ list }) {
    return (
        <div className="major-list mt-3">
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Mã giáo viên</th>
                        <th scope="col">Họ và tên</th>
                        <th scope="col">Ngày sinh</th>
                        <th scope="col">Giới tính</th>
                        <th scope="col">Chứng minh thư</th>
                        <th scope="col">
                            <center>Hành động</center>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {list &&
                        list.map((instructor) => (
                            <Instructor
                                instructor={instructor}
                                key={instructor.ID}
                            />
                        ))}
                </tbody>
            </table>
        </div>
    );
}

function Instructor({ instructor }) {
    const { INSTRUCTOR_ID, FULL_NAME, DATE_OF_BIRTH, GENDER, CITIZEN_ID } =
        instructor;
    const dateOfBirth = React.useMemo(() => {
        const str = Const.toVNDate(DATE_OF_BIRTH);
        return str;
    }, [DATE_OF_BIRTH]);
    return (
        <tr>
            <th>{INSTRUCTOR_ID}</th>
            <td>{FULL_NAME}</td>
            <td>{dateOfBirth}</td>
            <td>{GENDER == "M" ? "Nam" : "Nữ"}</td>
            <td>{CITIZEN_ID}</td>
            <td>
                <center>
                    <EditInstructor instructor={instructor}/>
                    <DeleteInstructor instructor={instructor}/>
                </center>
            </td>
        </tr>
    );
}

function EditInstructor({ instructor }) {
    const dispatch = useDispatch();
    const { INSTRUCTOR_ID, FULL_NAME, DATE_OF_BIRTH, GENDER, CITIZEN_ID } =
    instructor;
    const initialValues = {
        instructorId: INSTRUCTOR_ID,
        fullName: FULL_NAME,
        dateOfBirth: Const.toStandardDate(DATE_OF_BIRTH),
        gender: GENDER,
        citizenId: CITIZEN_ID,
    };
    const validationSchema = Yup.object({
        fullName: Validation.name,
        instructorId: Validation.instructorId,
        dateOfBirth: Validation.dateOfBirth,
        gender: Validation.gender,
        citizenId: Validation.citizenId,
    });
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        let sendData = values;
        sendData.id = instructor.ID;
        
        try {
            const res = await axios.put(
                "/api/instructor",
                sendData,
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.instructor.reloadInstructor());
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
                    Chỉnh sửa thông tin giáo viên
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
                                    label="Mã cán bộ"
                                    name="instructorId"
                                />
                                <FormikField
                                    type="text"
                                    label="Họ và tên"
                                    name="fullName"
                                />
                                <FormikField
                                    label="Ngày sinh"
                                    name="dateOfBirth"
                                    type="date"
                                />
                                <FormikSelectField
                                    label="Giới tính"
                                    name="gender"
                                    data={Validation.dataSelectGender}
                                    defaultValue={GENDER}
                                />
                                <FormikField
                                    label="Căn cước công dân"
                                    name="citizenId"
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

function DeleteInstructor({ instructor }) {
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
            id: instructor.ID,
            password: sha256(values.password),
        };

        try {
            const res = await axios.delete(
                "/api/instructor",
                { data: sendData },
                { withCredentials: true }
            );
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.instructor.reloadInstructor());
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

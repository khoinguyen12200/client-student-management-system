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

export default function StudentPage() {
    const [search, setSearch] = React.useState("");

    return (
        <div className="student-page p-3">
            <center className="mb-3">
                <h1 className="page-title">Sinh viên</h1>
            </center>
            <div className="headSpace">
                <div>
                    <Filtter />
                </div>
                <div>
                    <AddStudent />
                </div>
            </div>
            <StudentList />
        </div>
    );
}
export function AddStudent() {
    const dispatch = useDispatch();

    const initialValues = {
        studentId: "",
        fullName: "",
        address: "",
        classMajor: "",
        dateOfBirth: "",
        gender: "",
        citizenId: "",
    };
    const validationSchema = Yup.object({
        studentId: Validation.studentId,
        fullName: Validation.name,
        address: Validation.address,
        classMajor: Validation.id,
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
            const res = await axios.post("/api/student", values, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.student.reloadStudent());
            resetForm(initialValues);
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);
    const classMajors = useSelector((state) => state.class.list);

    const dataDepartment = React.useMemo(() => {
        return departments.map((de) => ({ key: de.NAME, value: de.ID }));
    }, [departments]);
    const [sDepart, setSDepart] = React.useState(null);
    React.useEffect(() => {
        console.log(sDepart);
    }, [sDepart]);

    const dataMajor = React.useMemo(() => {
        let arr = majors.concat([]);
        arr = arr.filter((ma) => ma.DEPARTMENT == sDepart);
        arr = arr.map((ma) => ({ key: ma.NAME, value: ma.ID }));
        return arr;
    }, [majors, sDepart]);
    const [sMajor, setSMajor] = React.useState(null);

    const dataClass = React.useMemo(() => {
        let arr = classMajors.concat([]);
        arr = arr.filter((cl) => cl.MAJOR == sMajor);
        arr = arr.map((cl) => ({ key: cl.NAME, value: cl.ID }));
        return arr;
    }, [dataMajor, sMajor, classMajors]);

    return (
        <>
            <button onClick={toggle} className="btn btn-outline-primary mr-1">
                <AiFillFileAdd /> Thêm sinh viên
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Thêm sinh viên</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <SelectField
                                    data={dataDepartment}
                                    defaultValue={null}
                                    label="Khoa"
                                    onChange={(e) => setSDepart(e.target.value)}
                                />
                                <SelectField
                                    data={dataMajor}
                                    defaultValue={null}
                                    label="Chuyên ngành"
                                    onChange={(e) => setSMajor(e.target.value)}
                                />
                                <FormikSelectField
                                    defaultValue={null}
                                    data={dataClass}
                                    label="Lớp"
                                    name="classMajor"
                                />
                                <FormikField
                                    type="text"
                                    label="Mã số sinh viên"
                                    name="studentId"
                                />
                                <FormikField
                                    type="text"
                                    label="Họ và tên"
                                    name="fullName"
                                />
                                <FormikField
                                    type="text"
                                    label="Địa chỉ"
                                    name="address"
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

function StudentList() {
    const query = new URLSearchParams(useLocation().search);

    const s_search = query.get("search");
    const s_department = query.get("department");
    const s_major = query.get("major");
    const s_class = query.get("class");

    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);
    const classMajors = useSelector((state) => state.class.list);
    const students = useSelector((state) => state.student.list);

    const studentAfterFilter = React.useMemo(() => {
        let arr = students.concat([]);
        console.log(s_search);
        arr = arr.filter((student) => {
            const { FULL_NAME, STUDENT_ID } = student;
            const fullname = (FULL_NAME + "").toLowerCase().trim();
            const studentId = (STUDENT_ID + "").toLowerCase().trim();
            const search = (s_search + "").toLowerCase().trim();

            return fullname.includes(search) || studentId.includes(search);
        });

        return arr;
    }, [students, s_search, s_department, s_major, s_class]);

    return (
        <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">MSSV</th>
                    <th scope="col">Họ và tên</th>
                    <th scope="col">Lớp</th>
                    <th scope="col">Chuyên ngành</th>
                    <th scope="col">Khoa</th>
                    <th scope="col">Địa chỉ</th>
                    <th scope="col">Ngày sinh</th>
                    <th scope="col">Giới tính</th>
                    <th scope="col">CMND</th>
                    <th scope="col">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {studentAfterFilter.map((student) => (
                    <Student student={student} />
                ))}
            </tbody>
        </table>
    );
}

function Student({ student }) {
    const {
        STUDENT_ID,
        FULL_NAME,
        ADDRESS,
        DATE_OF_BIRTH,
        GENDER,
        CITIZEN_ID,
        CLASS,
    } = student;
    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);
    const classMajors = useSelector((state) => state.class.list);

    const classMajor = React.useMemo(() => {
        return classMajors.find((cl) => cl.ID == CLASS);
    }, [CLASS, classMajors]);
    const major = React.useMemo(() => {
        return majors.find((ma) => ma.ID == classMajor?.MAJOR);
    }, [classMajor, majors]);
    const department = React.useMemo(() => {
        return departments.find((d) => d.ID == major?.DEPARTMENT);
    }, [major, departments]);
    return (
        <tr>
            <th>{STUDENT_ID}</th>
            <td>{FULL_NAME}</td>
            <td>{classMajor?.NAME}</td>
            <td>{major?.NAME}</td>
            <td>{department?.NAME}</td>
            <td>{ADDRESS}</td>
            <td>{Const.toVNDate(DATE_OF_BIRTH)}</td>
            <td>{GENDER == "M" ? "Nam" : "Nữ"}</td>
            <td>{CITIZEN_ID}</td>
            <td>
                <div className="d-flex flex-column">
                <EditStudent student={student} />
                <DeleteStudent student={student} />
                </div>
            </td>
        </tr>
    );
}

function Filtter() {
    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);
    const classMajors = useSelector((state) => state.class.list);

    const location = useLocation();
    const query = new URLSearchParams(useLocation().search);
    const s_department = query.get("department") || "";
    const s_major = query.get("major") || "";
    const s_class = query.get("class") || "";
    const s_search = query.get("search") || "";

    const [search, setSearch] = React.useState(s_search);
    const [selectedDepart, setDepart] = React.useState(s_department);
    const [selectedMajor, setMajor] = React.useState(s_major);
    const [selectedClass, setClass] = React.useState(s_class);
    const [redirect, setRedirect] = React.useState(null);

    React.useEffect(() => {
        if (redirect) setRedirect(null);
    }, [redirect]);

    React.useEffect(() => {
        let params = new URLSearchParams();
        params.set("search", search);
        params.set("department", selectedDepart);
        params.set("major", selectedMajor);
        params.set("class", selectedClass);
        setRedirect(`${location.pathname}?${params.toString()}`);
    }, [search, selectedDepart, selectedMajor, selectedClass]);

    const selectorDepart = React.useMemo(() => {
        if (!departments) return [];
        let arr = departments.map((department) => ({
            key: department.NAME,
            value: department.SORT_NAME,
        }));
        arr.unshift({ key: "Hãy chọn giá trị", value: "" });
        return arr;
    }, [departments]);
    const selectorMajors = React.useMemo(() => {
        if (!majors) return [];
        const arr1 = majors.filter((major) => {
            return (
                major.DEPARTMENT ==
                departments.find((d) => d.SORT_NAME == selectedDepart)?.ID
            );
        });

        let arr2 = arr1.map((major) => ({
            key: major.NAME,
            value: major.SORT_NAME,
        }));
        arr2.unshift({ key: "Hãy chọn giá trị", value: "" });
        return arr2;
    }, [selectedDepart, majors]);

    const selectorClass = React.useMemo(() => {
        if (!classMajors) return [];

        let arr = classMajors.filter(
            (cl) =>
                cl.MAJOR == majors.find((m) => m.SORT_NAME == selectedMajor)?.ID
        );
        arr = arr.map((cl) => ({ key: cl.NAME, value: cl.NAME }));
        arr.unshift({ key: "Hãy chọn giá trị", value: "" });
        return arr;
    }, [selectedMajor, classMajors]);

    function onChangeDepart(value) {
        setDepart(value);
        value == "" && onChangeMajor("");
    }
    function onChangeMajor(value) {
        setMajor(value);
        value == "" && onChangeClass("");
    }
    function onChangeClass(value) {
        setClass(value);
    }

    return (
        <div>
            {redirect && <Redirect to={redirect} />}
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
            <SelectField
                labelGroup="Lọc theo khoa"
                data={selectorDepart}
                defaultValue={s_department}
                onChange={(e) => onChangeDepart(e.target.value)}
            />
            <SelectField
                labelGroup="Lọc theo ngành"
                data={selectorMajors}
                defaultValue={s_major}
                onChange={(e) => onChangeMajor(e.target.value)}
            />
            <SelectField
                labelGroup="Lọc theo lớp"
                data={selectorClass}
                defaultValue={s_class}
                onChange={(e) => onChangeClass(e.target.value)}
            />
        </div>
    );
}

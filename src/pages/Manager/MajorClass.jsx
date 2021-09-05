import React from "react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Redirect, useLocation,Link } from "react-router-dom";
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
    SelectField,
    LoadingButton,
} from "../../components/InputField";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { sha256 } from "js-sha256";

export default function MajorClass() {
    const departments = useSelector((state) => state.departments.list);
    const classMajors = useSelector((state) => state.class.list);
    const majors = useSelector((state) => state.majors.list)

    const query = new URLSearchParams(useLocation().search);
    const s_department = query.get("department") || "";
    const s_major = query.get("major") || "";
    const s_search = query.get("search") || "";


    const classMajorsAfterFiltter = React.useMemo(() => {
        let arr = classMajors.concat([]);
        const id_department = departments.find(d => d.SORT_NAME == s_department)?.ID;
        console.log("id-department",id_department)

        if(s_department){
           
            arr = arr.filter(cl =>  majors.findIndex(m => cl.MAJOR == m.ID && m.DEPARTMENT == id_department ) != -1)
        }
        if(s_major){
            arr = arr.filter( cl => cl.MAJOR == majors.find(m => m.SORT_NAME == s_major)?.ID)
        }
        if(s_search){
            arr = arr.filter(cl =>{
                const {NAME,ID} = cl;
                let name = (NAME+"").trim().toLowerCase()
                let id = (ID+"").trim().toLowerCase()
                let str = (s_search+"").trim().toLowerCase()
                return name.includes(str) || id.includes(str)
            })
        }
        return arr;
    }, [classMajors,s_department,s_major,s_search]);

    return (
        <div className="major-class-page p-3">
            <center className="mb-3">
                <h1 className="page-title">Lớp chuyên ngành</h1>
            </center>
            <div className="headSpace">
                <div className="head1">
                    <Filtter />
                </div>
                <div>
                    <AddModal departments={departments} />
                </div>
            </div>
            <div>
                <ClassList classMajors={classMajorsAfterFiltter} />
            </div>
        </div>
    );
}

function Filtter() {
    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);

    const query = new URLSearchParams(useLocation().search);
    const s_department = query.get("department") || "";
    const s_major = query.get("major") || "";
    const s_search = query.get("search") || "";

    const [search, setSearch] = React.useState(s_search);
    const [selectedDepart, setDepart] = React.useState(s_department);
    const [selectedMajor, setMajor] = React.useState(s_major);
    const [redirect, setRedirect] = React.useState(null)

    React.useEffect(()=>{
        if(redirect) setRedirect(null)
    },[redirect])

    React.useEffect(()=>{
        let params = new URLSearchParams();
        params.set("search",search)
        params.set("department",selectedDepart)
        params.set("major",selectedMajor)
        setRedirect("/manager/class-major?"+params.toString());
    },[search,selectedDepart,selectedMajor])

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
            return major.DEPARTMENT == departments.find(d => d.SORT_NAME == selectedDepart)?.ID;
        });

        let arr2 = arr1.map((major) => ({ key: major.NAME, value: major.SORT_NAME }));
        arr2.unshift({ key: "Hãy chọn giá trị", value: "" });
        return arr2;
    }, [selectedDepart, majors]);

    function onChangeDepart(e) {
        setDepart(e.target.value);
        if(e.target.value == "") setMajor("")
    }
    function onChangeMajor(e) {
        setMajor(e.target.value);
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
                onChange={onChangeDepart}
            />
            <SelectField
                labelGroup="Lọc theo ngành"
                data={selectorMajors}
                defaultValue={s_major}
                onChange={onChangeMajor}
            />
        </div>
    );
}

function ClassList({ classMajors }) {
    return (
        <div className="major-list mt-3">
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tên lớp</th>
                        <th scope="col">Năm vào học</th>
                        <th scope="col">Cố vấn học tập</th>
                        <th scope="col">Tên chuyên ngành</th>
                        <th scope="col">Thuộc khoa</th>
                        <th scope="col">
                            <center>Hành động</center>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {classMajors &&
                        classMajors.map((classMajor) => (
                            <ClassMajor
                                classMajor={classMajor}
                                key={classMajor.ID}
                            />
                        ))}
                </tbody>
            </table>
        </div>
    );
}

function ClassMajor({ classMajor }) {
    const instructors = useSelector((state) => state.instructor.list);
    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);
    const { ID, NAME, COURSE, MAJOR, INSTRUCTOR } = classMajor;
    const majorObject = React.useMemo(() => {
        return majors.find((m) => m.ID == MAJOR);
    }, [majors, MAJOR]);
    const departmentObject = React.useMemo(() => {
        if (!majorObject) return null;
        return departments.find((d) => d.ID == majorObject.DEPARTMENT);
    }, [majorObject, departments]);

    const instructorName = React.useMemo(() => {
        let str = "";
        instructors.forEach((instructor) => {
            if (instructor.ID == INSTRUCTOR) str = instructor.FULL_NAME;
        });
        return str;
    }, [INSTRUCTOR, instructors]);

    return (
        <tr>
            <th>{ID}</th>
            <td><Link to={`/manager/class-major/${NAME}`}>{NAME}</Link></td>
            <td>{COURSE}</td>
            <td>{instructorName}</td>
            <td>{majorObject && majorObject.NAME}</td>
            <td>{departmentObject && departmentObject.NAME}</td>
            <td>
                <EditClass
                    classMajor={classMajor}
                    defaultDepartment={departmentObject && departmentObject.ID}
                />
                <DeleteClassMajorModal classMajor={classMajor} />
            </td>
        </tr>
    );
}

function EditClass({ classMajor, defaultDepartment }) {
    const dispatch = useDispatch();
    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);
    const instructors = useSelector((state) => state.instructor.list);
    const selectInstructor = React.useMemo(() => {
        if (!instructors) return [];
        return instructors.map((instructor) => ({
            key: instructor.FULL_NAME,
            value: instructor.ID,
        }));
    }, [instructors]);

    const { ID, NAME, COURSE, MAJOR, INSTRUCTOR } = classMajor;

    const initialValues = {
        name: NAME,
        course: COURSE,
        major: MAJOR,
        instructor: INSTRUCTOR,
    };
    const validationSchema = Yup.object({
        name: Validation.majorClassName,
        course: Validation.course,
        major: Validation.id,
        instructor: Validation.id,
    });

    const [selectedDepart, setSeletedDepart] =
        React.useState(defaultDepartment);
    const departmentSelector = React.useMemo(() => {
        const arr = departments.map((department) => ({
            value: department.ID,
            key: department.NAME,
        }));
        return arr;
    }, [departments]);

    function departSelectChange(e) {
        setSeletedDepart(e.target.value);
    }

    const majorSelector = React.useMemo(() => {
        const arr1 = majors.filter((major) => {
            return major.DEPARTMENT == selectedDepart;
        });

        const arr2 = arr1.map((major) => ({
            value: major.ID,
            key: major.NAME,
        }));
        return arr2;
    }, [selectedDepart, majors]);

    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        values.id = classMajor.ID;

        try {
            const res = await axios.post("/api/class-major/update", values, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.class.reloadClass());
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
                                <SelectField
                                    onChange={departSelectChange}
                                    defaultValue={defaultDepartment}
                                    label="Thuộc khoa"
                                    data={departmentSelector}
                                />
                                <FormikSelectField
                                    defaultValue={MAJOR}
                                    data={majorSelector}
                                    label="Thuộc chuyên ngành"
                                    name="major"
                                />
                                <FormikSelectField
                                    defaultValue={INSTRUCTOR}
                                    data={selectInstructor}
                                    label="Giáo viên cố vấn"
                                    name="instructor"
                                />

                                <FormikField label="Tên lớp" name="name" />
                                <FormikField
                                    type="number"
                                    label="Năm vào học"
                                    name="course"
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

function DeleteClassMajorModal({ classMajor }) {
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
            id: classMajor.ID,
            password: sha256(values.password),
        };

        try {
            const res = await axios.post("/api/class-major/delete", sendData, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.class.reloadClass());
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

function AddModal() {
    const dispatch = useDispatch();
    const instructors = useSelector((state) => state.instructor.list);
    const selectInstructor = React.useMemo(() => {
        if (!instructors) return [];
        return instructors.map((instructor) => ({
            key: instructor.FULL_NAME,
            value: instructor.ID,
        }));
    }, [instructors]);

    const departments = useSelector((state) => state.departments.list);
    const majors = useSelector((state) => state.majors.list);
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };

    const initialValues = {
        name: "",
        course: "",
        major: "",
        instructor: "",
    };
    const validationSchema = Yup.object({
        name: Validation.majorClassName,
        course: Validation.course,
        major: Validation.id,
        instructor: Validation.id,
    });

    const [selectedDepart, setSeletedDepart] = React.useState(null);
    const departmentSelector = React.useMemo(() => {
        const arr = departments.map((department) => ({
            value: department.ID,
            key: department.NAME,
        }));
        return arr;
    }, [departments]);

    function departSelectChange(e) {
        setSeletedDepart(e.target.value);
    }

    const majorSelector = React.useMemo(() => {
        const arr1 = majors.filter((major) => {
            return major.DEPARTMENT == selectedDepart;
        });
        const arr2 = arr1.map((major) => ({
            value: major.ID,
            key: major.NAME,
        }));
        return arr2;
    }, [selectedDepart, majors]);

    async function onSubmit(values, { setSubmitting, resetForm }) {
        setSubmitting(true);
        try {
            let data = values;

            const res = await axios.post("/api/class-major/insert", data, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            toggle();
            dispatch(actions.class.reloadClass());
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
                <ModalHeader toggle={toggle}>Thêm lớp chuyên ngành</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <SelectField
                                    onChange={departSelectChange}
                                    defaultValue={null}
                                    label="Thuộc khoa"
                                    data={departmentSelector}
                                />
                                <FormikSelectField
                                    defaultValue={null}
                                    data={majorSelector}
                                    label="Thuộc chuyên ngành"
                                    name="major"
                                />

                                <FormikSelectField
                                    defaultValue={null}
                                    data={selectInstructor}
                                    label="Giáo viên cố vấn"
                                    name="instructor"
                                />
                                <FormikField label="Tên lớp" name="name" />
                                <FormikField
                                    type="number"
                                    label="Năm vào học"
                                    name="course"
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

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
                <h1 className="page-title">L???p chuy??n ng??nh</h1>
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
        arr.unshift({ key: "H??y ch???n gi?? tr???", value: "" });
        return arr;
    }, [departments]);
    const selectorMajors = React.useMemo(() => {
        if (!majors) return [];
        const arr1 = majors.filter((major) => {
            return major.DEPARTMENT == departments.find(d => d.SORT_NAME == selectedDepart)?.ID;
        });

        let arr2 = arr1.map((major) => ({ key: major.NAME, value: major.SORT_NAME }));
        arr2.unshift({ key: "H??y ch???n gi?? tr???", value: "" });
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
                        T??m ki???m
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
                labelGroup="L???c theo khoa"
                data={selectorDepart}
                defaultValue={s_department}
                onChange={onChangeDepart}
            />
            <SelectField
                labelGroup="L???c theo ng??nh"
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
                        <th scope="col">T??n l???p</th>
                        <th scope="col">N??m v??o h???c</th>
                        <th scope="col">C??? v???n h???c t???p</th>
                        <th scope="col">T??n chuy??n ng??nh</th>
                        <th scope="col">Thu???c khoa</th>
                        <th scope="col">
                            <center>H??nh ?????ng</center>
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
                <MdModeEdit /> Ch???nh s???a
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Ch???nh s???a chuy??n ng??nh
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
                                    label="Thu???c khoa"
                                    data={departmentSelector}
                                />
                                <FormikSelectField
                                    defaultValue={MAJOR}
                                    data={majorSelector}
                                    label="Thu???c chuy??n ng??nh"
                                    name="major"
                                />
                                <FormikSelectField
                                    defaultValue={INSTRUCTOR}
                                    data={selectInstructor}
                                    label="Gi??o vi??n c??? v???n"
                                    name="instructor"
                                />

                                <FormikField label="T??n l???p" name="name" />
                                <FormikField
                                    type="number"
                                    label="N??m v??o h???c"
                                    name="course"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <LoadingButton
                                    type="submit"
                                    loading={formik.isSubmitting}
                                    className="btn btn-primary mr-2"
                                >
                                    X??c nh???n
                                </LoadingButton>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={toggle}
                                >
                                    H???y b???
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
                <BsFillTrashFill /> X??a
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Y??u c???u x??c nh???n x??a</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form>
                            <ModalBody>
                                <div className="alert alert-danger">
                                    H??nh ?????ng n??y c?? th??? ???nh h?????ng nghi??m tr???ng
                                    ?????n d??? li???u kh??c, h??y x??c nh???n m???t kh???u n???u
                                    b???n th???t s??? mu???n x??a !
                                </div>
                                <FormikField
                                    label="M???t kh???u"
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
                                    X??c nh???n x??a
                                </LoadingButton>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={toggle}
                                >
                                    H???y b???
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
                Th??m
            </button>

            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Th??m l???p chuy??n ng??nh</ModalHeader>
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
                                    label="Thu???c khoa"
                                    data={departmentSelector}
                                />
                                <FormikSelectField
                                    defaultValue={null}
                                    data={majorSelector}
                                    label="Thu???c chuy??n ng??nh"
                                    name="major"
                                />

                                <FormikSelectField
                                    defaultValue={null}
                                    data={selectInstructor}
                                    label="Gi??o vi??n c??? v???n"
                                    name="instructor"
                                />
                                <FormikField label="T??n l???p" name="name" />
                                <FormikField
                                    type="number"
                                    label="N??m v??o h???c"
                                    name="course"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <LoadingButton
                                    type="submit"
                                    loading={formik.isSubmitting}
                                    className="btn btn-primary mr-2"
                                >
                                    X??c nh???n
                                </LoadingButton>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={toggle}
                                >
                                    H???y b???
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
}

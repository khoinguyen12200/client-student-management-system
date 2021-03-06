import React from "react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Redirect, useParams,useLocation } from "react-router-dom";
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
import * as Const from "../../const";

export default function DetailClass({}) {
    const { name } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const s_search = query.get("search")

    const departments = useSelector((state) => state.departments.list);
    const instructors = useSelector((state) => state.instructor.list);

    const majors = useSelector((state) => state.majors.list);
    const classMajors = useSelector((state) => state.class.list);
    const students = useSelector((state) => state.student.list);

    const detailClass = React.useMemo(() => {
        let detail = classMajors.find((cl) => cl.NAME == name);
        if (detail) {
            detail.major = majors.find((ma) => ma.ID == detail.MAJOR);
            detail.instructor = instructors.find(
                (instructor) => instructor.ID == detail.INSTRUCTOR
            );
            if (detail.major) {
                detail.department = departments.find(
                    (de) => de.ID == detail.major.DEPARTMENT
                );
            }
            detail.students = students.filter((st) => st.CLASS == detail.ID);
        }

        return detail;
    }, [name, classMajors, students, majors, departments]);

    if (!detailClass) return null;

    return (
        <div className="major-class-page p-3">
            <center className="mb-3">
                <h1 className="page-title">Th??ng tin l???p chuy??n ng??nh</h1>
            </center>
            <div>
                <Info detail={detailClass} />
            </div>
            <div className="headSpace">
                <div>
                    
                </div>
                <div>
                    <AddModal detailClass={detailClass} />
                </div>
            </div>
            <div>
                <StudentList />
            </div>
        </div>
    );
}

function Filter() {
    
    const location = useLocation();
    const query = new URLSearchParams(useLocation().search);
    const s_search = query.get("search")
    
    const [search, setSearch] = React.useState(s_search || "");

    React.useEffect(() => {
        let params = new URLSearchParams();
        params.set("search",search)
        setRedirect(`${location.pathname}?${params.toString()}`);
    },[search])

    const [redirect, setRedirect] = React.useState(null);
    React.useEffect(() => {
        if (redirect != null) setRedirect(null);
    }, [redirect]);


    return (
        <div className="head1">
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
        </div>
    );
}

function Info({ detail }) {
    return (
        <table class="table table-striped table-bordered">
            <tbody>
                <tr>
                    <th scope="row">L???p</th>
                    <td>{detail.NAME}</td>
                </tr>
                <tr>
                    <th scope="row">Chuy??n ng??nh</th>
                    <td>{detail.major?.NAME}</td>
                </tr>
                <tr>
                    <th scope="row">Khoa</th>
                    <td>{detail.department?.NAME}</td>
                </tr>
                <tr>
                    <th scope="row">N??m v??o h???c</th>
                    <td>{detail.COURSE}</td>
                </tr>
                <tr>
                    <th scope="row">Gi??o vi??n c??? v???n</th>
                    <td>{detail.instructor?.FULL_NAME}</td>
                </tr>
                <tr>
                    <th scope="row">S??? s???</th>
                    <td>{detail.students?.length}</td>
                </tr>
            </tbody>
        </table>
    );
}

function AddModal({ detailClass }) {
    const dispatch = useDispatch();
    const initialValues = {
        studentId: "",
        fullName: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        citizenId: "",
    };
    const validationSchema = Yup.object({
        fullName: Validation.name,
        studentId: Validation.instructorId,
        dateOfBirth: Validation.dateOfBirth,
        gender: Validation.gender,
        citizenId: Validation.citizenId,
        address: Validation.address,
    });

    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };
    async function onSubmit(values, { setSubmitting, resetForm }) {
        console.log(values);
        setSubmitting(true);
        try {
            let dataForm = values;
            dataForm.classMajor = detailClass.ID;
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
    return (
        <>
            <button onClick={toggle} className="btn btn-outline-primary">
                Th??m sinh vi??n
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Th??m sinh vi??n</ModalHeader>
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
                                    label="M?? s??? sinh vi??n"
                                    name="studentId"
                                />
                                <FormikField
                                    type="text"
                                    label="H??? v?? t??n"
                                    name="fullName"
                                />
                                <FormikField
                                    type="text"
                                    label="?????a ch???"
                                    name="address"
                                />
                                <FormikField
                                    label="Ng??y sinh"
                                    name="dateOfBirth"
                                    type="date"
                                />
                                <FormikSelectField
                                    label="Gi???i t??nh"
                                    name="gender"
                                    data={Validation.dataSelectGender}
                                    defaultValue={null}
                                />
                                <FormikField
                                    label="C??n c?????c c??ng d??n"
                                    name="citizenId"
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

function StudentList() {
    const query = new URLSearchParams(useLocation().search);
    const s_search = query.get("search")

    const { name } = useParams();
    const students = useSelector((state) => state.student.list);
    const classMajors = useSelector((state) => state.class.list);
    const studentAfterFilter = React.useMemo(() => {
        let arr = students.concat([]);
        const classId = classMajors.find((cl) => cl.NAME == name)?.ID;
        arr = arr.filter((st) => st.CLASS == classId);

        arr = arr.filter(st =>{
            const {FULL_NAME,STUDENT_ID} = st;
            const name = (FULL_NAME+"").toLowerCase().trim()
            const studentId = (STUDENT_ID+"").toLowerCase().trim()
            const search = (s_search+"").toLowerCase().trim()
            return name.includes(search) || studentId.includes(search)
        })

        return arr;
    }, [name, students, classMajors,s_search]);

    return (
        <div className="mt-3">
            <center className="mb-3">
                <h3>Danh s??ch sinh vi??n</h3>
            </center>
            <div className="d-flex justify-content-start"><Filter/></div>
            <table class="table table-bordered table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">MSSV</th>
                        <th scope="col">H??? v?? t??n</th>
                        <th scope="col">?????a ch???</th>
                        <th scope="col">Ng??y sinh</th>
                        <th scope="col">Gi???i t??nh</th>
                        <th scope="col">CMND</th>
                        <th scope="col">H??nh ?????ng</th>
                    </tr>
                </thead>
                <tbody>
                    {studentAfterFilter.map((student) => (
                        <Student student={student} />
                    ))}
                </tbody>
            </table>
        </div>
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
    } = student;
    return (
        <tr>
            <th>{STUDENT_ID}</th>
            <td>{FULL_NAME}</td>
            <td>{ADDRESS}</td>
            <td>{Const.toVNDate(DATE_OF_BIRTH)}</td>
            <td>{GENDER == "M" ? "Nam" : "N???"}</td>
            <td>{CITIZEN_ID}</td>
            <td>
                <center>
                    <EditStudent student={student} />
                    <DeleteStudent student={student} />
                </center>
            </td>
        </tr>
    );
}

export function EditStudent({ student }) {
    const dispatch = useDispatch();
    const {
        STUDENT_ID,
        FULL_NAME,
        ADDRESS,
        CLASS,
        DATE_OF_BIRTH,
        GENDER,
        CITIZEN_ID,
    } = student;
    const initialValues = {
        studentId: STUDENT_ID,
        fullName: FULL_NAME,
        address: ADDRESS,
        classMajor: CLASS,
        dateOfBirth: Const.toStandardDate(DATE_OF_BIRTH),
        gender: GENDER,
        citizenId: CITIZEN_ID,
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
        let sendData = values;
        sendData.id = student.ID;

        try {
            const res = await axios.put("/api/student", sendData, {
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

    const defaultMajor = React.useMemo(()=>{
        return classMajors.find(cl => cl.ID == CLASS )?.MAJOR
    },[classMajors,CLASS])

    const defaultDepartment = React.useMemo(()=>{
        return majors.find(ma => ma.ID == defaultMajor)?.DEPARTMENT;
    },[majors,defaultMajor])


    
    const dataDepartment = React.useMemo(() => {
        return departments.map((de) => ({ key: de.NAME, value: de.ID }));
    }, [departments]);
    const [sDepart, setSDepart] = React.useState(defaultDepartment);
    React.useEffect(()=>{
        console.log(sDepart)
    },[sDepart])
   
    const dataMajor = React.useMemo(() => {

        let arr = majors.concat([]);
        arr = arr.filter((ma) => ma.DEPARTMENT == sDepart);
        arr = arr.map((ma) => ({ key: ma.NAME, value: ma.ID }));
        return arr
    }, [majors, sDepart]);
    const [sMajor, setSMajor] = React.useState(defaultMajor);

   
    const dataClass = React.useMemo(() => {
        let arr = classMajors.concat([]);
        arr = arr.filter((cl) => cl.MAJOR == sMajor);
        arr = arr.map((cl) => ({ key: cl.NAME, value: cl.ID }));
        return arr
    }, [dataMajor, sMajor, classMajors]);


    return (
        <>
            <button onClick={toggle} className="btn nowrap btn-warning mr-1 mb-1">
                <MdModeEdit /> Ch???nh s???a
            </button>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Ch???nh s???a th??ng tin sinh vi??n
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
                                    data={dataDepartment}
                                    defaultValue={sDepart}
                                    label="Khoa"
                                    onChange={(e) => setSDepart(e.target.value)}
                                />
                                <SelectField
                                    data={dataMajor}
                                    defaultValue={sMajor}
                                    label="Chuy??n ng??nh"
                                    onChange={(e) => setSMajor(e.target.value)}
                                />
                                <FormikSelectField
                                    defaultValue={CLASS}
                                    data={dataClass}
                                    label="L???p"
                                    name="classMajor"
                                />
                                <FormikField
                                    type="text"
                                    label="M?? s??? sinh vi??n"
                                    name="studentId"
                                />
                                <FormikField
                                    type="text"
                                    label="H??? v?? t??n"
                                    name="fullName"
                                />
                                <FormikField
                                    type="text"
                                    label="?????a ch???"
                                    name="address"
                                />
                                <FormikField
                                    label="Ng??y sinh"
                                    name="dateOfBirth"
                                    type="date"
                                />
                                <FormikSelectField
                                    label="Gi???i t??nh"
                                    name="gender"
                                    data={Validation.dataSelectGender}
                                    defaultValue={GENDER}
                                />
                                <FormikField
                                    label="C??n c?????c c??ng d??n"
                                    name="citizenId"
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

export function DeleteStudent({ student }) {
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
            id: student.ID,
            password: sha256(values.password),
        };

        try {
            const res = await axios.delete(
                "/api/student",
                { data: sendData },
                { withCredentials: true }
            );
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
    return (
        <>
            <button onClick={toggle} className="btn btn-danger nowrap mr-1">
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

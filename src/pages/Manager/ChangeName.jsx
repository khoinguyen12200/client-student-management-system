import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import * as Validation from "../../const/Validation";
import { FormikField, LoadingButton } from "../../components/InputField";
import { sha256 } from "js-sha256";
import { toast } from "react-toastify";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {useDispatch} from 'react-redux'
import {actions} from '../../redux/store'


const initialValues = {
    password: "",
    newName: "",
};
const validationSchema = Yup.object({
    password: Validation.password,
    newName: Validation.name,
});

export default function ChangeName() {
    const dispatch = useDispatch();

    const [redirect, setRedirect] = React.useState("");
    async function onSubmit(values, { setSubmitting }) {
        setSubmitting(true);
        try {
            const { password, newName } = values;
            const form = {
                password: sha256(password),
                newName: newName,
            };
            const res = await axios.post("/api/manager/change-name", form, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            dispatch(actions.manager.updateName(newName))
            setRedirect("/manager/account");
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    return (
        <div className="change-name-page p-3">
            {redirect && <Redirect to={redirect} />}
            <center className="mb-5">
                <h1>Đổi tên hiển thị</h1>
            </center>
            <div className="form-container">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form className="change-name-form">
                            <FormikField
                                type="password"
                                name="password"
                                label="Nhập mật khẩu"
                            />
                            <FormikField name="newName" label="Nhập tên mới" />

                            <LoadingButton
                                loading={formik.isSubmitting}
                                className="btn btn-primary mt-4"
                            >
                                Xác nhận
                            </LoadingButton>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

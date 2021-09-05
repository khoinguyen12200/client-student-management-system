import React from "react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import axios from "axios";

import * as Validation from "../const/Validation";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../redux/store";
import InputField, {
    FormikField,
    LoadingButton,
} from "../components/InputField";
export default function Login() {
    const dispatch = useDispatch();
    const info = useSelector((state) => state.manager.info);

    const [redirect, setRedirect] = React.useState(null);
    async function onSubmit(values, { setSubmitting }) {
        setSubmitting(true);
        dispatch(
            actions.manager.login(values, (success) => {
                setSubmitting(false);
                if (success) setRedirect("/manager");
            })
        );
    }

    const initialValues = { account: "", password: "" };
    const validation = Yup.object({
        account: Validation.account,
        password: Validation.password,
    });
    return (
        <div className="login-page">
            {redirect && <Redirect to={redirect} />}
            <center>
                <h1 className="title">Hệ thống quản lý sinh viên</h1>
            </center>
            <div className="flex-space">
                <div className="content">
                    <div className="card shadow ">
                        <center>
                            <h1>Đăng nhập</h1>
                        </center>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validation}
                            onSubmit={onSubmit}
                        >
                            {(formik) => (
                                <Form className="login-form">
                                    <FormikField
                                        label="Tên đăng nhập"
                                        name="account"
                                    />
                                    <FormikField
                                        label="Mật khẩu"
                                        name="password"
                                        type="password"
                                    />
                                    <LoadingButton
                                        className="btn btn-primary mt-3"
                                        type="submit"
                                        loading={formik.isSubmitting}
                                    >
                                        Đăng nhập
                                    </LoadingButton>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className="decor">
                    <img src="./admin-system.svg"/>
                </div>
            </div>
        </div>
    );
}

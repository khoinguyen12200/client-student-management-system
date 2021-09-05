import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import * as Validation from "../../const/Validation";
import { FormikField, LoadingButton } from "../../components/InputField";
import { sha256 } from "js-sha256";
import { toast } from "react-toastify";
import axios from "axios";
import { Redirect } from "react-router-dom";

const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
};
const validationSchema = Yup.object({
    oldPassword: Validation.password,
    newPassword: Validation.password.notOneOf(
        [Yup.ref("oldPassword")],
        "Mật khẩu mới không được trùng"
    ),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref("newPassword"), null],
        "Mật khẩu mới không khớp"
    ),
});
export default function ChangePassword() {
    const [redirect, setRedirect] = React.useState("");
    async function onSubmit(values, { setSubmitting }) {
        setSubmitting(true);
        try {
            const { oldPassword, newPassword, confirmPassword } = values;
            const form = {
                oldPassword: sha256(oldPassword),
                newPassword: sha256(newPassword),
                confirmPassword: sha256(confirmPassword),
            };
            const res = await axios.post("/api/manager/change-password", form, {
                withCredentials: true,
            });
            const { e, m } = res.data;
            if (e) throw new Error(m);
            toast(m, { type: "success" });
            setRedirect("/manager/account");
        } catch (e) {
            toast(e.message, { type: "error" });
        }

        setSubmitting(false);
    }
    return (
        <div className="change-password-page p-3">
            {redirect && <Redirect to={redirect} />}
            <center className="mb-5">
                <h1 className="page-title">Đổi mật khẩu</h1>
            </center>
            <div className="form-container">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => (
                        <Form className="change-password-form">
                            <FormikField
                                type="password"
                                name="oldPassword"
                                label="Mật khẩu cũ"
                            />
                            <FormikField
                                type="password"
                                name="newPassword"
                                label="Mật khẩu mới"
                            />
                            <FormikField
                                type="password"
                                name="confirmPassword"
                                label="Xác nhận lại mật khẩu"
                            />
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

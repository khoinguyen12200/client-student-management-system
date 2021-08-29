import * as Yup from "yup";

export const name = Yup.string().required();
export const account = Yup.string()
    .required("Không được bỏ trống")
    .min(5, "Không được ít hơn 5 ký tự")
    .max(30, "Không được nhiều hơn 30 ký tự")
    .matches(
        /[a-zA-Z0-9._]/,
        "Các ký tự được phép là chữ, số, chấm, gạch dưới"
    );
export const password = Yup.string()
    .required("Không được bỏ trống")
    .min(5, "Không được ít hơn 5 ký tự")
    .max(30, "Không được nhiều hơn 30 ký tự");
export const confirmPassword = Yup.string()
    .required("Không được bỏ trống")
    .oneOf([Yup.ref("password"), null], "Mật khẩu không trùng khớp");

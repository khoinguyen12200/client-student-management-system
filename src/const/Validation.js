import * as Yup from "yup";

export const name = Yup.string()
    .required()
    .min(5, "Không được ít hơn 5 ký tự")
    .max(30, "Không được nhiều hơn 30 ký tự")
    .matches(/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9 ]{0,}$/, "Các ký tự được phép là chữ và dấu cách");;
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

export const departmentName = Yup.string()
    .required("Không được bỏ trống")
    .min(5, "Không được ít hơn 5 ký tự")
    .max(50, "Không được nhiều hơn 50 ký tự")
    .matches(/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]{0,}$/, "Các ký tự được phép là chữ và dấu cách");

export const departmentSortName = Yup.string()
    .required("Không được bỏ trống")
    .min(2, "Không được ít hơn 2 ký tự")
    .max(9, "Không được nhiều hơn 9 ký tự")
    .matches(/^[a-zA-Z-]{0,}$/, "Các ký tự được phép là chữ và dấu gạch ngang");

export const id = Yup.number().required("Không được bỏ trống")

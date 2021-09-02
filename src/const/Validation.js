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

export const majorName = departmentName
export const majorSortName =  departmentSortName
export const id = Yup.number().required("Không được bỏ trống")

var d = new Date();
var year = d.getFullYear();
export const course = Yup.number().required("Không được bỏ trống").min(2000,`Số năm phải lớn hơn hoặc bằng 2000`).max(year,`Số năm nhỏ hơn hoặc bằng ${year}`)

export const majorClassName = Yup.string()
.required("Không được bỏ trống")
.min(2, "Không được ít hơn 2 ký tự")
.max(20, "Không được nhiều hơn 20 ký tự")
.matches(/^[a-zA-Z0-9]{0,}$/, "Các ký tự được phép là chữ và dấu gạch ngang");

export const dateOfBirth = Yup.date().required("Không được bỏ trống")
export const gender = Yup.string().required("Không được bỏ trống").matches(/^[MF]{0,1}$/,"Giá trị là M hoặc F")
export const dataSelectGender = [{key:"Nam",value:"M"},{key:"Nữ",value:"F"}];
export const citizenId = Yup.string().required("Không được bỏ trống").matches(/^[0-9]{0,}$/,"Chỉ cho phép số").max(11,"Tối đa 11 ký tự").min(9,"Tối thiểu 9 ký tự")
export const instructorId = Yup.string().required("Không được bỏ trống").matches(/^[A-Z0-9]{0,}$/,"Chỉ cho phép số và chữ in hoa").max(11,"Tối đa 11 ký tự").min(5,"Tối thiểu 5 ký tự")
export const studentId = Yup.string().required("Không được bỏ trống").matches(/^[A-Z0-9]{0,}$/,"Chỉ cho phép số và chữ in hoa").max(11,"Tối đa 11 ký tự").min(5,"Tối thiểu 5 ký tự")








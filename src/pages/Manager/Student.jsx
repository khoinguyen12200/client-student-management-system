import React from "react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { MdModeEdit } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import * as Validation from "../../const/Validation";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../redux/store";
import InputField, {
    FormikField,
    LoadingButton,
    FormikSelectField,
} from "../../components/InputField";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { sha256 } from "js-sha256";
import { date } from "yup/lib/locale";
import * as Const from "../../const";

export default function Student() {
    const [search, setSearch] = React.useState("");

    return (
        <div className="student-page p-3">
            <center className="mb-3">
                <h1>Sinh viên</h1>
            </center>
            <div className="headSpace">
                <div>
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
                </div>
                {/* <AddModal /> */}
            </div>
        </div>
    )
}

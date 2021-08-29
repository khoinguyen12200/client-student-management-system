import React, { ReactElement } from "react";
import { ErrorMessage, useField } from "formik";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { AiOutlineLoading3Quarters as Loading } from "react-icons/ai";
import {motion} from 'framer-motion';



export default function InputField(props) {
    const { label, value, onChange, type, error, ...rest } = props;

    const [show, setShow] = React.useState(false);
    function toggleShow() {
        setShow(!show);
    }
    return (
        <div className="input-field mb-3">
            {label && <label className="form-label">{label}</label>}
            <div className="input-group">
                <input
                    className={"form-control " + (error && " is-invalid")}
                    type={
                        type !== "password" ? type : show ? "text" : "password"
                    }
                    value={value}
                    onChange={onChange}
                    {...rest}
                />
                {type == "password" && (
                    <button
                        type="button"
                        className="btn-secondary btn"
                        onClick={toggleShow}
                    >
                        {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                )}
            </div>

            {error && <div className="i-error">{error}</div>}
        </div>
    );
}

export function FormikField({ label, ...rest }) {
    const [field, meta] = useField(rest);

    const error = React.useMemo(() => {
        if (meta.touched && meta.error) {
            return meta.error;
        }
        return "";
    }, [meta]);

    return <InputField label={label} {...field} {...rest} error={error} />;
}



export function LoadingButton(props) {
    const {loading,children,...rest} = props;
    const [firstRender,setFirst] = React.useState(true);
    const variants = {
        animate:{
            width: loading ? "auto" : 0
        },
        initial:{
            width: !loading ? "auto" : 0 
        }
    }
    React.useEffect(()=>{
        setFirst(false)
    },[])
    return (
        <button

            {...rest}
            disabled={loading}
        >
            <div className="loading-button">
                <motion.div
                    variants={!firstRender ? variants : undefined}
                    animate={"animate"}
                    initial={"initial"}
                    style={{ overflow: "hidden", width: 0 }}
                >
                    <Loading
                        className="loadingsym"
                        style={{ lineHeight: 0 }}
                    />
                </motion.div>
                <div className="child">{children}</div>
            </div>
        </button>
    );
}

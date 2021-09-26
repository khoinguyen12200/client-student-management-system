import React, { ReactElement } from "react";
import { ErrorMessage, useField } from "formik";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { AiOutlineLoading3Quarters as Loading } from "react-icons/ai";
import { motion } from "framer-motion";

export default function InputField(props) {
    const { label, labelGroup, value, onChange, type, error, ...rest } = props;

    const [show, setShow] = React.useState(false);
    function toggleShow() {
        setShow(!show);
    }
    return (
        <div className="input-field mb-3">
            {label && <label className="form-label">{label}</label>}
            <div className="input-group">
                {labelGroup && (
                    <div className="input-group-prepend">
                        <span className=" input-group-text">{labelGroup}</span>
                    </div>
                )}
                <input
                    className={"form-control " + (error && " is-invalid")}
                    // type={
                    //     type !== "password" ? type : show ? "text" : "password"
                    // }
                    type={type}
                    value={value}
                    onChange={onChange}
                    {...rest}
                />
                {/* {type == "password" && (
                    <div className="input-group-append">
                        <div
                            type="button"
                            className="btn-secondary btn"
                            onClick={toggleShow}
                        >
                            {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </div>
                    </div>
                )} */}
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

export function SelectField(props) {
    const {
        label,
        labelGroup,
        value,
        data,
        defaultValue,
        onChange,
        type,
        error,
        ...rest
    } = props;

    return (
        <div className="input-field mb-3">
            {label && <label className="form-label">{label}</label>}

            <div className="input-group">
                {labelGroup && (
                    <div className="input-group-prepend">
                        <span className=" input-group-text">{labelGroup}</span>
                    </div>
                )}
                <select {...rest} onChange={onChange} className="custom-select">
                    {defaultValue === null && (
                        <option value={null} selected={true}>
                            Hãy chọn giá trị
                        </option>
                    )}
                    {data && data.map(({ key, value }, index) => (
                        <option
                            key={value}
                            value={value}
                            selected={value === defaultValue}
                        >
                            {key}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="i-error">{error}</div>}
        </div>
    );
}

export function FormikSelectField({ label, ...rest }) {
    const [field, meta] = useField(rest);

    const error = React.useMemo(() => {
        if (meta.touched && meta.error) {
            return meta.error;
        }
        return "";
    }, [meta]);

    return <SelectField label={label} {...field} {...rest} error={error} />;
}

export function LoadingButton(props) {
    const { loading, children, ...rest } = props;
    const [firstRender, setFirst] = React.useState(true);
    const variants = {
        animate: {
            width: loading ? "auto" : 0,
        },
        initial: {
            width: !loading ? "auto" : 0,
        },
    };
    React.useEffect(() => {
        setFirst(false);
    }, []);
    return (
        <button {...rest} disabled={loading}>
            <div className="loading-button">
                <motion.div
                    variants={!firstRender ? variants : undefined}
                    animate={"animate"}
                    initial={"initial"}
                    style={{ overflow: "hidden", width: 0 }}
                >
                    <Loading className="loadingsym" style={{ lineHeight: 0 }} />
                </motion.div>
                <div className="child">{children}</div>
            </div>
        </button>
    );
}

// File created : 07-06-2019 09:02
import React, {useEffect, useState} from 'react';
import "../Form.css";

const TextInput = ({field, className, status, onChange = () => {}, value = ""}) => {

    const [val, setVal] = useState(value);

    const statusClass = () => {
        switch (status) {
            case "error" :
                return "bg-error";
            case "valid" :
                return "bg-valid";
            default :
                return "bg-neutral";
        }
    };

    const inputEffect = () => {
      onChange(val);
    };
    useEffect(inputEffect, [val]);

    return (
        <div
            className={`form-group ${className} ${field.visibility !== "visible" || field.type === "hidden" ? "d-none" : ""}`}>
            <label>
                {field.label} {field.isRequired && <span className="text-danger">*</span>}
            </label>
            <input
                name={field.id}
                type={field.type}
                className={`form-control ${statusClass()}`}
                aria-describedby={field.label}
                placeholder={field.placeholder}
                onChange={e => {
                    setVal(e.target.value);
                }}
                required={field.isRequired}
                value={val}
            />
            <small className="form-text text-muted">{field.description}</small>
        </div>

    );

};

export default TextInput;

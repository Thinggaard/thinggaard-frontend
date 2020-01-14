// File created : 07-06-2019 09:02
import React from 'react';

const TextArea = props => {

    const {
        field, className, error, onChange = () => {
        }, value = ""
    } = props;

    const {size = "medium"} = field;

    const rows = () => {
        switch (size) {
            case "large":
                return 10;
            case "small":
                return 3;
            default:
                return 4
        }
    };

    return (

        <div
            className={`form-group col-12 ${className} ${field.visibility !== "visible" || field.type === "hidden" ? "d-none" : ""}`}>
            <label>
                {field.label} {field.isRequired && <span className="text-danger">*</span>}
            </label>
            <textarea
                rows={rows()}
                name={field.id}
                className={`form-control ${error ? "is-invalid" : ""}`}
                aria-describedby={field.label}
                placeholder={field.placeholder}
                onChange={e => onChange(e.target.value)}
                required={field.isRequired}
                value={value}
            />
            <small className="form-text text-muted">{field.description}</small>
        </div>

    );

};

export default TextArea;

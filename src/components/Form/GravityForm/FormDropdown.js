// File created : 07-06-2019 09:02
import React from 'react';
import "../Form.css";
import Dropdown from "../Dropdown";

const FormDropdown = props => {

    const {
        field, onChange = () => {
        }, selected
    } = props;

    const {size = "medium"} = field;

    const sizeClass = () => {
        switch (size) {
            case "small" :
                return "col-12 col-md-6 col-lg-4";
            case "medium" :
                return "col-12 col-lg-6";
            default : //large
                return "col-12";
        }
    };

    return (
        <div
            className={`form-group ${sizeClass()} ${field.cssClass} ${field.visibility !== "visible" || field.type === "hidden" ? "d-none" : ""}`}>
            <label>
                {field.label} {field.isRequired && <span className="text-danger">*</span>}
            </label>
            <Dropdown
                placeholder={field.placeholder}
                selectedClass={"bg-light"}
                options={field.choices.map(choice => (
                    {
                        label: choice.text,
                        value: choice.value,
                    }
                ))}
                onChange={choice => onChange(choice)}
                selected={selected}
            />
            <small className="form-text text-muted">{field.description}</small>
        </div>

    );

};

export default FormDropdown;

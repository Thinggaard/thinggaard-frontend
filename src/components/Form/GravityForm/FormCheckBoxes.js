import React, {useEffect} from 'react';
import "../Form.css";

const FormCheckBoxes = props => {

    const {
        field, onChange = () => {
        }, checked = false
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

    const setPreChecked = () => {
        field.choices.forEach((choice, i) => {
            if (choice.isSelected) onChange({value: true, id: field.inputName || field.inputs[i].id})
        })
    };
    useEffect(setPreChecked, []);


    return (
        <div
            className={`form-group ${sizeClass()} ${field.cssClass} ${field.visibility !== "visible" || field.type === "hidden" ? "d-none" : ""}`}>
            <label>
                {field.label} {field.isRequired && <span className="text-danger">*</span>}
            </label>
            {
                field.choices.map((choice, i) => (
                    <div className="input-group mb-2 row" key={i}>
                        <div className="checkbox-input col-1">
                        <input type="checkbox" checked={checked} onChange={e => onChange({
                            value: e.target.checked,
                            id: field.inputName || field.inputs[i].id
                        })}/></div>
                        <div className={"checkbox-text col-10"}>{choice.value}</div>
                    </div>
                ))
            }
            <small className="form-text text-muted">{field.description}</small>
        </div>

    );

};

export default FormCheckBoxes;

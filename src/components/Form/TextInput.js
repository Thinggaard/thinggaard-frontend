import React, {useEffect, useState} from 'react';

const TextInput = ({placeholder, name, label, value="", onChange, children, type="text", required=false, readOnly=false}) => {

    const [val, setVal] = useState("");

    const onProvidedValue = () => {
        if (value !== val && value!==null) {
            setVal(value);
        }
    };
    useEffect(onProvidedValue, [value]);

    return (
        <div className="input-group pb-2">
            <div className="input-container">
                {!!label &&
                    <div className={"input-label clearfix text-left"}>{label}
                        {required && <span className={"text-danger"}>*</span>}
                    </div>
                }
                <input type={type} className="form-control bg-transparent text-light"
                       required={required}
                       readOnly={readOnly}
                       placeholder={placeholder}
                       aria-label={label || placeholder}
                       value={val}
                       onChange={e => {
                           setVal(e.target.value);
                           onChange(e.target.value);
                       }}
                       name={name}
                />
                {children}
            </div>
        </div>
    )
};

export default TextInput;

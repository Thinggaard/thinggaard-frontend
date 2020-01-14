import React, {useEffect, useState} from 'react';

export default ({placeholder, label, value = null, onChange, children, rows=4, required=false}) => {

    const [val, setVal] = useState("");

    const onProvidedValue = () => {
        if (value !== val && value !== null) {
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
                <textarea
                    required={required}
                    rows={rows+""}
                    className="form-control bg-transparent text-light"
                    placeholder={placeholder}
                    aria-label={label || placeholder}
                    value={val}
                    onChange={e => {
                        setVal(e.target.value);
                        onChange(e.target.value);
                    }}
                />
                {children}
            </div>
        </div>
    )
};


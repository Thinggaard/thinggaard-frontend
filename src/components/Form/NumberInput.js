import React, {useEffect, useState} from 'react';

export default ({placeholder, label, value, onChange, children, min, max, step, inputClass="", required=false, className=""}) => {

    const [val, setVal] = useState(value);

    const onValueUpdate = () => {
        onChange(val);
    };
    useEffect(onValueUpdate, [val]);

    const onProvidedValue = () => {
        if (value !== val) {
            setVal(value);
        }
    };
    useEffect(onProvidedValue, [value]);

    return (
        <div className={"input-group pb-2 "+className}>
            <div className="input-container">
                {!!label &&
                    <div className={"input-label clearfix text-left"}>
                        {label}{required && <span className={"text-danger"}>*</span>}
                    </div>
                }
                <input
                    required={required}
                    min={min}
                    max={max}
                    step={step}
                    type="number"
                    className={"form-control bg-transparent text-light "+inputClass}
                    placeholder={placeholder}
                    aria-label={label || placeholder}
                    value={val}
                    onChange={e => {
                       setVal(e.target.value);
                    }}
                />
                {children}
            </div>
        </div>
    )
};
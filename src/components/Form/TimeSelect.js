import React from "react";

export default ({label, hour, setHour, minute, setMinute, children, required=false}) => {

    return (
        <div className="input-group pb-2">
            {!!label &&
                <div className={"input-label clearfix text-left"}>
                    {label}{required && <span className={"text-danger"}>*</span>}
                </div>}
            <div className="input-container container-fluid">
                <div className="row" key={"time-select"}>
                    <input
                        required={required}
                        min={0}
                        max={23}
                        className="form-control bg-transparent text-light text-center col-6"
                        type="number"
                        placeholder={"TT"}
                        aria-label={"timer"}
                        value={hour}
                        onChange={e => {
                            setHour(!!e.target.value ? ("0"+e.target.value).slice(-2) : "");
                        }}
                    />
                    <input
                        required={required}
                        min={0}
                        max={59}
                        step={5}
                        className="form-control bg-transparent text-light text-center col-6"
                        type="number"
                        placeholder={"MM"}
                        aria-label={"minutter"}
                        value={minute}
                        onChange={e => {
                            setMinute(!!e.target.value ? ("0"+e.target.value).slice(-2) : "");
                        }}
                    />
                </div>
                {children}
            </div>
        </div>
    )
}
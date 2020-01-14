import React from "react";
import NumberFormat from "react-number-format";

export default ({price, tax = 0, prefix="DKK ", className=""}) => {

    let suffix = ",-";
    if (tax === -1) suffix = ",- ex. moms";
    else if (tax === 1) suffix = ",- inkl. moms";

    return(
        <NumberFormat
            className={className}
            value={price}
            displayType={'text'}
            thousandSeparator={'.'} decimalScale={0}
            decimalSeparator={','}
            prefix={prefix} suffix={suffix}
        />
    );
}
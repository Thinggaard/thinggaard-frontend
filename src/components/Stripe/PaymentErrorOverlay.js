import React from 'react';
import Overlay from "../Overlay/Overlay";

const PaymentErrorOverlay = ({onClose}) => {

    return (
        <Overlay title={"Betalingsfejl"} open={true} maxWidth={450} toggleOverlay={onClose}>
            <div className="d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <h1 className="text-danger">Ups...</h1>
                    <p>
                        Der opstod en fejl under betaling.<br/>
                        Kontroller venligst at dine betalingsoplysninger er korrekte.<br/><br/>
                        Hvis fejlen gentager sig : kontakt os på <a href="mailto:info@youandx.com">info@youandx.com</a>
                    </p>
                </div>
            </div>
        </Overlay>
    )

};

export default PaymentErrorOverlay
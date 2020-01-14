import Price from "../Utility/Price";
import React from "react";

const AdminPriceTable = (
    {
        priceProduct, priceTransport, feeSpeaker, feeCustomer, feeParticipants, feeInvoice,
        totalExMoms, taxTotal, feeNoTax, total, speakerPayment,
        currencyProduct, currencyParticipants, currencyTransport, currencyFees,
        getDKKprice, noTax, feeType, cached = false, bookingFields,
    }
    ) => {

    const feeCustomerFixed = feeType === "fixed" || cached ? parseFloat(feeCustomer) : parseInt(parseInt(priceProduct) * parseInt(feeCustomer) / 100);
    const feesCurrency = feeType === "fixed" ? currencyFees : currencyProduct;

    const feeSpeakerProductFixed = feeType === "fixed" || cached ? parseFloat(feeSpeaker) :
        getDKKprice(parseInt(priceProduct)*parseInt(feeSpeaker) / 100, currencyProduct)
        + getDKKprice(parseInt(feeParticipants)*parseInt(feeSpeaker)/100, currencyParticipants);

    if (!cached){
        totalExMoms = getDKKprice(priceProduct, currencyProduct) + getDKKprice(feeCustomerFixed, feesCurrency)
            + getDKKprice(priceTransport, currencyTransport) + parseFloat(feeInvoice) + getDKKprice(feeParticipants, currencyParticipants);

        taxTotal = noTax ? 0 : totalExMoms / 4;

        feeNoTax = noTax ? totalExMoms / 20 : 0; // 5% lønsumsafgift

        speakerPayment = getDKKprice(priceProduct, currencyProduct) +
            getDKKprice(priceTransport, currencyTransport) + getDKKprice(feeParticipants, currencyParticipants)
            - feeSpeakerProductFixed;

    } else {
        noTax = !bookingFields.booking_payment_tax || parseInt(bookingFields.booking_payment_tax) === 0;
    }

    const dkkProductPrice = getDKKprice(priceProduct, currencyProduct);

    return (

        <table className="table table-sm table-dark table-borderless w-100 mb-5 bg-transparent">
            <tbody>
            <tr>
                <td>Foredragets pris:</td>
                <td className={"text-right"}>
                    <Price className={currencyProduct !== "DKK" ? "text-secondary" : ""}
                           prefix={currencyProduct + " "}
                           price={priceProduct}/>
                    {currencyProduct !== "DKK" &&
                    <><br/>
                        <Price price={dkkProductPrice}
                        />
                    </>
                    }
                </td>
            </tr>


            <tr>
                <td>Gebyr pålagt kunden:</td>
                <td className={"text-right"}>
                    <Price className={feesCurrency !== "DKK" ? "text-secondary" : ""}
                           prefix={feesCurrency + " "} price={feeCustomerFixed}/>
                    {feesCurrency !== "DKK" &&
                    <><br/><Price price={getDKKprice(feeCustomerFixed, feesCurrency)}/></>
                    }
                </td>
            </tr>

            <tr>
                <td>Transport:</td>
                <td className={"text-right"}>
                    <Price className={currencyTransport !== "DKK" ? "text-secondary" : ""}
                           prefix={currencyTransport + " "} price={priceTransport}/>
                    {currencyTransport !== "DKK" &&
                    <><br/><Price price={getDKKprice(priceTransport, currencyTransport)}/></>
                    }
                </td>
            </tr>

            {
                !!feeParticipants &&
                <tr>
                    <td>Ekstra deltagere:</td>
                    <td className={"text-right"}>
                        <Price className={currencyParticipants !== "DKK" ? "text-secondary" : ""}
                               prefix={currencyParticipants + " "} price={feeParticipants}/>
                        {currencyParticipants !== "DKK" &&
                        <><br/><Price price={getDKKprice(feeParticipants, currencyParticipants)}/></>
                        }
                    </td>
                </tr>
            }

            <tr>
                <td>Fakturagebyr:</td>
                <td className={"text-right"}><Price price={feeInvoice}/></td>
            </tr>

            <tr className="border-primary border-top">
                <td>I alt:</td>
                <td className={"text-right"}>
                    <Price tax={-1} price={totalExMoms}/>
                </td>
            </tr>

            {
                noTax ?
                    <tr>
                        <td>5% lønsumsafgift :</td>
                        <td className={"text-right"}>
                            <Price price={feeNoTax}/>
                        </td>
                    </tr>
                    :
                    <tr>
                        <td>25% moms :</td>
                        <td className={"text-right"}>
                            <Price price={taxTotal}/>
                        </td>
                    </tr>
            }


            <tr>
                <th>Total:</th>
                <th className={"text-right"}>
                    <Price tax={noTax ? 0 : 1} price={cached ? total : totalExMoms + taxTotal + feeNoTax}/>
                </th>
            </tr>


            <tr className="border-primary border-top">
                <td>Fratrukket speaker:</td>
                <td className={"text-right"}>
                    <Price prefix={"DKK "} price={feeSpeakerProductFixed}/>
                </td>
            </tr>

            <tr>
                <td>Speaker Andel :</td>
                <td className={"text-right"}>
                    <Price prefix={"DKK "} price={speakerPayment} />
                </td>
            </tr>

            <tr>
                <th>DB :</th>
                <th className={"text-right"}>
                    <Price prefix={"DKK "} price={totalExMoms - speakerPayment} />
                </th>
            </tr>

            </tbody>

        </table>


    );
};

export default AdminPriceTable;

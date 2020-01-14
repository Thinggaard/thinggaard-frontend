import React, {useState} from 'react';
import "./BookingsTable.css";
import {FaCaretDown, FaCaretUp} from 'react-icons/fa'
import {WP_ROOT} from "../../constants";
import Price from "../../components/Utility/Price";
import EditBooking from "./EditBooking";
import {exportToCsv} from "../../functions/csvFunctions";
import {unwrapSingleValueArray} from "../../functions/parserFunctions";

const columns = [
    {
        name : "booking_creation_datestamp", label: "Oprettet", numeric : false, thClass : "narrow",
        content : (row, i) => <td key={i} className="text-nowrap narrow">{row.meta.booking_creation_date}</td>,
        csv : (row) => row.meta.booking_creation_date,
    },
    {
        name : "post_datestamp", label: "Ændret dato", numeric : false, thClass : "narrow",
        content : (row, i) => <td key={i} className="text-nowrap narrow">{row.post_date && row.post_date.substring(0,10)}</td>,
        csv : (row) => row.post_date && row.post_date.substring(0,10),
    },
    {
        name : "booking_datestamp", label: "Event dato", numeric : true, thClass : "narrow",
        content : (row, i) => <td key={i}  className="narrow">{row.meta.booking_date}</td>,
        csv : (row) => row.meta.booking_date,
    },
    {
        name : "booking_status", label : "Status", numeric : false, thClass : "narrow",
        content : (row, i) => <td key={i}  className="narrow">{row.meta.booking_status}</td>,
        csv : (row) => row.meta.booking_status
    },
    {
        name: "booking_relation_booking", label: "ID", numeric : true, thClass : "narrow",
        content: (row, i) => (
            <td key={i} className="narrow">
                <a
                    target={"_blank"}
                    rel="noopener norefferer"
                    href={`${WP_ROOT}/wp-admin/post.php?post=${row.ID}&action=edit`}
                >
                    {row.ID}
                </a>
            </td>
        ),
        csv: row => row.ID,
    },
    {
        name: "booking_customer_name", label: "Kunde", numeric : false,
        content: (row, i) => <td key={i} >{row.meta.booking_customer_name}</td>,
        csv: (row) => row.meta.booking_customer_name,
    },
    {
        name : "booking_company_name", label: "Firma", numeric : false,
        content : (row, i) => <td key={i} >{row.meta.booking_company_name}</td>,
        csv : (row) => row.meta.booking_company_name,
    },
    {
        name : "booking_speaker_name", label: "Speaker", numeric : false,
        content : (row, i) => <td key={i} >
            {
                !row.meta.booking_speaker_slug ? row.meta.booking_speaker_name
                    : <a target={"_blank"} href={row.meta.booking_speaker_slug}>{row.meta.booking_speaker_name}</a>
            }
        </td>,
        csv: row => row.meta.booking_speaker_name,
    },
    {
        name : "booking_product", label: "Produkt", numeric : false,
        content : (row, i) => <td key={i} >
            {
                !row.meta.booking_product_slug ? row.meta.booking_product
                    : <a target={"_blank"} href={row.meta.booking_product_slug}>{row.meta.booking_product}</a>
            }
        </td>,
        csv: row => row.meta.booking_product,
    },
    {
        name : "booking_payment_pretax", label: "Omsætning", numeric : true,
        content : (row, i) => (
            <td key={i} >
                <Price className={"h6"} price={parseFloat(unwrapSingleValueArray(row.meta.booking_payment_pretax))}/><br/>
                {
                    !parseInt(row.meta.booking_payment_tax[0]) ? <small>Momsfri</small> :
                        <small><Price price={parseFloat(row.meta.booking_payment_total[0])} tax={1}/></small>
                }
            </td>
        ),
        csv: row => unwrapSingleValueArray(row.meta.booking_payment_pretax),
    },
    {
        name : "booking_payment_speaker_pretax", label: "Til speaker", numeric : true,
        content : (row, i) => (
            <td key={i} >
                <Price className={"h6"} price={parseFloat(unwrapSingleValueArray(row.meta.booking_payment_speaker_pretax[0]))}/><br/>
                {
                    !parseInt(row.meta.booking_payment_tax[0]) ? <small>Momsfri</small> :
                        <small><Price price={parseFloat(row.meta.booking_payment_speaker)} tax={1}/></small>
                }
            </td>
        ),
        csv: row => unwrapSingleValueArray(row.meta.booking_payment_speaker_pretax),
    },
    {
        name : "booking_payment_db", label: "DB", numeric : true,
        content : (row, i) => (
            <td key={i} >
                <Price className={"h6"} price={parseFloat(unwrapSingleValueArray(row.meta.booking_payment_db))}/>
            </td>
        ),
        csv: row => unwrapSingleValueArray(row.meta.booking_payment_db),
    },
    {
        name : "booking_accounting_invoiced", label: "Faktureret", numeric : true, thClass : "narrow",
        content : (row, i) => <td key={i} className="narrow">
            {parseInt(row.meta.booking_accounting_invoiced[0]) === 1 ? "Ja" : "Nej"}
        </td>,
        csv: row => row.meta.booking_accounting_invoiced[0] === "1" ? "Ja" : "Nej",
    },
    {
        name : "booking_accounting_invoicenumber", label : "Faktura nr.", numeric : true, thClass : "narrow",
        content : (row, i) => <td className="narrow" key={i} >{row.meta.booking_accounting_invoicenumber[0]}</td>,
        csv : (row) => row.meta.booking_accounting_invoicenumber[0]
    },
    {
        name : "booking_accounting_invoicepaid", label : "Betaling d.", numeric : true, thClass : "narrow",
        content : (row, i) => <td className="narrow" key={i} >{row.meta.booking_accounting_invoicepaid[0]}</td>,
        csv : (row) => row.meta.booking_accounting_invoicepaid[0],
    },
    {
        name : "booking_accounting_invoicedue", label : "Betal senest", numeric : false, thClass : "narrow",
        content : (row, i) => <td className="narrow" key={i} >{row.meta.booking_accounting_invoicedue[0]}</td>,
        csv : (row) => row.meta.booking_accounting_invoicedue[0],
    },
    {
        name : "booking_accounting_speakerpaid", label : "Afregnet", numeric : true, thClass : "narrow",
        content : (row, i) => <td className="narrow" key={i} >
            {row.meta.booking_accounting_speakerpaid[0] === "0" ? "Nej" : "Ja"}
        </td>,
        csv: row => row.meta.booking_accounting_speakerpaid[0] === "0" ? "Nej" : "Ja",
    },
    {
        name : "booking_accounting_speakerinvoicenumber", label : "Betalingsbilag", numeric : false, thClass : "narrow",
        content : (row, i) => <td className="narrow" key={i} >{row.meta.booking_accounting_speakerinvoicenumber[0]}</td>,
        csv : (row) => row.meta.booking_accounting_speakerinvoicenumber[0],
    },
];


const BookingsTable = ({rows, sortRows, order, sortBy, setSortBy, setSortNumeric}) => {

    const [editBooking, setEditBooking] = useState(0);

    const downloadCSV = (semicolon = false) => {
        const filename = prompt("Skriv ønsket filnavn?") + ".csv";
        const csvHeader = [columns.map(col => (col.label))];
        const csvRows = rows.map(row => (
            columns.map((column, i) => (
                column.csv(row)
            ))
        ));
        exportToCsv(filename, csvHeader.concat(csvRows), semicolon);
    };

    const onRowClick = (e, bookingId) => {
        if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            setEditBooking(parseInt(bookingId));
        }
    };

    return(
        <>
            <div className="bookings-table">

                <EditBooking bookingId={editBooking} setBookingId={setEditBooking} />

                <table
                    className="table table-sm table-dark text-light table-striped table-bordered"
                >
                    <thead className="text-nowrap position-sticky" style={{top: 100}}>
                        <tr>
                            {
                                columns.map(column => (
                                   <th
                                       className={"pointer "+ column.thClass || ""}
                                       key={column.name}
                                       onClick={() => {
                                           sortRows(rows, column.name, column.numeric);
                                           setSortBy(column.name);
                                           setSortNumeric(column.numeric);
                                       }}
                                   >
                                       {column.label}
                                       {sortBy !== column.name ? null : order === 1 ? <FaCaretUp/> : <FaCaretDown/>}
                                   </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.ID} title={row.post_title} onClick={e => {onRowClick(e, row.ID)}}>
                                {columns.map((column, i) => (
                                    column.content(row, i)
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mb-4">
                <h4>Download CSV</h4>
                <button className="btn btn-outline-light mr-4" onClick={() => downloadCSV(true)}>Semikolon separeret (excel)</button>
                <button className="btn btn-outline-light" onClick={() => downloadCSV(false)}>Komma separeret</button>
            </div>
        </>
    );
};

export default BookingsTable;

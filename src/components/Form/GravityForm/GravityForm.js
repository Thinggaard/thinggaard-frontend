// File created : 03-05-2019 19:50
import React, {useEffect, useState} from 'react';
import axios from "axios/index";
import validator from "validator";
import {API, TOKEN} from "../../../constants";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import Notification from "../../Status/Notification";
import FormDropdown from "./FormDropdown";
import FormCheckBoxes from "./FormCheckBoxes";
import FormRadioBtns from "../RadioButton/FormRadioBtns"
import parse from "html-react-parser";
import StarRatingInput from "./StarRatingInput";

const GravityForm = ({id, classes, style, onSubmit, allowNew, showTitle = true, successCallback = () => {}, providedValues}) => {

    const [form, setForm] = useState(null);
    const [error, setError] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [submitStatus, setSubmitStatus] = useState("");
    const [missingFields, setMissingFields] = useState(false);
    const [fieldError, setFieldError] = useState(false);
    const [values, setValues] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    const isMultipage = !!form && !!form.pagination;
    const numberPages = isMultipage ? form.pagination.pages.length : 1;

    const onMount = () => {
        getForm(id)
    };
    useEffect(onMount, [id]);

    const onProvidedValues = () => {
        setValues({...values, ...providedValues})
    };
    useEffect(onProvidedValues, [providedValues]);

    const getForm = (id) => {
        axios.get(API + "gform?" + TOKEN + "&id=" + id).then(res => {
            setForm(res.data.results.form);
        }).catch(e => console.log(e));
    };

    const parseGFormResponse = (str, valuePairs) => {
        let string = str;
        valuePairs.forEach(pair => {
            string.replace(pair.key, pair.value);
        });
        return string;
    };

    const validationType = (fieldType) => {
        switch (fieldType) {
            case "email":
                return validator.isEmail;
            case "phone":
                return validator.isMobilePhone;
            default :
                return function () {
                    return true
                };
        }
    };

    const sizeClass = (size) => {
        switch (size) {
            case "small" :
                return "col-12 col-md-6 col-lg-4";
            case "medium" :
                return "col-12 col-lg-6";
            default : //large
                return "col-12";
        }
    };

    const status = (id) => {
        if (error.includes(id + "")) {
            if (attempts > 0) return "error";
            return ""
        }
        if (!!values[id + ""] && !error.includes([id + ""])) return "valid";
        return ""
    };

    const setValue = (value, id) => {
        setValues(p => {
            const newValues = p;
            newValues[id+""] = value;
            return newValues;
        });
    };

    const fieldChange = (value, id, type) => {
        setValue(value, id);
        const valid = validationType(type)(value);
        if (valid) {
            setError(error.filter(err => (err !== id + "")));
        } else if (!error.includes(id + "")) {
            setError([...error, id + ""]);
        }
    };

    const checkRequired = () => {
        let filledRequired = true;

        form.fields.forEach(field => {
            if (field.type !== "checkbox" && field.type !== "page" && field.isRequired) { //cannot easily check for checkbox-group fulfilment)
                if (!values[field.id + ""] && !values[field.inputName]) {
                    filledRequired = false;
                }
            }
        });

        return filledRequired;
    };

    const afterSubmit = (res) => {
        setCurrentPage(Math.min(currentPage + 1, numberPages - 1));
        if (!!isMultipage && currentPage + 1 !== numberPages) return;
        if (!!res && !!res.data && res.data.status) {
            setSubmitStatus("success");
            successCallback(res.data.results);
        } else setSubmitStatus("error");
    };


    if (!!form && submitStatus === "success") {
        let conf = [];
        for (let _conf in form.confirmations) {
            const message = form.confirmations[_conf].message;
            conf.push(parseGFormResponse(message, [{key: "{save_link}", value: "888"}]));
        }
        return (
            <div className="p-5 bg-dark-grey">
                {conf.map((message, i) => (
                    <h4 key={i} className="text-success">{parse(message)}</h4>
                ))}
                {
                    allowNew &&
                    <button type="button" onClick={() => {
                        window.location.reload()
                    }} className="btn btn-outline-secondary">Ny indsendelse
                    </button>
                }

            </div>
        );
    }

    if (!!form && submitStatus === "error") {
        return (
            <div className="p-5 bg-dark-grey">
                <h1 className="text-danger">Ups!</h1>
                Der opstod en uventet fejl. Prøv igen senere
            </div>
        )
    }

    const getPageButtons = () => {
        if (!isMultipage) return null;

        let prev = <div/>;
        let next = <div/>;
        form.fields.forEach(field => {
            if (field.type === "page") {
                if (field.pageNumber === currentPage + 1) {
                    prev = (
                        <button
                            type={"button"}
                            className="btn btn-secondary"
                            onClick={() => {
                                setCurrentPage(Math.max(currentPage - 1, 0))
                            }}
                        >
                            {field.previousButton.text}
                        </button>
                    );
                } else if (field.pageNumber === currentPage + 2) {
                    next = field.cssClass === "submit" ?
                        <input
                            type={"submit"}
                            className="btn btn-primary"
                            value={field.nextButton.text}
                        />
                        :
                        <button
                            type={"button"}
                            className="btn btn-primary"
                            onClick={() => {
                                setCurrentPage(Math.min(currentPage + 1, numberPages - 1))
                            }}
                        >
                            {field.nextButton.text}
                        </button>

                }
            }
        });
        if (currentPage + 1 === numberPages) {
            next =
                <input
                    type="submit"
                    className={checkRequired() && !error.length ? "btn btn-success" : "btn btn-secondary disabled"}
                    value={form.button.text}
                />
        }

        return (
            <div className="col-12 d-flex justify-content-between">
                {prev}
                {next}
            </div>
        )
    };

    const submit = () => {
        const postData = {form_id: form.id, ...values};
        const requiredFilled = checkRequired();
        if (!error.length && requiredFilled) {
            if (!!onSubmit) {
                onSubmit(postData, afterSubmit);
            } else {
                axios.post(API + "gform?" + TOKEN, {
                    entry: postData
                }).then((res) => {
                    afterSubmit(res);
                })
            }
        } else {
            setAttempts(attempts + 1);
            setSubmitStatus("");
            setMissingFields(!requiredFilled);
            setFieldError(!!error.length);
        }
    };

    return (
        <>
            <Notification type={"warning"} open={missingFields} onClose={() => setMissingFields(false)}>
                Du mangler at udfylde et eller flere påkrævede felter
            </Notification>


            <Notification type={"error"} open={!missingFields && fieldError} onClose={() => {setFieldError(false)}}>Fejl i et eller flere felter</Notification>

            {!!form &&
            <form style={style}
                  className={`${form.cssClass} ${classes}`}
                  onSubmit={e => {
                      submit();
                      e.preventDefault();
                  }}
            >

                {showTitle && <h3 className="green-marker small-size">{form.title}</h3>}
                <div className="row justify-content-between">
                    {
                        form.fields.map((field, i) => {

                            if (isMultipage && field.pageNumber !== currentPage + 1) return null;

                            if (field.type === "number" && field.cssClass === "stars") return (
                                <StarRatingInput
                                    key={field.id} field={field}
                                    onChange={choice => fieldChange(choice, field.inputName || field.id, field.type)}
                                    className={`${field.cssClass} ${sizeClass(field.size)}`}
                                    value={values[field.inputName] || values[field.id + ""]}
                                />
                            );

                            switch (field.type) {

                                case "textarea" :
                                    return (
                                        <TextArea
                                            field={field} key={field.id}
                                            onChange={value => fieldChange(value, field.inputName || field.id, field.type)}
                                            className={field.cssClass}
                                            value={values[field.inputName] || values[field.id + ""]}
                                        />
                                    );

                                case "select" :
                                    return (
                                        <FormDropdown
                                            field={field} key={field.id}
                                            onChange={choice => fieldChange(choice.value, field.inputName || field.id, field.type)}
                                            className={`${field.cssClass} ${sizeClass(field.size)}`}
                                            selected={values[field.inputName] || values[field.id + ""]}
                                        />
                                    );

                                case "checkbox" :
                                    return (
                                        <FormCheckBoxes
                                            field={field}
                                            onChange={choice => fieldChange(choice.value, choice.id, field.type)}
                                            className={`${field.cssClass} ${sizeClass(field.size)}`} key={field.id}
                                            checked={values[field.inputName]}
                                        />
                                    );

                                case "radio" :
                                    return (
                                        <FormRadioBtns
                                            field={field}
                                            onChange={choice => fieldChange(choice, field.id, field.type)}
                                            className={`${field.cssClass} ${sizeClass(field.size)}`} key={field.id}
                                            selected={values[field.inputName] || values[field.id + ""]}
                                        />
                                    );

                                case "page" :
                                    return null;

                                default :
                                    return (
                                        <TextInput
                                            field={field} key={field.id} status={status(field.id)}
                                            onChange={value => fieldChange(value, field.inputName || field.id, field.type)}
                                            className={`${field.cssClass} ${sizeClass(field.size)}`}
                                            value={values[field.inputName] || values[field.id + ""]}
                                        />
                                    );
                            }
                        })
                    }
                    {
                        getPageButtons()
                    }
                    {
                        (!isMultipage) &&
                        <div className="text-center col-12">
                            <input
                                type="submit"
                                className={checkRequired() && !error.length ? "btn btn-success" : "btn btn-secondary disabled"}
                                value={form.button.text}
                            />
                        </div>
                    }
                </div>

            </form>
            }
        </>
    );

};

export default GravityForm;

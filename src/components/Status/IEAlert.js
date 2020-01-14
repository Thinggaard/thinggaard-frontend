// File created : 24-06-2019 16:22
import React, {useState} from 'react';
import Notification from "./Notification";

const IEAlert = props => {

    const [open, setOpen] = useState(true);

    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
    function detectIE() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        // Removed this check because Microsoft Edge is not as crappy as IE
        /* var edge = ua.indexOf('Edge/');
         if (edge > 0) {
             // Edge (IE 12+) => return version number
             return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
         }*/

        // other browser
        return false;
    }


    return (
        !!detectIE() &&
        <Notification type={"warning"} viewTime={25000} mouseEvent={false} open={open} onClose={() => {setOpen(false)}}>
            <div>
                <h6>Nogle funktioner virker ikke i Internet Explorer</h6>
                <p>
                    Vi har registreret at du benytter Internet Explorer.
                    <br/>
                    Nogle af sidens funktioner fungerer desværre ikke i denne browser.
                    <br/>
                    Vi anbefaler at du bruger en anden browser (f.eks. Google Chrome).
                </p>
            </div>
        </Notification>
    );

};

export default IEAlert;

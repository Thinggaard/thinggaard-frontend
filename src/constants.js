const host = window.location.hostname;
const whichWP = 'local';

const production = {
    ROOT: 'https://youandx.com/',
    LOGO_URL: 'https://img.youandx.com/2019/05/youandx_newlogo_hori.png',

    API: 'https://wp.youandx.com/wp-json/youandx/v1/',
    WP_API: 'https://wp.youandx.com/wp-json/wp/v2/',
    JWT_API: "https://wp.youandx.com/wp-json/jwt-auth/v1/",

    WP_ROOT: 'https://wp.youandx.com',
    WP_CONTENT: 'https://wp.youandx.com/wp-content/',

    YX_TOKEN: 'youandx',
    TOKEN: 'token=youandx',

    STRIPE_PK : 'pk_live_VjOXYVNkZkIlI6YTyJYFuxwp',

    SITE_HOST : "production",
};

const local = {
    ROOT: 'http://localhost:3000/',
    LOGO_URL: 'https://img.youandx.com/2019/05/youandx_newlogo_hori.png',

    API: 'http://localhost:8000/wp-json/youandx/v1/',
    WP_API: 'http://localhost:8000/wp-json/wp/v2/',
    JWT_API: "http://localhost:8000/wp-json/jwt-auth/v1/",

    WP_ROOT: 'http://localhost:8000',
    WP_CONTENT: 'http://localhost:8000/wp-content/',

    YX_TOKEN: 'youandx',
    TOKEN: 'token=youandx',

    STRIPE_PK : 'pk_test_ImaGHS8u8lRCFY2nhNCQLcBo',

    SITE_HOST : "local",
};

const live = {
    ROOT: 'http://localhost:3000/',
    LOGO_URL: 'https://img.qa.youandx.com/2019/05/youandx_newlogo_hori.png',

    API: 'https://wp.youandx.com/wp-json/youandx/v1/',
    WP_API: 'https://wp.youandx.com/wp-json/wp/v2/',
    JWT_API: "https://wp.youandx.com/wp-json/jwt-auth/v1/",

    WP_ROOT: 'https://wp.youandx.com',
    WP_CONTENT: 'https://wp.youandx.com/wp-content/',

    YX_TOKEN: 'youandx',
    TOKEN: 'token=youandx',

    STRIPE_PK : 'pk_live_VjOXYVNkZkIlI6YTyJYFuxwp',

    SITE_HOST : "live",
};

const development = {
    ROOT: 'http://localhost:3000/',
    LOGO_URL: 'https://img.qa.youandx.com/2019/05/youandx_newlogo_hori.png',

    API: 'https://wp.qa.youandx.com/wp-json/youandx/v1/',
    WP_API: 'https://wp.qa.youandx.com/wp-json/wp/v2/',
    JWT_API: "https://wp.qa.youandx.com/wp-json/jwt-auth/v1/",

    WP_ROOT: 'https://wp.qa.youandx.com',
    WP_CONTENT: 'https://wp.qa.youandx.com/wp-content/',

    YX_TOKEN: 'youandx',
    TOKEN: 'token=youandx',

    STRIPE_PK : 'pk_test_ImaGHS8u8lRCFY2nhNCQLcBo',

    SITE_HOST : "development",
};

const qa = {
    ROOT: 'https://qa.youandx.com/',
    LOGO_URL: 'https://img.qa.youandx.com/2019/05/youandx_newlogo_hori.png',

    API: 'https://wp.qa.youandx.com/wp-json/youandx/v1/',
    WP_API: 'https://wp.qa.youandx.com/wp-json/wp/v2/',
    JWT_API: "https://wp.qa.youandx.com/wp-json/jwt-auth/v1/",

    WP_ROOT: 'https://wp.qa.youandx.com',
    WP_CONTENT: 'https://wp.qa.youandx.com/wp-content/',

    YX_TOKEN: 'youandx',
    TOKEN: 'token=youandx',

    STRIPE_PK : 'pk_test_ImaGHS8u8lRCFY2nhNCQLcBo',

    SITE_HOST : "qa",
};


function getConstant(name) {
    switch (host) {
        case "localhost" :
            switch (whichWP) {
                case "live":
                    return live[name];
                case "local":
                    return local[name];
                default:
                    return development[name];
            }
        case "qa.youandx.com" :
            return qa[name];
        default :
            return production[name];
    }
}

export const ROOT = getConstant("ROOT");
export const LOGO_URL = getConstant("LOGO_URL");

export const API = getConstant("API");
export const WP_API = getConstant("WP_API");
export const JWT_API = getConstant("JWT_API");

export const WP_ROOT = getConstant("WP_ROOT");
export const WP_CONTENT = getConstant("WP_CONTENT");

export const TOKEN = getConstant("TOKEN");
export const YX_TOKEN = getConstant("YX_CONTENT");

export const STRIPE_PK = getConstant("STRIPE_PK");

export const SITE_HOST = getConstant("SITE_HOST");

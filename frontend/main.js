import "core-js/stable";
import "regenerator-runtime/runtime";

import Login from "./modules/login";

const login = new Login('.formLogin');
const register = new Login('.formRegister');

login.init();
register.init();

// import "./assets/css/style.css";

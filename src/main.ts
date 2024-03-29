import { createApp } from "vue";
import { createPinia } from "pinia";
import "flowbite";
import ScriptX from "vue-scriptx";
import Ads from "vue-google-adsense";

import App from "./App.vue";
import router from "./router";
import "./configs/firebase";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faCaretDown,
  faCheck,
  faCheckToSlot,
  faChevronDown,
  faChevronUp,
  faCircleExclamation,
  faEye,
  faEyeSlash,
  faFilter,
  faMagnifyingGlass,
  faPlus,
  faSort,
  faSortDown,
  faSortUp,
  faSpinner,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import "./assets/main.css";

library.add(
  faArrowRightFromBracket,
  faBars,
  faCaretDown,
  faCheck,
  faCheckToSlot,
  faChevronDown,
  faChevronUp,
  faCircleExclamation,
  faEye,
  faEyeSlash,
  faFilter,
  faMagnifyingGlass,
  faPlus,
  faSort,
  faSortDown,
  faSortUp,
  faSpinner,
  faUsers,
  faXmark
);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ScriptX);
app.use(Ads.Adsense);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

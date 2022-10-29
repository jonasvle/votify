import { createApp } from "vue";
import { createPinia } from "pinia";
import "flowbite";

import App from "./App.vue";
import router from "./router";
import "./configs/firebase";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowRightFromBracket,
  faCaretDown,
  faCheckToSlot,
  faCircleExclamation,
  faFilter,
  faMagnifyingGlass,
  faSort,
  faSortDown,
  faSortUp,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import "./assets/main.css";

library.add(
  faArrowRightFromBracket,
  faCaretDown,
  faCheckToSlot,
  faCircleExclamation,
  faFilter,
  faMagnifyingGlass,
  faSort,
  faSortDown,
  faSortUp,
  faUsers,
  faXmark
);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

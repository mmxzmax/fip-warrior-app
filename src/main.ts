import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { ConfirmationService, ToastService } from "primevue";

createApp(App)
  .use(store)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .use(ToastService)
  .use(ConfirmationService)
  .mount("#app");

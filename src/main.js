import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js'; // Routers
import store from './store'; // Vuex
import apiInstance from './axios';

// Eklentiler
import VueSweetalert2 from 'vue-sweetalert2';
import DatePicker from 'vue3-datepicker';
import VueTheMask from 'vue-the-mask';


// Proje ekstraları
import { apiUrl } from './utils/api';
import func from './utils/func';
import { veriable } from './utils/veriable';

// CSS tanımlama
import '@/assets/css/tailwind.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);

app.component('DatePicker', DatePicker); // datePicker component'ini her yerde kullanmak için yaptım.
app.mixin(func);

// Bileşenler
app.use(router);
app.use(store);
app.use(VueTheMask);
app.use(VueSweetalert2);

app.config.globalProperties.$http = apiInstance;
app.config.globalProperties.$apiUrl = apiUrl;
app.config.globalProperties.$globalVeriable = veriable;

let timer;

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    router.push('/logout');
  }, 60 * 60 * 6000);
}

document.addEventListener('mousemove', resetTimer);
document.addEventListener('keypress', resetTimer);

resetTimer();

app.mount('#app');
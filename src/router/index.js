
import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../views/LoginPage.vue';
import SignDonePassword from '../views/SignDonePassword.vue';
import logoutPage from '../views/logoutPage.vue';
import NotPermission from '../views/NotPermission.vue';

//admin sayfaları
import executiveLayout from '../components/layout/executive/executiveLayout.vue';
import HomePage from '../views/executive/HomePage.vue';
import InBox from '../views/executive/InBox.vue';
import UsersList from '../views/executive/users/UsersList.vue';
import UsersDetails from '../views/executive/users/UsersDetails.vue';
import DepartmansPage from "../views/executive/DepartmansPage.vue";
import FixturesPage from "../views/executive/FixturesPage.vue";
import EventsCalendar from "../views/executive/EventsCalendar.vue";
import MultinetPage from "../views/executive/MultinetPage.vue";
import PaymentsPage from "../views/executive/PaymentsPage.vue";
import SettingsPage from "../views/executive/SettingsPage.vue";

//çalışan sayfaları
import workerLayout from '../components/layout/worker/workerLayout.vue';
import workHomePage from '../views/worker/HomePage.vue';
import profilePage from '../views/worker/profilePage.vue';
import myPayments from '../views/worker/myPayments.vue';
import myFixtures from '../views/worker/myFixtures.vue';
import myEvents from '../views/worker/myEvents.vue';
import CalendarPage from '../views/CalendarPage.vue';
import myMultinet from '../views/worker/myMultinet.vue';


import store from '../store';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/notPermission',
      name: 'notPermission',
      component: NotPermission,
    },
    {
      path: '/logout',
      name: 'logoutPage',
      component: logoutPage,
    },
    {
      path: '/sign-done',
      name: 'SignDone',
      component: SignDonePassword,
    },
    {
      path: '/forgot-password',
      name: 'FargotPassword',
      component: SignDonePassword,
    },
    {
      path: '/calendar',
      component: executiveLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'CalendarPage',
          component: CalendarPage,
        },
      ]
    },
    {
      path: '/',
      component: executiveLayout,
      name: 'executiveLayout',
      meta: { requiresAuth: true, role: 0 },
      children: [
        {
          path: '',
          name: 'HomePage',
          component: HomePage,
          exact: true,
        },
        {
          path: 'inbox',
          name: 'InBox',
          component: InBox,
          exact: true,
        },
        {
          path: 'users',
          name: 'UsersList',
          component: UsersList,
        },
        {
          path: 'users/:id',
          name: 'UsersDetails',
          component: UsersDetails,
        },
        {
          path: 'departmans',
          name: 'DepartmansPage',
          component: DepartmansPage,
        },
        {
          path: 'fixtures',
          name: 'FixturesPage',
          component: FixturesPage,
        },
        {
          path: 'events',
          name: 'EventsCalendar',
          component: EventsCalendar,
        },
        {
          path: 'multinet',
          name: 'MultinetPage',
          component: MultinetPage,
        },
        {
          path: 'payments',
          name: 'PaymentsPage',
          component: PaymentsPage,
        },
        {
          path: 'settings/:id?',
          name: 'SettingsPage',
          component: SettingsPage,
        },
      ],
    },
    {
      path: '/',
      component: workerLayout,
      name: 'workerLayout',
      meta: { requiresAuth: true, role: 1 },
      children: [
        {
          path: '',
          name: 'workHomePage',
          component: workHomePage,
        },
        {
          path: 'profile',
          name: 'profilePage',
          component: profilePage,
        },
        {
          path: 'my-payments',
          name: 'myPayments',
          component: myPayments,
        },
        {
          path: 'my-fixtures',
          name: 'myFixtures',
          component: myFixtures,
        },
        {
          path: 'my-events',
          name: 'myEvents',
          component: myEvents,
        },
        {
          path: 'my-multinet',
          name: 'myMultinet',
          component: myMultinet,
        }
      ],
    },
  ],
});


router.beforeEach(async (to, from, next) => {
  store.commit('CLEAR_NOTIFY_LIST');
  try {
    if (to.meta.requiresAuth) {
      await store.dispatch('checkLoginStatus');
      const isLogin = store.getters.isLogin;
      if (isLogin) {
        const authority = store.getters.authority;
        if (authority === 0) {
          if (to.matched.some(record => record.meta.role !== undefined && record.meta.role !== 0)) {
            next({ name: 'executiveLayout' });
          } else {
            next();
          }
        } else if (authority === 1) {
          if (to.matched.some(record => record.meta.role !== undefined && record.meta.role !== 1)) {
            next({ name: 'workerLayout' });
          } else {
            next();
          }
        } else {
          next();
        }
      } else {
        next({ name: 'logoutPage' });
      }
    } else {
      next();
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    next({ name: 'notPermission' }); // Hata durumunda yönlendirilecek sayfa
  }
});

export default router;
import Home from './assets/vue/pages/home.vue';
import AboutPage from './assets/vue/pages/about.vue';
import FormPage from './assets/vue/pages/form.vue';
import LoginPage from './assets/vue/pages/login.vue';
import DynamicRoutePage from './assets/vue/pages/dynamic-route.vue';
import BookingPage from './assets/vue/pages/booking.vue';
import EventPage from './assets/vue/pages/events.vue';

import PanelLeftPage from './assets/vue/pages/panel-left.vue';
import ColorThemes from './assets/vue/pages/color-themes.vue';
import Chat from './assets/vue/pages/chat.vue';
import Vuex from './assets/vue/pages/vuex.vue';

export default [
  {
    path: '/',
    component: Home
  },
  {
    path: '/booking/',
    component: BookingPage
  },
  {
    path: '/events/',
    component: EventPage
  },
  {
    path: '/login/',
    component: LoginPage
  },
  {
    path: '/form/',
    component: FormPage
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage
  },
  {
    path: '/color-themes/',
    component: ColorThemes
  },
  {
    path: '/chat/',
    component: Chat
  },
  {
    path: '/vuex/',
    component: Vuex
  },
]
import Home from './assets/vue/pages/home.vue';
import AboutPage from './assets/vue/pages/about.vue';
import ProfilePage from './assets/vue/pages/myprofile.vue';
import NotificationPage from './assets/vue/pages/notifications.vue';
import AccomodationPage from './assets/vue/pages/accomodation.vue';
import CanteenPage from './assets/vue/pages/canteen.vue';
import AWSPage from './assets/vue/pages/myaws.vue';
import JCPage from './assets/vue/pages/myjc.vue';
import CoursePage from './assets/vue/pages/mycourse.vue';
import PanelLeftPage from './assets/vue/pages/panel-left.vue';
import PanelRightPage from './assets/vue/pages/panel-right.vue';
import WhatWhereWhenPage from './assets/vue/pages/whatwherewhen.vue';
import FormPage from './assets/vue/pages/form.vue';
import DynamicRoutePage from './assets/vue/pages/dynamic-route.vue';
import BookingPage from './assets/vue/pages/booking.vue';
import SmartBookingPage from './assets/vue/pages/smartbook.vue';
import MyBookingPage from './assets/vue/pages/mybooking.vue';
import MyInventoryPage from './assets/vue/pages/myinventory.vue';
import EventPage from './assets/vue/pages/events.vue';
import TravelPage from './assets/vue/pages/travel.vue';
import NCBSMap from './assets/vue/pages/map.vue';
import OSM from './assets/vue/pages/osm.vue';
import TransportPage from './assets/vue/pages/transport.vue';
import ColorThemes from './assets/vue/pages/color-themes.vue';
import Chat from './assets/vue/pages/chat.vue';
import SearchPage from './assets/vue/pages/search.vue';
import Vuex from './assets/vue/pages/vuex.vue';
import InventoryPage from './assets/vue/pages/inventory.vue';
import NoticeBoards from './assets/vue/pages/noticeboards.vue';

// BMV ADMIN
import BmvBookingRequests from './assets/vue/pages/bmv_booking_requests.vue';
import BmvEvents from './assets/vue/pages/bmv_events.vue';

// ACAD ADMIN 
import AcadAdminAWSRoster from './assets/vue/pages/acad_aws_roster.vue';
import AcadAdminAWS from './assets/vue/pages/acad_aws.vue';

export default [
   {
      path: '/',
      component: Home
   },
   {
      path: '/home/',
      component: Home
   },
   {
      path: '/userpanel/',
      component: PanelLeftPage
   },
   {
      path: '/adminpanel/',
      component: PanelRightPage
   },
   {
      path: '/bmvadmin/bookingrequests/',
      component: BmvBookingRequests
   },
   {
      path: '/bmvadmin/events/',
      component: BmvEvents
   },
   {
      path: '/acadadmin/aws/',
      component: AcadAdminAWS
   },
   {
      path: '/acadadmin/awsroster/',
      component: AcadAdminAWSRoster
   },
   {
      path: '/myprofile/',
      component: ProfilePage
   },
   {
      path: '/notifications/',
      component: NotificationPage
   },
   {
      path: '/myaws/',
      component: AWSPage
   },
   {
      path: '/myjc/',
      component: JCPage
   },
   {
      path: '/mycourse/',
      component: CoursePage
   },
   {
      path: '/accomodation/',
      component: AccomodationPage
   },
   {
      path: '/canteen/',
      component: CanteenPage
   },
   {
      path: '/inventory/',
      component: InventoryPage
   },
   {
      path: '/myinventory/',
      component: MyInventoryPage
   },
   {
      path: '/whatwherewhen/',
      component: WhatWhereWhenPage
   },
   {
      path: '/booking/',
      component: BookingPage
   },
   {
      path: '/smartbook/',
      component: SmartBookingPage
   },
   {
      path: '/map/',
      component: NCBSMap
   },
   {
      path: '/osm/:arg1/:arg2/:arg3?',
      component: OSM
   },
   {
      path: '/mybooking/',
      component: MyBookingPage
   },
   {
      path: '/events/',
      component: EventPage
   },
   {
      path: '/travel/',
      component: TravelPage
   },
   {
      path: '/transport/',
      component: TransportPage
   },
   {
      path: '/form/',
      component: FormPage
   },
   {
      path: '/search/',
      component: SearchPage
   },
   {
      path: '/noticeboards/:boardName',
      component: NoticeBoards
   },
]

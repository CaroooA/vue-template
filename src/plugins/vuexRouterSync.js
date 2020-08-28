import { sync } from 'vuex-router-sync'
import store from '@/store' // vuex store instance
import router from '@/router' // vue-router instance
sync(store, router)

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
// import router from './router';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import './common/stylus/index.styl';
import './common/stylus/myicon.styl';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/', component: goods },
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];

const router = new VueRouter({
	linkActiveClass: 'active',
	// linkExactActiveClass: 'active',
	routes
});

/*
let app = Vue.extend(App);
let routers = new router();
router.map({
	'/goods': {
		component:
	}
})
router.go('/goods');
*/

new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app');

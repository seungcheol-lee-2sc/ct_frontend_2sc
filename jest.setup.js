import { config } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
Vue.use(Vuetify);

config.stubs['client-only'] = { template: '<div><slot /></div>' };
config.stubs['nuxt-link'] = { template: '<a href="#"><slot>NuxtLink</slot></a>' };
config.stubs.nuxt = { template: '<div><slot /></div>' };

// <v-app> 루트 컴포넌트 그리고 테스트 컴포넌트로 대체될 요소(<div>) 생성
const app = '<div id="app" data-app="true"><div></div></div>';
document.body.innerHTML += app;

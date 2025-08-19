import { createRouter, createWebHashHistory } from 'vue-router';

import segments from './segments';

const routes = [
  ...segments,
];

const initializeRouter = () => {
  return createRouter({
    history: createWebHashHistory(),
    routes,
    linkActiveClass: 'active',
  });
};

export { initializeRouter };

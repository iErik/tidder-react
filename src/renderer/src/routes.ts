import { createRouter, createWebHistory } from 'vue-router'

import Feedpage from '@containers/Feedpage'

const routes = [
  {
    path: '/',
    component: Feedpage
  }
]

export default createRouter({ routes, history: createWebHistory() })
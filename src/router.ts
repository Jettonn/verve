import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./views/Home.vue') },
  {
    path: '/components/:slug',
    name: 'component',
    component: () => import('./views/ComponentDetail.vue')
  },
  // Unknown paths fall back to the gallery.
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

// Jump to hash targets (the home #install / #components anchors) with header offset.
export const scrollBehavior: RouterScrollBehavior = (to, _from, saved) => {
  if (to.hash) return { el: to.hash, top: 80, behavior: 'smooth' }
  if (saved) return saved
  return { top: 0 }
}

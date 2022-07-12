export default [
  {
    path: '*',
    component: () =>
      import(
        /* webpackChunkName: "notfound" */ '@/components/screen/NotFound.vue'
      )
  }
]

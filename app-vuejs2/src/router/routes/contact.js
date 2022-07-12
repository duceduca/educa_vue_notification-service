export default [
  {
    path: '/contact',
    name: 'contact',
    component: () =>
      import(
        /* webpackChunkName: "contact" */ '@/components/screen/Contact.vue'
      )
  }
]

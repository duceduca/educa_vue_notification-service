export default [
  {
    path: '/admin/cities',
    name: 'admin-cities',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-cities" */ '@/components/screen/example/AdminCities.vue'
      )
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-users" */ '@/components/screen/example/AdminUsers.vue'
      )
  }
]

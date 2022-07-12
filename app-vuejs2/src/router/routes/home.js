export default [
  {
    path: '/home',
    name: 'home',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "home" */ '@/components/screen/student/Quizzes.vue'
      )
  },
  {
    path: '/zalo-template',
    name: 'zalo-template',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "home" */ '@/components/screen/student/Zalo-Template.vue'
      )
  }
]

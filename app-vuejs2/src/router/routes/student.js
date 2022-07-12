export default [
  {
    path: '/student/quizzes',
    name: 'student-quizzes',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "student-course" */ '@/components/screen/student/Quizzes.vue'
      )
  },
  {
    path: '/student/quiz/:id',
    name: 'student-quiz',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "student-quizzes" */ '@/components/screen/student/Quiz.vue'
      )
  },
  {
    path: '/student/attempt/:id',
    name: 'student-attempt',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "student-quizzes" */ '@/components/screen/student/Attempt.vue'
      )
  },
  {
    path: '/student/attempt-result/:id',
    name: 'student-attempt-result',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "student-quizzes" */ '@/components/screen/student/AttemptResult.vue'
      )
  }
]

export default [
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/components/screen/Login.vue')
  },
  {
    path: '/login-class-code',
    name: 'login-class-code',
    component: () =>
      import(
        /* webpackChunkName: "loginClassCode" */ '@/components/screen/LoginClassCode.vue'
      )
  },
  {
    path: '/login-auto',
    name: 'loginToken',
    component: () =>
      import(
        /* webpackChunkName: "loginToken" */ '@/components/screen/LoginToken.vue'
      )
  },
  {
    path: '/signup',
    name: 'signup',
    component: () =>
      import(/* webpackChunkName: "signup" */ '@/components/screen/SignUp.vue')
  },
  {
    path: '/verify/:id',
    name: 'verify',
    component: () =>
      import(
        /* webpackChunkName: "verify" */ '@/components/screen/example/Verify.vue'
      )
  },
  {
    path: '/forgot',
    name: 'forgotPassword',
    component: () =>
      import(
        /* webpackChunkName: "forgotPassword" */ '@/components/screen/example/ForgotPassword.vue'
      )
  },
  {
    path: '/reset/:id',
    name: 'resetPassword',
    component: () =>
      import(
        /* webpackChunkName: "resetPassword" */ '@/components/screen/example/ResetPassword.vue'
      )
  },
  {
    path: '/login-zalo',
    name: 'login-zalo',
    component: () =>
      import(
        /* webpackChunkName: "loginClassCode" */ '@/components/screen/LoginZalo.vue'
      )
  }
]

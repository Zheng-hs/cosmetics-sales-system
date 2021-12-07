import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import UserInfo from '../components/users/UserInfo.vue'
import Menu from '../components/menu/Menu.vue'
import Image from '../components/imagemanage/Image.vue'
import productClassify from '../components/goods/productClassify.vue'
import Params from '../components/goods/Params.vue'
import Addgoods from '../components/goods/Addgoods.vue'
import Goods from '../components/goods/Goods.vue'
import Order from '../components/order/Order.vue'
import ArticlesClassify from '../components/articles/ArticlesClassify.vue'
import Invoice from '../components/articles/Invoice.vue'
import Add from '../components/articles/Add.vue'
import Edit from '../components/articles/Edit.vue'
import ProductComment from '../components/articles/ProductComment.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: './welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user',
        component: Users
      },
      {
        path: '/userinfo',
        component: UserInfo
      },
      {
        path: '/menu',
        component: Menu
      },
      {
        path: '/image',
        component: Image
      },
      {
        path: '/productClassify',
        component: productClassify
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/orderList',
        component: Order
      },
      {
        path: '/articlesClassify',
        component: ArticlesClassify
      },
      {
        path: '/invoice',
        component: Invoice
      },
      {
        path: '/add',
        component: Add
      },
      {
        path: '/edit',
        component: Edit
      },
      {
        path: '/productComment',
        component: ProductComment
      },
      {
        path: '/addgoods',
        component: Addgoods
      },
      {
        path: '/goods',
        component: Goods
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

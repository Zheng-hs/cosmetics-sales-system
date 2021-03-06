import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Menu from '../components/menu/Menu.vue'
import Image from '../components/imagemanage/Image.vue'
import productClassify from '../components/goods/productClassify.vue'
import Params from '../components/goods/Params.vue'
import Addgoods from '../components/goods/Addgoods.vue'
import Editgoods from '../components/goods/Editgoods.vue'
import Goods from '../components/goods/Goods.vue'
import Order from '../components/order/Order.vue'
import ArticlesClassify from '../components/articles/ArticlesClassify.vue'
import Invoice from '../components/articles/Invoice.vue'
import Add from '../components/articles/Add.vue'
import Edit from '../components/articles/Edit.vue'
import ProductComment from '../components/articles/ProductComment.vue'
import Coupons from '../components/active/Coupons.vue'
import Record from '../components/active/Record.vue'
import GoodsActivity from '../components/activity/GoodsActivity.vue'
import ActivityTryUser from '../components/activity/ActivityTryUser.vue'
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
      {
        path: '/editgoods',
        component: Editgoods
      },
      {
        path: '/coupons',
        component: Coupons
      },
      {
        path: '/couponsUserReceive',
        component: Record
      },
      {
        path: '/goodsActivity',
        component: GoodsActivity
      },
      {
        path: '/activityTryUser',
        component: ActivityTryUser
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

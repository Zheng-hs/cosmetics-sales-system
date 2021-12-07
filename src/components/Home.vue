<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- 侧边栏菜单区域 -->
      <el-menu
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409EFF"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        :default-active="activePath"
      >
        <!-- 一级菜单 -->
        <el-menu-item index="/welcome">
          <i class="el-icon-monitor"></i>
          <span>首页</span>
        </el-menu-item>
        <el-submenu
          :index="item.menuId + ''"
          v-for="item in menuList"
          :key="item.menuId"
        >
          <!-- 一级菜单模板区 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="item.icon"></i>
            <!-- 文本 -->
            <span>{{ item.menuName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="subItem.menuPath"
            v-for="subItem in item.children"
            :key="subItem.menuId"
            @click="saveNavState(subItem.menuPath)"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="subItem.icon"></i>
              <!-- 文本 -->
              <span>{{ subItem.menuName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <!-- <el-button type="info" @click="logout">退出</el-button> -->
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-s-fold"></i>
          <span>化妆品销售管理系统</span>
        </div>
        <el-dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-switch-button"
              @click.native="logout"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
          <el-avatar>
            <img :src="path" alt="" />
          </el-avatar>
          <span class="el-dropdown-link"> 你好，{{ username }} </span>
        </el-dropdown>
      </el-header>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
      path: "",
      username: ""
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    this.getUserInfo();
    this.getMenu();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    getUserInfo() {
      // const { data: res } = await this.$http.post('/api1/listUser', {
      //   userId: JSON.parse(sessionStorage.getItem('userInfo')).userId

      this.username = JSON.parse(sessionStorage.getItem("userInfo")).username;
      this.path = JSON.parse(sessionStorage.getItem("userInfo")).imgPath;
    },
    async getMenu() {
      const { data: res } = await this.$http.post("/api/v1/menu/search", {
        menuStatus: "0"
      });
      this.menuList = res.data;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #08aaf5;
  display: flex;
  justify-content: space-between;
  // padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .el-dropdown {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 150px;
  }
}

.el-aside {
  background-color: #333744;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    color: #fff;
    background-color: rgb(54, 127, 169);
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    // span {
    //     margin-left: 15px;
    // }
  }
  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
.el-dropdown-link {
  color: #fff;
}
.toggle-button {
  color: #fff;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  font-weight: bold;
}
</style>

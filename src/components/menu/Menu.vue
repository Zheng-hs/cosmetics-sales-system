<template>
  <div class="containers">
    <el-container>
      <el-header>
        <div class="btn">
          <el-button type="primary" @click="addClick">新增</el-button>
          <el-button type="primary" @click="btnChange">修改</el-button>
          <el-button type="primary" @click="delect">删除</el-button>
          <el-button type="primary" @click="search">刷新</el-button>
        </div>
        <el-dialog
          v-model="dialogVisible"
          width="35%"
          title="新增菜单"
          :visible.sync="innerVisible"
          height="200px"
          @dialog-before-close="dialogBeforeClose"
        >
          <div>
            <el-form
              :model="dialogFormData"
              ref="form"
              :rules="formRules"
              label-width="100px"
            >
              <el-form-item label="是否子菜单" prop="isLeaf">
                <el-switch
                  v-model="isLeaf"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeLeaf"
                >
                </el-switch>
              </el-form-item>
              <el-form-item
                label="父菜单"
                prop="menuParentId"
                v-show="isShow"
              >
                <el-select
                  v-model="dialogFormData.menuParentId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in fatherList"
                    :key="item.menuId"
                    :label="item.menuName"
                    :value="item.menuId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="菜单id" prop="menuId">
                <el-input v-model="dialogFormData.menuId"></el-input>
              </el-form-item>
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="dialogFormData.menuName"></el-input>
              </el-form-item>
              <el-form-item label="菜单路由" prop="menuPath">
                <el-input v-model="dialogFormData.menuPath"></el-input>
              </el-form-item>
              <el-form-item label="菜单排序" prop="menuOrder">
                <el-input v-model="dialogFormData.menuOrder"></el-input>
              </el-form-item>
              <el-form-item label="菜单状态" prop="menuStatus">
                <el-select
                  v-model="dialogFormData.menuStatus"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="dialogFormData.icon"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dialogFormData.remark"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCancel">取 消</el-button>
            <el-button type="primary" @click="dialogConfirm">确 定</el-button>
          </span>
        </el-dialog>
        <div class="menuDetails"><span>菜单详情</span></div>
      </el-header>
      <el-container>
        <el-aside width="303px">
          <div class="elMenu">
            <!-- <el-menu @select="handlerSelect">
                            <el-menu-item v-for="(item,index) in menuList" :index="item.path" :key="index">
                                <span slot="title">{{item.menuName}}</span>
                                <span>{{index}}</span>
                                
                            </el-menu-item>
                        </el-menu> -->
            <el-tree
              :data="menuList"
              :props="defaultProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </el-aside>
        <el-main>
          <el-form :inline="true" label-width="100px">
            <el-col :span="12">
              <el-form-item label="菜单id" prop="menuId">
                <el-input v-model="formData.menuId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="formData.menuName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单路由" prop="menuPath">
                <el-input v-model="formData.menuPath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="formData.icon"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单状态" prop="menuStatus">
                <el-select
                  v-model="formData.menuStatus"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单序号" prop="menuOrder">
                <el-input v-model="formData.menuOrder"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {},
      isShow: false,
      isLeaf: false,
      fatherList: [],
      dialogVisible: false,
      innerVisible: false,
      dialogFormData: {
        component: 0,
        menuParentId: "",
        isLeaf: "0"
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      menuList: [],
      leafList: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      statusList: [
        { label: "启用", value: "0" },
        { label: "禁用", value: "1" }
      ],
      defaultProps: {
        label: "menuName"
      },
      formRules: {
        menuName: [
          { required: true, message: "请填写菜单名称", trigger: "change" }
        ],
        menuPath: [
          { required: true, message: "请填写菜单路由", trigger: "change" }
        ],
        menuId: [
          { required: true, message: "请填写菜单id", trigger: "change" }
        ],
        menuOrder: [
          { required: true, message: "请填写菜单序号", trigger: "change" }
        ],
        menuStatus: [
          { required: true, message: "请选择是否启用", trigger: "change" }
        ],
        icon: [
          { required: true, message: "请填写菜单图标", trigger: "change" }
        ],
        remark: [{ required: true, message: "请填写备注", trigger: "change" }]
      }
    };
  },
  created() {
    this.search();
  },

  methods: {
    changeLeaf() {
        this.isShow = !this.isShow;
      if(this.isShow == true) {
          this.dialogFormData.isLeaf = 1
          this.dialogFormData.menuParentId = ''
      } else {
          this.dialogFormData.isLeaf = 0
          this.dialogFormData.menuParentId = 0
      }
    //   console.log(this.dialogFormData.isLeaf);
    },
    async search() {
      const { data: res } = await this.$http.post("/api/v1/menu/search",{});
      if (res.code !== 200) {
        return this.$message.error("获取列表失败！");
      }
      this.menuList = res.data;
    },
    async addClick() {
      const { data: res } = await this.$http.get("/api/v1/menu/getParentMenu");
      this.fatherList = res.data
      console.log(this.fatherList);
      this.innerVisible = true;
    },
    async btnChange() {
        const {data: res} = await this.$http.put('/api/v1/menu/updateMenu',this.formData)
        if(res.code==200) {
            this.$message.success('修改菜单成功！')
        } else {
            this.$message.error('修改菜单失败！')
        }
    },
    dialogBeforeClose() {
      this.dialogVisible = false;
      this.innerVisible = false;
    },
    dialogCancel() {
      // this.$emit('dialog-cancels')
      this.innerVisible = false;
      this.$refs.form.resetFields();
    },
    dialogConfirm() {
      this.$refs.form.validate(async vaid => {
        if (vaid) {
          const { data: res } = await this.$http.post(
            "/api/v1/menu/addMenu",
            this.dialogFormData
          );
          if (res.code == 200) {
            this.$message.success("新增菜单成功！");
          } else {
            this.$message.error("新增菜单失败!");
          }
          this.innerVisible = false;
          this.dialogFormData = {};
        } else {
          return false;
        }
      });
    },
    delect() {
        var menuId = this.formData.menuId
      this.$confirm("此操作将永久删除该菜单,是否继续?").then(async () => {
        const {data: res} = await this.$http.delete(`/api/v1/menu/deleteMenu/${menuId}`)
        if(res.code == 200) {
            this.$message.success('删除菜单成功！')
        } else {
            this.$message.error('删除菜单失败！')
        }
      }).catch(err => err);
    },
    handlerSelect() {},
    handleNodeClick(data) {
     this.formData = data
    }
  }
};
</script>
<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #ddd;
  padding: 0;
  .btn {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 300px;
    height: 60px;
    border: 1px solid #ddd;
  }
  .menuDetails {
    height: 60px;
    flex: 1;
    span {
      text-align: center;
      line-height: 60px;
      font-size: 18px;
      padding: 10px 30px;
      box-sizing: border-box;
    }
  }
}
.el-container {
  .el-aside {
    border: 1px solid #ddd;
  }
  .el-main {
    border: 1px solid #ddd;
  }
}
.elMenu {
  height: 400px;
  .el-tree-node__label {
    padding-left: 20px;
  }
}
</style>

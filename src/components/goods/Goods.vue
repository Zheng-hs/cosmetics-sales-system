<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4" >
          <el-select v-model="select" clearable placeholder="请选择查询类别" @change="clearInput">
            <el-option v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList1"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="add"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="分类名称" prop="classifyName"></el-table-column>
        <el-table-column label="商品描述" prop="goodsDescribe"></el-table-column>
        <el-table-column label="商品现价" prop="goodsNewPrice"></el-table-column>
        <el-table-column label="商品原价" prop="goodsOldPrice"></el-table-column>
        <el-table-column label="限购量" prop="maxQuantity"></el-table-column>
        <el-table-column label="商品库存" prop="goodsStock"></el-table-column>
        <el-table-column label="商品图片" prop="mainImage">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.mainImage"
              :preview-src-list="[scope.row.mainImage]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
         <el-table-column label="状态">
          <template slot-scope="scope">
            <div
              v-if="scope.row.isDelete == 0"
              @click="changStatus(scope.row.goodsId)"
            >
              <el-result icon="success" title="已上架"></el-result>
            </div>
            <div v-else @click="changIsDelete(scope.row.goodsId)">
              <el-result icon="error" title="已下架"></el-result>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.goodsId )"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        currPage: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      uploadURL: 'http://1.15.186.9:8006/api/v1/upload',
      imageUrl: '',
      userList: [],
      total: 0,
      isShow: true,
      // 控制用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {},
      roleOptions: [
        { label: '管理员', value: '0' },
        { label: '用户', value: '1' }
      ],
      sexList: [
        { label: '女', value: '1' },
        { label: '男', value: '0' }
      ],
      selectList: [
        { label: '商品名称', value: 'goodsName' },
        { label: '分类名称', value: 'classifyName' }
      ],
      select: '',
      addFormRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        usernameCn: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        roleType: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        userId: [{ required: true, message: '请输入id', trigger: 'blur' }],
        usernameCn: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        roleType: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      userInfo: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.post(
        `/api/v1/goods/search?pageNo=${this.queryInfo.currPage}&pageSize=${this.queryInfo.pageSize}`,
        {}
      )
      if (res.code !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.userList = res.data.data
      this.total = res.data.total
    },
    async getUserList1 () {
      let param = {}
      param[this.select] = this.queryInfo.query
      const { data: res } = await this.$http.post(
        `/api/v1/goods/search?currPage=${this.queryInfo.currPage}&pageSize=${this.queryInfo.pageSize}`,
        param
      )
      if (res.code == 200) {
        this.userList = res.data.data
      this.total = res.data.total
        return this.$message.success('查询商品成功!')
      } else {
        this.$message.error('查询商品失败!')
      }
      
    },
    async changStatus(id) {
      const { data: res } = await this.$http.post("/api/v1/goods/update", {
        goodsId: id,
        isDelete: 1
      });
      if (res.code !== 200) {
        return this.$message.error("下架失败!");
      }
      this.$message.success("下架成功！");
      this.getUserList();
    },
     async changIsDelete(id) {
      const { data: res } = await this.$http.post("/api/v1/goods/update", {
        goodsId: id,
        isDelete: 0
      });
      if (res.code !== 200) {
        return this.$message.error("上架失败!");
      }
      this.$message.success("上架成功！");
      this.getUserList();
    },
    clearInput() {
      this.queryInfo.query = ''
      this.getUserList()
    },
    changeIsShow () {
      this.isShow = !this.isShow
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.currPage = newPage
      this.getUserList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.imageUrl = ''
    },
    // 点击按钮，添加新用户
    add () {
        this.$router.push('/addgoods')
    },
    showEditDialog (row) {
     this.$router.push({ path: '/editgoods', query: row })
    },
    async removeUserById (goodsId ) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回字符串confirm
      // 如果用户取消删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/api/v1/goods/delete', {data: [goodsId]})
      if (res.code !== 200) {
        return this.$message.error('删除商品失败!')
      }
      this.$message.success('删除商品成功')
      this.getUserList()
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
.avatars {
  width: 200px;
  height: 200px;
  display: block;
  position: absolute;
}
.el-result {
    padding: 0;
}
</style>

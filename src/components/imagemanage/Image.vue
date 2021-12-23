<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页轮播图管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getImgList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getImgList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加轮播图</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="imgList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="id" prop="imgId"></el-table-column>
        <el-table-column label="图片" prop="imgPath">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 60px"
              :src="scope.row.imgPath"
              :preview-src-list="[scope.row.imgPath]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="加入时间" prop="createTime">
          <template slot-scope="scope">
            {{ scope.row.createTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUser"></el-table-column>
        <el-table-column label="序号" prop="sort"></el-table-column>
        <el-table-column label="路由" prop="routing"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.imgId)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.imgId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加轮播图"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="routing">
          <el-input v-model="addForm.routing"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改轮播图"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-show="isShow"
            :src="editForm.imgPath"
            class="avatars"
            @click="changeIsShow"
          />
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="routing">
          <el-input v-model="editForm.routing"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pageNo: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      uploadURL: "http://1.15.186.9:8006/api/v1/upload",
      imageUrl: "",
      imgList: [],
      total: 0,
      isShow: true,
      // 控制用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {},
      addFormRules: {
        sort: [
          { required: true, message: "请输入序号", trigger: "blur" }
        ],
        routing: [{ required: true, message: "请输入路由", trigger: "blur" }],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        sort: [
          { required: true, message: "请输入序号", trigger: "blur" }
        ],
        routing: [
          { required: true, message: "请输入路由", trigger: "blur" }
        ]
      },
      userInfo: ""
    };
  },
  created() {
    this.getImgList();
  },
  methods: {
    async getImgList() {
      const { data: res } = await this.$http.post(
        `/api/v1/homePageImg/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );
      if (res.code !== 200) {
        return this.$message.error("获取轮播图列表失败!");
      }
      this.imgList = res.data.data;
      this.total = res.data.total;
    },
    changeIsShow() {
      this.isShow = !this.isShow;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getImgList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getImgList();
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.imageUrl = "";
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("/api/v1/homePageImg/add", {
          imgPath: this.userPicture,
          sort: this.addForm.sort,
          routing: this.addForm.routing
        });

        if (res.code !== 200) {
          this.$message.error("添加图片失败!");
        } else {
          this.$message.success("添加图片成功");
        }

        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        this.imageUrl = "";
        // 重新获取用户列表数据
        this.getImgList();
      });
    },
    async showEditDialog(imgId) {
      // console.log(userCode);
      const { data: res } = await this.$http.post(
        "/api/v1/homePageImg/search",
        {
          imgId: imgId
        }
      );

      if (res.code !== 200) {
        return this.$message.error("查询用户信息失败!");
      }
      this.editForm = res.data.data[0];
      // console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.isShow = true;
      this.imageUrl = "";
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post(
          "/api/v1/homePageImg/update",
          {
            imgId: this.editForm.imgId,
            sort: this.editForm.sort,
            imgPath: this.userPicture,
            routing: this.editForm.routing
          }
        );

        if (res.code !== 200) {
          this.$message.error("修改失败!");
        } else {
          this.$message.success("修改成功");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getImgList();
      });
    },
    async removeUserById(imgId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果用户确认删除，则返回字符串confirm
      // 如果用户取消删除，则返回字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete('/api/v1/homePageImg/delete',{ data:[imgId]});
      if (res.code !== 200) {
        this.$message.error("删除图片失败!");
      } else {
          this.$message.success("删除图片成功");
      }
      
      this.getImgList();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path;
    }
  }
};
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
</style>

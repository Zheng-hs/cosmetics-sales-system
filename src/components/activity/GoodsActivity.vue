<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>精选活动</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀活动</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="selectObj" placeholder="请选择....">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="addForm.activityType"
            placeholder="请选择..."
            @change="getImgList1"
            v-if="selectObj === 'activityType'"
          >
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="addForm.goodsId"
            placeholder="请选择"
            @change="getImgList2"
            v-else
          >
            <el-option
              v-for="item in goodsList"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-button type="primary" @click="addDialogVisible = true"
          >新增活动</el-button
        >
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="imgList"
        border
        stripe
        :row-key="getRowKeys"
        ref="topicTable"
      >
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="分类id" prop="articlesClassifyId"></el-table-column> -->
        <el-table-column label="类型" prop="activityType">
          <template slot-scope="scope">
            {{ scope.row.activityType === "0" ? "秒杀活动" : "试用活动" }}
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="goodsName"> </el-table-column>
        <el-table-column label="商品图片" prop="goodsImage">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.goodsImage"
              :preview-src-list="[scope.row.goodsImage]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品价格" prop="goodsPrice"> </el-table-column>
        <el-table-column label="商品数量" prop="goodsQuantity">
        </el-table-column>
        <el-table-column label="每人限购数量" prop="limitQuantity">
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime"> </el-table-column>
        <el-table-column label="结束时间" prop="endTime"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime"> </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 新增按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.activityId)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.activityId)"
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
      title="新增活动"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="活动类型" prop="activityType">
          <el-row :gutter="0">
            <el-col :span="24">
              <el-select
                v-model="addForm.activityType"
                placeholder="请选择活动类型"
              >
                <el-option
                  v-for="item in list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="秒杀价格"
          prop="goodsPrice"
          v-if="addForm.activityType === '0'"
        >
          <el-input v-model="addForm.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="库存量" prop="goodsQuantity">
          <el-input v-model="addForm.goodsQuantity"></el-input>
        </el-form-item>
        <el-form-item label="每人限购数量" prop="limitQuantity">
          <el-input v-model="addForm.limitQuantity"></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间" prop="startTime">
          <el-date-picker
            v-model="addForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" prop="endTime">
          <el-date-picker
            v-model="addForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品信息" prop="goodsId">
          <el-select v-model="addForm.goodsId" placeholder="请选择">
            <el-option
              v-for="item in goodsList"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改活动" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="活动类型" prop="activityType">
          <el-select
            v-model="editForm.activityType"
            placeholder="请选择活动类型"
          >
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="活动价格"
          prop="goodsPrice"
          v-if="editForm.activityType === '0'"
        >
          <el-input v-model="editForm.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="活动数量" prop="goodsQuantity">
          <el-input v-model="editForm.goodsQuantity"></el-input>
        </el-form-item>
        <el-form-item label="限购数量" prop="limitQuantity">
          <el-input v-model="editForm.limitQuantity"></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间" prop="startTime">
          <el-date-picker
            v-model="editForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" prop="endTime">
          <el-date-picker
            v-model="editForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editActivityInfo">确 定</el-button>
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
        pageSize: 5,
      },
      imgList: [],
      total: 0,
      isShow: false,
      showRate: false,
      // 控制用户对话框的显示与隐藏
      userInfo: "",
      selectList: [
        { label: "活动类型", value: "activityType" },
        { label: "商品名称", value: "goodsId" },
      ],
      list: [
        { label: "秒杀活动", value: "0" },
        { label: "试用活动", value: "1" },
      ],
      select: "",
      selectObj: "",
      commentId: "",
      message: "",
      commentUser: "",
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {},
      goodsImage: "",
      editForm: {},
      addFormRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        usernameCn: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
      },
      editFormRules: {
        userId: [{ required: true, message: "请输入id", trigger: "blur" }],
        usernameCn: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        roleType: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
      },
      goodsList: [],
      articleList: [],
      newList: [],
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      goodsLevel: 0,
    };
  },
  created() {
    this.getImgList();
    this.getGoods();
    this.getArticle();
  },
  methods: {
    async getGoods() {
      const { data: res } = await this.$http.post("/api/v1/goods/search", {});
      this.goodsList = res.data.data;
      // console.log(this.goodsList);
    },
    async getArticle() {
      const { data: res } = await this.$http.post(
        "/api/v1/activity/search",
        {}
      );
      this.articleList = res.data.data;
      // console.log(this.articleList);
    },
    async getImgList() {
      const { data: res } = await this.$http.post(
        `/api/v1/activity/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );
      if (res.code !== 200) {
        return this.$message.error("获取活动失败!");
      }
      this.imgList = res.data.data;
      // console.log(this.imgList);
      this.total = res.data.total;
    },
    async getImgList1(uid) {
      const { data: res } = await this.$http.post(
        `/api/v1/activity/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        { activityType: uid }
      );
      if (res.code !== 200) {
        return this.$message.error("获取活动失败!");
      }
      this.imgList = res.data.data;
      // console.log(this.imgList);
      this.total = res.data.total;
    },
    async getImgList2(uid) {
      const { data: res } = await this.$http.post(
        `/api/v1/activity/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        { goodsId: uid }
      );
      if (res.code !== 200) {
        return this.$message.error("获取活动失败!");
      }
      this.imgList = res.data.data;
      // console.log(this.imgList);
      this.total = res.data.total;
    },
    async add() {
      const { data: res } = await this.$http.post(
        "/api/v1/activity/addActivity",
        this.addForm
      );
      if (res.code == 200) {
        this.$message.success("新增活动成功！");
        this.addDialogVisible = false;
        this.getImgList();
      } else {
        this.$message.error("新增活动失败！");
      }
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
    },
    async changStatus(id) {
      console.log(1111);
      const { data: res } = await this.$http.post("/api/v1/articles/update", {
        articlesId: id,
        isDelete: 1,
      });
      if (res.code !== 200) {
        return this.$message.error("禁用失败!");
      }
      this.$message.success("禁用成功！");
      this.getImgList();
    },
    async changIsDelete(id) {
      const { data: res } = await this.$http.post("/api/v1/articles/update", {
        articlesId: id,
        isDelete: 0,
      });
      if (res.code !== 200) {
        return this.$message.error("启用失败!");
      }
      this.$message.success("启用成功！");
      this.getImgList();
    },
    showExpand(row) {
      this.isShow = true;
      this.commentId = row.commentId;
      this.commentUser = row.commentUser;
      this.$refs.topicTable.toggleRowExpansion(row, true);
    },
    getRowKeys(row) {
      return row.commentId;
    },
    async showEditDialog(activityId) {
      // console.log(userCode);
      const { data: res } = await this.$http.post("/api/v1/activity/search", {
        activityId: activityId,
      });

      if (res.code !== 200) {
        return this.$message.error("查询活动信息失败!");
      }
      Object.assign(this.editForm, res.data.data[0]);
      this.editForm.activityType = res.data.data[0].activityType;
      console.log(this.editForm);
      this.goodsImage = this.editForm.goodsImage;
      this.editDialogVisible = true;
    },
    editActivityInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post(
          "/api/v1/activity/updateActivity",
          this.editForm
        );
        if(res.code == 200) {

          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getImgList();
          this.$message.success("修改活动信息成功");
        } else {
          this.$message.error('修改失败')
        }
      });
    },
  },
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
.el-result {
  padding: 0;
}
.reply {
  display: flex;
  align-items: center;
  span {
    margin: 0 10px;
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 3px;
  }
  .headimg {
    display: flex;
    align-items: center;
  }
}
.el-rate {
  line-height: 2;
  margin-top: 4px;
}
</style>

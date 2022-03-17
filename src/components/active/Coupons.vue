<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
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
              @click="getImgList1"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="show">添加优惠券</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="imgList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="名称" prop="couponName"></el-table-column>
        <el-table-column label="面值" prop="couponValue"></el-table-column>
        <el-table-column label="类型" prop="couponType"></el-table-column>
        <el-table-column
          label="最高领取数量"
          prop="collectionLimit"
        ></el-table-column>
        <el-table-column
          label="已领取数量"
          prop="collectionAmount"
        ></el-table-column>
        <el-table-column label="开始时间" prop="collectionStartTime" width="150px">
          <template slot-scope="scope">
            {{ scope.row.collectionStartTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="collectionEndTime" width="150px">
          <template slot-scope="scope">
            {{ scope.row.collectionEndTime | dataFormat }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建人" prop="createUser"></el-table-column> -->
        <el-table-column label="可使用天数" prop="useTime"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div
              v-if="scope.row.isDelete == 0"
              @click="changStatus(scope.row.couponId)"
            >
              <el-result icon="success" title="已上架"></el-result>
            </div>
            <div v-else @click="changIsDelete(scope.row.couponId)">
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
              @click="showEditDialog(scope.row.couponId)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.couponId)"
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
      title="新增优惠券"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="150px"
      >
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="addForm.couponName"></el-input>
        </el-form-item>
        <el-form-item label="领取数量限制" prop="collectionLimit">
          <el-input v-model="addForm.collectionLimit"></el-input>
        </el-form-item>
        
        <el-form-item label="最低消费金额" prop="useLimitValue">
          <el-input v-model="addForm.useLimitValue"></el-input>
        </el-form-item>
        <el-form-item label="面值" prop="couponValue">
          <el-input v-model="addForm.couponValue"></el-input>
        </el-form-item>
        <el-form-item label="可使用天数" prop="useTime">
          <el-input v-model="addForm.useTime"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="couponType">
          <el-select v-model="addForm.couponType" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取起始时间">
          <el-date-picker
            v-model="value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="领取开始时间"
            end-placeholder="领取结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="可用商品" prop="goodsIdList" v-if="addForm.couponType==='商家券'">
          <el-select v-model="goodsIdList" multiple placeholder="请选择">
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
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改优惠券"
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
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="editForm.couponName"></el-input>
        </el-form-item>
        <el-form-item label="领取数量限制" prop="collectionLimit">
          <el-input v-model="editForm.collectionLimit"></el-input>
        </el-form-item>
        <el-form-item label="已领取数量" prop="collectionAmount">
          <el-input v-model="editForm.collectionAmount"></el-input>
        </el-form-item>
        <el-form-item label="最低消费金额" prop="useLimitValue">
          <el-input v-model="editForm.useLimitValue"></el-input>
        </el-form-item>
        <el-form-item label="面值" prop="couponValue">
          <el-input v-model="editForm.couponValue"></el-input>
        </el-form-item>
        <el-form-item label="可使用天数" prop="useTime">
          <el-input v-model="editForm.useTime"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="couponType">
          <el-select v-model="editForm.couponType" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取起始时间" prop="value">
          <el-date-picker
            v-model="value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="领取开始时间"
            end-placeholder="领取结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="可用商品" prop="goodsIdList">
          <el-select v-model="goodsIdList" multiple placeholder="请选择">
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
        pageSize: 5,
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
        sort: [{ required: true, message: "请输入序号", trigger: "blur" }],
        routing: [{ required: true, message: "请输入路由", trigger: "blur" }],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        sort: [{ required: true, message: "请输入序号", trigger: "blur" }],
        routing: [{ required: true, message: "请输入路由", trigger: "blur" }],
      },
      userInfo: "",
      goodsList: [],
      goodsIdList: [],
      value: [],
      typeList: [
        { label: "通用券", value: "通用券" },
        { label: "商家券", value: "商家券" },
      ],
      couponId: "",
    };
  },
  created() {
    this.getImgList();
  },
  methods: {
    async getImgList() {
      const { data: res } = await this.$http.post(
        `/api/v1/coupon/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );
      if (res.code !== 200) {
        return this.$message.error("获取优惠券列表失败!");
      }
      this.imgList = res.data.data;
      this.total = res.data.total;
    },
    async getImgList1() {
      const { data: res } = await this.$http.post(
        `/api/v1/coupon/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {couponName: this.queryInfo.query}
      );
      if (res.code !== 200) {
        return this.$message.error("获取优惠券列表失败!");
      }
      this.imgList = res.data.data;
      this.total = res.data.total;
    },
    changeIsShow() {
      this.isShow = !this.isShow;
    },
    async show() {
      const { data: res } = await this.$http.post("/api/v1/goods/search", {});
      if (res.code !== 200) {
        return this.$message.error("获取商品列表失败!");
      }
      this.goodsList = res.data.data;
      this.addDialogVisible = true;
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
      this.goodsIdList = [];
      this.value = [];
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("/api/v1/coupon/add", {
          couponName: this.addForm.couponName,
          collectionLimit: this.addForm.collectionLimit,
          collectionAmount: this.addForm.collectionAmount,
          useLimitValue: this.addForm.useLimitValue,
          couponValue: this.addForm.couponValue,
          useTime: this.addForm.useTime,
          couponType: this.addForm.couponType,
          goodsIdList: this.goodsIdList,
          collectionStartTime: this.value[0],
          collectionEndTime: this.value[1],
        });

        if (res.code !== 200) {
          this.$message.error("添加优惠券失败!");
        } else {
          this.$message.success("添加优惠券成功");
        }

        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        this.goodsIdList = [];
        this.value = [];
        // 重新获取用户列表数据
        this.getImgList();
      });
    },
    async changStatus(id) {
      const { data: res } = await this.$http.post("/api/v1/coupon/update", {
        couponId: id,
        isDelete: 1,
      });
      if (res.code !== 200) {
        return this.$message.error("下架失败!");
      }
      this.$message.success("下架成功！");
      this.getImgList();
    },
    async changIsDelete(id) {
      const { data: res } = await this.$http.post("/api/v1/coupon/update", {
        couponId: id,
        isDelete: 0,
      });
      if (res.code !== 200) {
        return this.$message.error("上架失败!");
      }
      this.$message.success("上架成功！");
      this.getImgList();
    },
    async showEditDialog(imgId) {
      // console.log(userCode);
      this.couponId = imgId;
      const { data: ret } = await this.$http.post("/api/v1/goods/search", {});
      this.goodsList = ret.data.data;
      const { data: res } = await this.$http.post("/api/v1/coupon/search", {
        couponId: imgId,
      });
      this.editForm = res.data.data[0];
      this.value[0] = this.editForm.collectionStartTime;
      this.value[1] = this.editForm.collectionEndTime;
      this.goodsIdList = this.editForm.goodsIdList;
      // console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.isShow = true;
      this.goodsIdList = [];
      this.value = [];
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post("/api/v1/coupon/update", {
          couponId: this.couponId,
          couponName: this.editForm.couponName,
          collectionLimit: this.editForm.collectionLimit,
          collectionAmount: this.editForm.collectionAmount,
          useLimitValue: this.editForm.useLimitValue,
          couponValue: this.editForm.couponValue,
          useTime: this.editForm.useTime,
          couponType: this.editForm.couponType,
          goodsIdList: this.goodsIdList,
          collectionStartTime: this.value[0],
          collectionEndTime: this.value[1],
        });

        if (res.code !== 200) {
          this.$message.error("修改失败!");
        } else {
          this.$message.success("修改成功");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        this.goodsIdList = [];
        this.value = [];
        // 刷新数据列表
        this.getImgList();
      });
    },
    async removeUserById(imgId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该优惠券, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回字符串confirm
      // 如果用户取消删除，则返回字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("/api/v1/coupon/delete", {
        data: [imgId],
      });
      if (res.code !== 200) {
        this.$message.error("删除优惠券失败!");
      } else {
        this.$message.success("删除优惠券成功");
      }

      this.getImgList();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path;
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
</style>

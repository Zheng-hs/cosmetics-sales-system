<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>精选活动</el-breadcrumb-item>
      <el-breadcrumb-item>用户申请记录</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜素与添加区域 -->
       <el-row :gutter="20">
            <el-col :span="4">
              <el-select v-model="selectObj" placeholder="请选择...." >
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
                v-model="addForm.isJackpot"
                placeholder="请选择..."
                 @change="getImgList1"
                v-if="selectObj === 'isJackpot'"
              >
                <el-option
                  v-for="item in list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
            placeholder="请输入内容"
            v-model="addForm.username"
            clearable
            @clear="getImgList"
            v-else
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getImgList2"
            ></el-button>
          </el-input>
            </el-col>
          </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="imgList" border stripe :row-key="getRowKeys" ref="topicTable">
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="分类id" prop="articlesClassifyId"></el-table-column> -->
        <el-table-column label="活动编号" prop="activityId"> </el-table-column>
        <el-table-column label="抽奖人" prop="username">
        </el-table-column>
         <el-table-column label="抽奖时间" prop="createTime">
        </el-table-column>
       <el-table-column label="是否中奖" prop="isJackpot">
          <template slot-scope="scope">
            {{ scope.row.isJackpot === "0" ? "未中奖" : "已中奖" }}
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
      imgList: [],
      total: 0,
      isShow: false,
      showRate: false,
      // 控制用户对话框的显示与隐藏
      userInfo: "",
      selectList: [
        { label: "抽奖用户", value: "username" },
        { label: "是否中奖", value: "isJackpot" },
      ],
      list: [
        { label: "未中奖", value: "0" },
        { label: "已中奖", value: "1" }
      ],
      select: "",
      selectObj: "",
      commentId: "",
      message: "",
      commentUser: "",
      editDialogVisible: false,
      addForm: {},
      goodsImage: "",
      editForm: {},
      type: "试用活动",
      addFormRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        usernameCn: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ]
      },
      goodsList: [],
      articleList: [],
      newList: [],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    goodsLevel: 0
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
      console.log(this.goodsList);
    },
    async getArticle() {
      const { data: res } = await this.$http.post(
        "/api/v1/activity/search",
        {}
      );
      this.articleList = res.data.data;
      console.log(this.articleList);
    },
    async getImgList() {
      const { data: res } = await this.$http.post(
        `/api/v1/activity/searchActivityUser`,
        {}
      );
      if (res.code !== 200) {
        return this.$message.error("获取活动失败!");
      }
      this.imgList = res.data.data;
      console.log(this.imgList);
      this.total = res.data.total;
    },
    async getImgList1(uid) {
      const { data: res } = await this.$http.post(
        `/api/v1/activity/searchActivityUser`,
        {isJackpot:uid}
      );
      if (res.code !== 200) {
        return this.$message.error("获取活动失败!");
      }
      this.imgList = res.data.data;
      console.log(this.imgList);
      this.total = res.data.total;
    },
    async getImgList2(uid) {
      const { data: res } = await this.$http.post(
        `/api/v1/activity/searchActivityUser`,
        {username:this.addForm.username}
      );
      if (res.code !== 200) {
        return this.$message.error("获取活动失败!");
      }
      this.imgList = res.data.data;
      console.log(this.imgList);
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
    },
    async changStatus(id) {
      console.log(1111);
      const { data: res } = await this.$http.post("/api/v1/articles/update", {
        articlesId: id,
        isDelete: 1
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
        isDelete: 0
      });
      if (res.code !== 200) {
        return this.$message.error("启用失败!");
      }
      this.$message.success("启用成功！");
      this.getImgList();
    },
    showExpand(row) {
        this.isShow = true
        this.commentId = row.commentId;
      this.commentUser = row.commentUser;
      this.$refs.topicTable.toggleRowExpansion(row, true) 
    },
     getRowKeys(row) {
       return row.commentId
    },
    async deleteReply(id) {
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
      const { data: res } = await this.$http.delete("/api/v1/reply/delete", {
        data: [id]
      });
      if (res.code == 200) {
        this.$message.success("删除评论成功");
      } else {
        this.$message.error("删除评论失败!");
      }

      this.getImgList();
    },
    reply(item) {
      this.isShow = !this.isShow;
      this.commentId = item.commentId;
      this.commentUser = item.commentUser;
    },
    editActivityInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post('/api/v1/activity/updateActivity', this.editForm
          )

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getImgList()
        this.$message.success('修改活动信息成功')
      })
    },
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

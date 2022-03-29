<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select
            v-model="selectObj"
            placeholder="请选择评论对象"
            @change="choose"
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
        <el-col :span="8">
          <el-select
            v-model="addForm.uid"
            placeholder="请选择"
            v-if="selectObj === 'articlesId'"
            @change="getImgList1"
          >
            <el-option
              v-for="item in articleList"
              :key="item.articlesId"
              :label="item.articlesTitle"
              :value="item.articlesId"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="addForm.uid"
            placeholder="请选择"
            @change="getImgList1"
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
          >新增评价</el-button
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="回复管理">
                <div
                  class="reply"
                  v-for="item in props.row.replyEntityList"
                  :key="item.replyId"
                  @click="reply(item)"
                >
                  <span class="headimg"
                    ><img :src="item.imgPath" alt="" />
                    <span>{{ item.replyUser }}</span
                    >回复<span>{{ item.commentUser }}</span
                    >:</span
                  >
                  <span>{{ item.replyContent }}</span>
                  <span>{{ item.replyTime | dataFormat }}</span>
                  <a
                    href="JavaScript:void(0)"
                    @click="deleteReply(item.replyId)"
                    >删除</a
                  >
                </div>
                <el-row :gutter="20" v-show="isShow">
                  <el-col :span="12"
                    ><el-input v-model="message"></el-input
                  ></el-col>
                  <el-col :span="4"
                    ><el-button @click="send">发送</el-button></el-col
                  >
                </el-row>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="分类id" prop="articlesClassifyId"></el-table-column> -->
        <el-table-column label="评论者" prop="commentUser"> </el-table-column>
        <el-table-column label="评论内容" prop="commentContent">
        </el-table-column>
        <el-table-column label="评分" prop="goodsLevel"> </el-table-column>
        <el-table-column label="头像" prop="imgPath">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.imgPath"
              :preview-src-list="[scope.row.imgPath]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="评论时间" prop="createTime">
          <template slot-scope="scope">
            {{ scope.row.createTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 新增按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showExpand(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.commentId)"
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
      title="新增评价"
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
        <el-form-item label="商品/文章" prop="uid">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select
                v-model="selectObj"
                placeholder="请选择评论对象"
                @change="choose"
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
            <el-col :span="10">
              <el-select
                v-model="addForm.uid"
                placeholder="请选择"
                v-if="selectObj === 'articlesId'"
              >
                <el-option
                  v-for="item in articleList"
                  :key="item.articlesId"
                  :label="item.articlesTitle"
                  :value="item.articlesId"
                >
                </el-option>
              </el-select>
              <el-select v-model="addForm.uid" placeholder="请选择" v-else>
                <el-option
                  v-for="item in goodsList"
                  :key="item.goodsId"
                  :label="item.goodsName"
                  :value="item.goodsId"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="评分" prop="goodsLevel" v-show="showRate">
          <el-rate v-model="goodsLevel" :colors="colors"> </el-rate>
        </el-form-item>
        <el-form-item label="评价" prop="commentContent">
          <el-input v-model="addForm.commentContent"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
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
        { label: "标题", value: "articlesTitle" },
        { label: "描述", value: "articlesDescribe" },
        { label: "公告id", value: "articlesId" },
      ],
      list: [
        { label: "文章", value: "articlesId" },
        { label: "商品", value: "goodsId" },
      ],
      select: "",
      selectObj: "",
      commentId: "",
      message: "",
      commentUser: "",
      addDialogVisible: false,
      addForm: {},
      addFormRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        usernameCn: [
          { required: true, message: "请输入用户名", trigger: "blur" },
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
      console.log(this.goodsList);
    },
    async getArticle() {
      const { data: res } = await this.$http.post(
        "/api/v1/articles/search",
        {}
      );
      this.articleList = res.data.data;
      console.log(this.articleList);
    },
    choose() {
      if (this.selectObj === "goodsId") {
        this.showRate = !this.showRate;
      }
      if (this.selectObj === "articlesId") {
        this.showRate = false;
      }
    },
    async getImgList() {
      const { data: res } = await this.$http.post(
        `/api/v1/comment/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );
      if (res.code !== 200) {
        return this.$message.error("获取评论失败!");
      }
      this.imgList = res.data.data;
      console.log(this.imgList);
      this.total = res.data.total;
    },
    async getImgList1(uid) {
      const { data: res } = await this.$http.post(
        `/api/v1/comment/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        { uid: uid }
      );
      if (res.code !== 200) {
        return this.$message.error("获取评论失败!");
      }
      this.imgList = res.data.data;
      console.log(this.imgList);
      this.total = res.data.total;
    },
    async add() {
      if (this.selectObj === "goodsId") {
        const { data: res } = await this.$http.post("/api/v1/comment/add", {
          goodsLevel: this.goodsLevel,
          commentContent: this.addForm.commentContent,
          uid: this.addForm.uid,
          commentType: 3,
        });
        if (res.code == 200) {
          this.$message.success("新增评价成功！");
          this.addDialogVisible = false;
          this.getImgList();
        } else {
          this.$message.error("新增评价失败！");
        }
      }
      if (this.selectObj === "articlesId") {
        const { data: res } = await this.$http.post("/api/v1/comment/add", {
          commentType: 1,
          commentContent: this.addForm.commentContent,
          uid: this.addForm.uid,
        });
        if (res.code == 200) {
          this.$message.success("新增评价成功！");
          this.addDialogVisible = false;
          this.getImgList();
        } else {
          this.$message.error("新增评价失败！");
        }
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
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: res } = await this.$http.delete("/api/v1/comment/delete", {
        data: [id],
      });
      if (res.code == 200) {
        this.$message.success("删除图片成功");
      } else {
        this.$message.error("删除图片失败!");
      }

      this.getImgList();
    },
    async deleteReply(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: res } = await this.$http.delete("/api/v1/reply/delete", {
        data: [id],
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
    async send() {
      const { data: res } = await this.$http.post("/api/v1/reply/add", {
        commentId: this.commentId,
        replyContent: this.message,
        commentUser: this.commentUser,
      });
      if (res.code == 200) {
        this.$message.success("回复成功");
        this.message = "";
        this.getImgList();
        this.isShow = !this.isShow;
      } else {
        this.$message.error("回复失败!");
      }
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

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
          <el-select v-model="select" placeholder="请选择查询类别">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="select === 'articlesType'">
          <el-select
            clearable
            @clear="getImgList"
            v-model="queryInfo.query"
            placeholder="请选择查询类别"
            @change="getImgList1"
          >
            <el-option
              v-for="item in selectList1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" v-else>
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
          <el-button type="primary" @click="add">添加公告</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="imgList" border stripe>
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="分类id" prop="articlesClassifyId"></el-table-column> -->
        <el-table-column label="标题" prop="articlesTitle"> </el-table-column>
        <el-table-column label="作者" prop="articlesAuthor"></el-table-column>
        <el-table-column label="公告id" prop="articlesId" type="number"> </el-table-column>
        <el-table-column label="公告描述" prop="articlesDescribe">
        </el-table-column>
        <el-table-column label="浏览量" prop="articlesPageView">
        </el-table-column>

        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <div
              v-if="scope.row.isDelete == 0"
              @click="changStatus(scope.row.articlesId)"
            >
              <el-result icon="success" title="已启用"></el-result>
            </div>
            <div v-else @click="changIsDelete(scope.row.articlesId)">
              <el-result icon="error" title="已禁用"></el-result>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="scope">
            {{ scope.row.createTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="articlesType">
          <template slot-scope="scope">
            {{
              scope.row.articlesType === "0"
                ? "公告"
                : scope.row.articlesType === "1"
                ? "文章"
                : scope.row.articlesType === "2"
                ? "话题"
                : "商品"
            }}
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
              @click="removeUserById(scope.row.articlesId)"
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
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
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
      isShow: true,
      // 控制用户对话框的显示与隐藏
      userInfo: "",
      selectList: [
        { label: "标题", value: "articlesTitle" },
        { label: "描述", value: "articlesDescribe" },
        { label: "公告id", value: "articlesId" },
        { label: "分类", value: "articlesType" },
      ],
      selectList1: [
        { label: "公告", value: "0" },
        { label: "文章", value: "1" },
        { label: "话题", value: "2" },
        { label: "商品", value: "3" },
      ],
      select: "",
      select1: "",
    };
  },
  created() {
    this.getImgList();
  },
  methods: {
    async getImgList() {
      const { data: res } = await this.$http.post(
        `/api/v1/articles/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );
      if (res.code !== 200) {
        return this.$message.error("获取公告列表失败!");
      }
      this.imgList = res.data.data;
      this.total = res.data.total;
    },
    async getImgList1() {
      let param = {};
      param[this.select] = this.queryInfo.query;
      const { data: res } = await this.$http.post(
        `/api/v1/articles/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        param
      );
      if (res.code !== 200) {
        return this.$message.error("搜索失败!");
      }
      this.$message.success("搜索成功！");
      this.imgList = res.data.data;
      this.total = res.data.total;
    },
    add() {
      this.$router.push("/add");
    },
    changeIsShow() {
      this.isShow = !this.isShow;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      if (this.queryInfo.query === "") {
        this.getImgList();
      } else {
        this.getImgList1();
      }
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      if (this.queryInfo.query === "") {
        this.getImgList();
      } else {
        this.getImgList1();
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.imageUrl = "";
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
    showEditDialog(data) {
      // console.log(data);
      this.$router.push({ path: "/edit", query: data });
    },
    async removeUserById(articlesId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该公告, 是否继续?",
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
      const { data: res } = await this.$http.delete("/api/v1/articles/delete", {
        data: [articlesId],
      });
      if (res.code !== 200) {
        this.$message.error("删除公告失败!");
      } else {
        this.$message.success("删除公告成功");
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

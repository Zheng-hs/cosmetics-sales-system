<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告</el-breadcrumb-item>
      <el-breadcrumb-item>公告分类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加分类区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
           <el-select clearable  @clear="getCateList" v-model="select" placeholder="请选择" @change="getCateList1">
             <el-option v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="cateList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="classifyId"
        border
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="articlesClassifyId" label="分类id"></el-table-column>
        <el-table-column prop="articlesClassifyName" label="分类名称">
        </el-table-column>
        <!-- <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.isDelete == 0"
              style="color: lightgreen;"
            ></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column> -->
        <el-table-column prop="articlesClassifySort" label="分类排序"> </el-table-column>
        <!-- <el-table-column prop="articlesClassifyIcon" label="图标">
            <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.articlesClassifyIcon"
              :preview-src-list="[scope.row.articlesClassifyIcon]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column label="操作" width="200px">
          <!-- 操作 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditCateDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCateById(scope.row.articlesClassifyId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNo"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
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
        <el-form-item label="文章类型" prop="articlesClassifyType">
          <el-select v-model="addCateForm.articlesClassifyType" placeholder="请选择查询类别">
            <el-option v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="articlesClassifyName">
          <el-input v-model="addCateForm.articlesClassifyName"></el-input>
        </el-form-item>
        <el-form-item label="分类排序" prop="articlesClassifySort">
          <el-input v-model="addCateForm.articlesClassifySort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
      <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-show="show"
            :src="editCateForm.articlesClassifyIcon"
            class="avatars"
            @click="changeIsShow"
          />
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="分类名称" prop="articlesClassifyName">
          <el-input v-model="editCateForm.articlesClassifyName"></el-input>
        </el-form-item>
        <el-form-item label="分类排序" prop="articlesClassifySort">
          <el-input v-model="editCateForm.articlesClassifySort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      isShow: false,
      show: true,
      isLeaf: false,
      queryInfo: {
        pageNo: 1,
        pageSize: 5
      },
      uploadURL: 'http://1.15.186.9:8006/api/v1/upload',
      imageUrl: '',
      select: '',
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        parentId: 0
      },
      addCateFormRules: {
        classifyName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请输入分类描述", trigger: "blur" }
        ]
      },
      editCateDialogVisible: false,
      editCateForm: [],
      editCateFormRules: {
        classifyName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请输入分类描述", trigger: "blur" }
        ]
      },
       selectList: [
        { label: '公告', value: '0' },
        { label: '文章', value: '1' },
        { label: '话题', value: '2' },
        { label: '商品', value: '3' }
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    changeLeaf() {
      this.isShow = !this.isShow;
      if (this.isShow == false) {
        this.addCateForm.parentId = 0;
      }
      //   console.log(this.dialogFormData.isLeaf);
    },
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.post(
        `/api/v1/articlesClassify/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );

      if (res.code !== 200) {
        return this.$message.error("获取公告分类失败!");
      }

      this.cateList = res.data.data;
      console.log(this.cateList);
      this.total = res.data.total;
    },
    async getCateList1() {
      const { data: res } = await this.$http.post(
        `/api/v1/articlesClassify/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {articlesClassifyType: this.select}
      );

      if (res.code !== 200) {
        return this.$message.error("获取公告分类失败!");
      }

      this.cateList = res.data.data;
      console.log(this.cateList);
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.addCateDialogVisible = true;
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.imageUrl = ''
    },
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/v1/articlesClassify/add",
          {
              articlesClassifyIcon: this.userPicture,
              articlesClassifyType:this.addCateForm.articlesClassifyType,
              articlesClassifyName: this.addCateForm.articlesClassifyName,
              articlesClassifySort: this.addCateForm.articlesClassifySort
          }
        );

        if (res.code !== 200) {
          return this.$message.error("添加分类失败!");
        }

        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    async showEditCateDialog(row) {
        console.log(row);

      this.editCateForm = row;
      this.editCateDialogVisible = true;
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/v1/articlesClassify/update",
          { 
            articlesClassifyId: this.editCateForm.articlesClassifyId,
            articlesClassifyIcon: this.userPicture,
            articlesClassifyName: this.editCateForm.articlesClassifyName,
            articlesClassifySort: this.editCateForm.articlesClassifySort
          }
        );
        if (res.code !== 200) {
          return this.$message.error("修改分类名称失败!");
        }

        this.$message.success("修改分类名称成功");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const {
        data: res
      } = await this.$http.delete("/api/v1/articlesClassify/delete", {
        data: [id]
      });

      if (res.code !== 200) {
        return this.$message.error("删除分类失败!");
      }

      this.$message.success("删除分类成功");
      this.getCateList();
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path
    },
    changeIsShow () {
      this.show = !this.show
    },
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
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

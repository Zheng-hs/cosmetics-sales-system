<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加分类区域 -->
      <el-row>
        <el-col>
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
        :tree-props="{ children: 'goodsClassifyEntities' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="classifyName" label="分类名称">
        </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.isDelete == 0"
              style="color: lightgreen;"
            ></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column label="分类等级">
          <!-- 排序 -->
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.classifyLevel === '0'"
              >一级</el-tag
            >
            <el-tag
              type="success"
              size="mini"
              v-else-if="scope.row.classifyLevel == 1"
              >二级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="分类描述"> </el-table-column>
        <el-table-column label="操作">
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
              @click="removeCateById(scope.row.classifyId)"
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
        <el-form-item label="分类名称" prop="classifyName">
          <el-input v-model="addCateForm.classifyName"></el-input>
        </el-form-item>
        <el-form-item label="是否二级分类" prop="isLeaf">
          <el-switch
            v-model="isLeaf"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeLeaf"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="父级分类" prop="parentId" v-show="isShow">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-select v-model="addCateForm.parentId" placeholder="请选择">
            <el-option
              v-for="item in cateList"
              :key="item.classifyId"
              :label="item.classifyName"
              :value="item.classifyId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类描述" prop="remarks">
          <el-input v-model="addCateForm.remarks"></el-input>
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
        <el-form-item label="分类名称" prop="classifyName">
          <el-input v-model="editCateForm.classifyName"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="remarks">
          <el-input v-model="editCateForm.remarks"></el-input>
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
      isLeaf: false,
      queryInfo: {
        pageNo: 1,
        pageSize: 5
      },
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
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
      changeLeaf() {
        this.isShow = !this.isShow;
      if(this.isShow == false) {
          this.addCateForm.parentId = 0
      } 
    //   console.log(this.dialogFormData.isLeaf);
    },
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.post(
        `/api/v1/goodsClassify/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );

      if (res.code !== 200) {
        return this.$message.error("获取商品分类失败!");
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
    },
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/v1/goodsClassify/save",
          this.addCateForm
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
    //   console.log(row);

      this.editCateForm = row;
      this.editCateDialogVisible = true;
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return;
         const { data: res } = await this.$http.post("/api/v1/goodsClassify/update",
         {
             classifyId: this.editCateForm.classifyId,
             classifyName: this.editCateForm.classifyName,
             remarks: this.editCateForm.remarks
         });
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

      const { data: res } = await this.$http.delete("/api/v1/goodsClassify/delete", {data: [id]});

      if (res.code !== 200) {
        return this.$message.error("删除分类失败!");
      }

      this.$message.success("删除分类成功");
      this.getCateList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

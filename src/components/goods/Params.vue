<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品规格</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-button type="primary" size="mini" @click="addDialogVisible = true">添加规格</el-button>
                    <el-table :data="cateList" border stripe :row-key="getRowKeys" ref="topicTable">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item,i) in scope.row.goodsNormsEntities" :key="i" closable @close="handleClose(i,item)">
                                    {{item.normsValue}}
                                </el-tag>
                                <!-- 输入的文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="normsValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引 -->
                        <el-table-column label="序号" type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="normsName"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row)">删除</el-button>
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
        title="添加属性"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item label="规格" prop="normsName">
                <el-input v-model="addForm.normsName"></el-input>
            </el-form-item>
            <el-form-item label="参数" prop="normsValue">
                <el-input v-model="addForm.normsValue"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      inputVisible:false,
      normsValue: '',
      cateProps: {

      },
      queryInfo: {
        pageNo: 1,
        pageSize: 5
      },
      total: 0,
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: { attr_name: '' },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.post(`/api/v1/goodsNorms/search?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,{})
      if (res.code !== 200) {
        return this.$message.error('获取商品配置失败!')
      }

      this.cateList = res.data.data
      this.total = res.data.total
    },
    // 级联选择框中选中项变化 ，会触发这个函数
    handleChange () {
      this.getParmasData()
      this.$refs.cascaderHandle.dropDownVisible = false
    },
    // tab页签点击事件的处理函数
    handleTabClick () {
      this.getParmasData()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getCateList();
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    getRowKeys(row) {
       return row.normsName
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/api/v1/goodsNorms/add', this.addForm)

        if (res.code !== 200) {
          return this.$message.error('添加规格失败!')
        }

        this.$message.success('添加规格成功！')
        this.addDialogVisible = false
        this.getCateList()
      })
    },
    showEditDialog (row) {
      this.$refs.topicTable.toggleRowExpansion(row, true) 
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async removeParams (row) {
      let list = row.goodsNormsEntities.map(item => {
        return item.normsId
      })
      // console.log(list);
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete("/api/v1/goodsNorms/delete", {
        data: list
      });

      if (res.code !== 200) {
        return this.$message.error('删除参数失败!')
      }

      this.$message.success('删除参数成功')
      this.getCateList()
    },
    // 文本框失去焦点，或摁下Enter都会触发
    async handleInputConfirm (row) {
      if (this.normsValue.trim().length === 0) {
        this.normsValue = ''
        this.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
       // 需要发起请求，保存到数据库
     const {data: res} = await this.$http.post('/api/v1/goodsNorms/add',{
       normsValue: this.normsValue,
       normsName: row.normsName
     }) 
     if(res.code == 200) {
       this.$message.success('新增配置成功！')
      this.normsValue = ''
      this.inputVisible = false
      this.getCateList()
     } else {
       this.$message.error('新增配置失败！')
     }
    },
    showInput (row) {
      this.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleClose (i, row) {
      console.log(row);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
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
      const { data: res } = await this.$http.delete("/api/v1/goodsNorms/delete", {
        data: [row.normsId]
      });
      if (res.code == 200) {
        this.$message.success("删除参数成功");
      } else {
        this.$message.error("删除参数失败!");
      }

      this.getCateList();
    },
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}

.el-tag {
    margin: 10px;
}
.el-tag:first-child {
  margin-left: 100px;
}
.input-new-tag {
    width: 120px;
}
</style>

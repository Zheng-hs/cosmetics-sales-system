<template>
<el-card>
  <el-table
    :data="operationList"
    style="width: 100%"
    :row-class-name="tableRowClassName"
    border
    hegiht="472"
    max-height="450">
    <el-table-column label="序号" type="index" ></el-table-column>
    <el-table-column
      prop="usernameCn"
      label="操作人"
      width="100">
      <el-table-column prop="usernameCn">
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="operationListSearch.usernameCn"
              clearable
              size="mini"
              placeholder="搜索..."
              @change="getOperitionList"
            />
          </template>
        </el-table-column>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="操作时间"
      width="180">
      <el-table-column
          width="172px"
          prop="createTime"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-date-picker
              v-model.trim="operationListSearch.createTime"
              style="width:150px"
              clearable
              size="mini"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="getOperitionList"
            />
          </template>
        </el-table-column>
    </el-table-column>
    <el-table-column
      prop="content"
      label="操作内容">
      <el-table-column
          min-width="270px"
          prop="content"
          show-overflow-tooltip
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="operationListSearch.content"
              clearable
              size="mini"
              placeholder="搜索..."
              @change="getOperitionList"
            />
          </template>
        </el-table-column>
    </el-table-column>
    <el-table-column
      align="center"
        label="操作类别"
        width="180px">
      <el-table-column
          prop="operationType"
          width="180px"
          :formatter="typeFormatter"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-select
              v-model.trim="operationListSearch.operationType"
              placeholder="搜索..."
              size="mini"
              @change="getOperitionList"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
    </el-table-column>
  </el-table>
  <div class="block">
   <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
  </div>
</el-card>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .warning-row {
    background: #ce2c2c;
  }

  .el-table .info-row {
    background: #5766ec;
  }
  .block {
  text-align: center;
  padding: 10px;
}
</style>

<script>
  export default {
    data() {
      return {
        queryInfo: {
            query: '',
            currPage: 1,
            pageSize: 10
        },
        operationList: [],
        operationListSearch: {},
        total: 0,
        typeOptions: [
            {label: '全部', value: ''},
            {label: '查询', value: '0'},
            {label: '新增', value: '1'},
            {label: '修改', value: '2'},
            {label: '删除', value: '3'},
            {label: '下单', value: '4'},
            {label: '登录PC后台', value: '6'},
            {label: '登录app小程序', value: '7'},
            {label: '退货', value: '8'},
            {label: '浏览商品', value: '9'}
        ],
      }
    },
    created (){
        this.getOperitionList()
    },
     methods: {
      tableRowClassName(row) {
        if (row.operationType === 3 || row.operationType === 8) {
          return 'error-row';
        } else if (row.operationType === 1 || row.operationType === 4 || row.operationType === 9) {
          return 'success-row';
        } else if (row.operationType === 2){
            return 'warning-row';
        } else if (row.operationType === 0 || row.operationType === 6 || row.operationType === 7){
            return 'info-row';
        }
         
        return '';
      },
      typeFormatter(row) {
      switch (row.operationType) {
          case '0':
              return '查询'
        case '1':
          return '新增'
        case '2':
          return '修改'
        case '3':
          return '删除'
        case '4':
          return '下单'
        case '6':
          return '登录PC后台'
        case '7':
          return '登录app小程序'
        case '8':
          return '退货'
        case '9':
          return '浏览商品'
      }
    },
    async getOperitionList (){
            const {data: res } = await this.$http.post(
                '/api/v1/operation/search', this.operationListSearch,{params : this.queryInfo}
            )
            if (res.code != 200){
                return this.$message.error("获取操作记录失败");                
            }
            this.operationList = res.data.data
            this.total = res.data.total
        },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getOperitionList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.currPage = newPage
      this.getOperitionList()
    },
    },
      
  }
</script>

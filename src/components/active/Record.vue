<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券领取记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="operationList"
        style="width: 100%"
        border
        stripe
        max-height="520"
      >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="userId" label="操作人"> </el-table-column>
        <el-table-column prop="couponName" label="优惠券名称">
        </el-table-column>
        <el-table-column label="是否使用" prop="status" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">已使用</el-tag>
            <el-tag v-else-if="scope.row.status === '0'"
              >未使用</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="使用开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="使用结束时间"> </el-table-column>
        <el-table-column prop="couponType" label="优惠券类型">
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.currPage"
          :page-sizes="[6, 8, 10, 20]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      operationList: [],
      operationListSearch: {},
      total: 0,
      queryInfo: {
        query: "",
        currPage: 1,
        pageSize: 6,
      },
    };
  },
  methods: {
    async getOperitionList() {
      const { data: res } = await this.$http.post(
        "/api/v2/app/token/searchCouponUser",
        this.operationListSearch,
        { params: this.queryInfo }
      );
      if (res.code !== 200) {
        return this.$message.error("获取领取记录失败");
      }
      this.operationList = res.data.data;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getOperitionList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.currPage = newPage;
      this.getOperitionList();
    },
  },
  created() {
    this.getOperitionList();
  },
};
</script>

<style></style>

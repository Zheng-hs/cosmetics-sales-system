<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select  clearable  @clear="getOrderList" v-model="select" placeholder="请选择查询类别">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" v-if="select === 'status'">
          <el-select clearable  @clear="getOrderList" v-model="queryInfo.query" placeholder="请选择" @change="getOrderList1">
            <el-option
              v-for="item in statusList"
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
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList1"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="orderId"
          width="250px"
        ></el-table-column>
        <el-table-column label="下单人" prop="createUser"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goodsName"
          width="180px"
        ></el-table-column>
        <el-table-column
          label="商品规格"
          prop="goodsNormsValue"
        ></el-table-column>
        <el-table-column
          label="原价"
          prop="goodsOriginalPrice"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="支付价格"
          prop="goodsPayPrice"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品现价"
          prop="goodsPrice"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goodsCnt"
          width="95px"
        ></el-table-column>
        <!-- <el-table-column
          label=""
          prop="updateUser"
          width="95px"
        ></el-table-column> -->
        <el-table-column
          label="电话"
          prop="userPhone"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="地址"
          prop="userAddress"
          width="150px"
        ></el-table-column>
        <el-table-column label="是否使用" prop="couponId" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '0'">未使用</el-tag>
            <el-tag v-else>已使用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '1'">已下单</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === '2'"
              >已发货</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.status === '3'"
              >已到货</el-tag
            >
            <el-tag v-else-if="scope.row.status === '4'">已收货未评价</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === '5'"
              >已收货已评价</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.status === '6'"
              >退款中</el-tag
            >
            <el-tag type="danger" v-else>已退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime" width="180px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox(scope.row.orderId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="修改订单状态"
      :visible.sync="adressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="adressForm"
        :rules="adressFormRules"
        ref="adressFormRef"
        label-width="100px"
      >
        <el-form-item label="修改状态" prop="status">
          <el-select v-model="adressForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdress">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 10
      },
      orderList: [],
      statusList: [
        { label: "已下单", value: "1" },
        { label: "已发货", value: "2" },
        { label: "已到货", value: "3" },
        { label: "已收货未评价", value: "4" },
        { label: "已收货已评价", value: "5" },
        { label: "退款中", value: "6" },
        { label: "已退款", value: "7" }
      ],
      selectList: [
        { label: "订单编号", value: "orderId" },
        { label: "商品名称", value: "goodsName" },
        { label: "订单状态", value: "status" }
      ],
      select: "",
      total: 0,
      orderId: "",
      adressVisible: false,
      adressForm: {
        adress2: "",
        adress1: []
      },
      adressFormRules: {
        adress1: [
          { required: true, message: "请选择省市区县", trigger: "change" }
        ],
        adress2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      progressVisible: false,
      progressInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.post(
        `/api/v1/order/searchAllOrder?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        {}
      );
      if (res.code !== 200) {
        return this.$message.error("获取订单列表失败!");
      }

      this.orderList = res.data.data;
      this.total = res.data.total;
    },
    async getOrderList1() {
      let param = {};
      param[this.select] = this.queryInfo.query;
      const { data: res } = await this.$http.post(
        `/api/v1/order/searchAllOrder?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        param
      );
      if (res.code == 200) {
        this.orderList = res.data.data;
        this.total = res.data.total;
        return this.$message.success("查询信息成功!");
      } else {
        this.$message.error("查询信息失败!");
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getOrderList();
    },
    async showBox(id) {
      // const { data: res } = await this.$http.get(`orders/${id}`)
      this.adressVisible = true;
      this.orderId = id;
    },
    addressDialogClosed() {
      this.$refs.adressFormRef.resetFields();
    },
    adressChanged() {
      this.$refs.cascaderHandle.dropDownVisible = false;
    },
    async editAdress() {
      const { data: res } = await this.$http.post(
        `/api/v1/order/update?orderId=${this.orderId}&status=${this.adressForm.status}`
      );
      if (res.code !== 200) {
        this.$message.error("修改订单状态失败！");
      }
      this.$message.success("修改订单状态成功！");
      this.adressVisible = false;
      this.getOrderList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

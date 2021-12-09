<template>
  <div>
    <el-row class="title-top" :gutter="24">
      <el-col :span="6">
        <el-card>
          <img class="icon1" src="../icons/svg/peoples.svg" alt="">
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card></el-card>
      </el-col>
      <el-col :span="6">
        <el-card></el-card>
      </el-col>
      <el-col :span="6">
        <el-card></el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card>
          <el-button class="btn" @click="changeTimer" size="mini"
            >选择时间</el-button
          >
          <div class="timer">
            <el-date-picker
              v-model="value"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="chooseTime1"
              size="mini"
              value-format="yyyy-MM-dd"
              v-show="showTime"
            >
            </el-date-picker>
          </div>
          <div id="countArticleView" style="width:100%; height:100%;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-button class="btn1" @click="changeTimer1" size="mini"
            >选择时间</el-button
          >
          <div class="timer1">
            <el-date-picker
              v-model="value2"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="chooseTime2"
              size="mini"
              value-format="yyyy-MM-dd"
              v-show="showTime1"
            >
            </el-date-picker>
          </div>
          <div id="countGoodsSale" style="width:100%; height:100%;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-button class="btn2" @click="changeTimer2" size="mini"
            >选择时间</el-button
          >
          <div class="timer2">
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="chooseTime"
              size="mini"
              value-format="yyyy-MM-dd"
              v-show="showTime2"
            >
            </el-date-picker>
          </div>
          <div id="countOrderStatus" style="width:100%; height:100%;"></div>
        </el-card>
      </el-col>
      <!-- <el-col :span="6">
        <el-card></el-card>
      </el-col> -->
    </el-row>
    <el-card>
      <el-table
        :data="operationList"
        style="width: 100%"
        :cell-style="styleChange"
        border
        stripe
        max-height="520"
      >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="usernameCn" label="操作人" width="100">
          <el-table-column prop="usernameCn">
            <template slot="header" slot-scope="{}">
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
        <el-table-column prop="createTime" label="操作时间" width="180">
          <el-table-column width="172px" prop="createTime">
            <template slot="header" slot-scope="{}">
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
        <el-table-column prop="content" label="操作内容">
          <el-table-column
            min-width="270px"
            prop="content"
            show-overflow-tooltip
          >
            <template slot="header" slot-scope="{}">
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
        <el-table-column align="center" label="操作类别" width="180px">
          <el-table-column
            prop="operationType"
            width="180px"
            :formatter="typeFormatter"
          >
            <template slot="header" slot-scope="{}">
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
      queryInfo: {
        query: "",
        currPage: 1,
        pageSize: 6
      },
      showTime: false,
      showTime1: false,
      showTime2: false,
      gettime: "",
      gettime1: "",
      value: "",
      value1: "",
      value2: "",
      operationList: [],
      operationListSearch: {},
      total: 0,
      typeOptions: [
        { label: "全部", value: "" },
        { label: "查询", value: "0" },
        { label: "新增", value: "1" },
        { label: "修改", value: "2" },
        { label: "删除", value: "3" },
        { label: "下单", value: "4" },
        { label: "登录PC后台", value: "6" },
        { label: "登录app小程序", value: "7" },
        { label: "退货", value: "8" },
        { label: "浏览商品", value: "9" }
      ]
    };
  },
  created() {
    this.getOperitionList();
  },
  mounted() {
    let yy = new Date().getFullYear();
    let mm =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    let mm1 =
      new Date().getMonth() < 10
        ? "0" + new Date().getMonth()
        : new Date().getMonth();
    let dd =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    this.gettime = yy + "-" + mm + "-" + dd;
    this.gettime1 = yy + "-" + mm1 + "-" + dd;
    this.getPie1();
    this.getPie2();
    this.getBar();
  },
  methods: {
    changeTimer() {
      this.showTime = !this.showTime;
    },
    changeTimer1() {
      this.showTime1 = !this.showTime1;
    },
    changeTimer2() {
      this.showTime2 = !this.showTime2;
    },
    async getPie1() {
      let pie1 = this.$echarts.init(
        document.getElementById("countArticleView")
      );
      var option = {
        title: {
          text: "浏览量前五的商品",
          left: "center"
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: "销量",
            type: "pie",
            radius: [20, 70],
            center: ["50%", "50%"],
            color: [
              "rgb(46,199,201)",
              "rgb(182,162,222)",
              "rgb(90,177,239)",
              "rgb(255,185,128)",
              "rgb(216,122,128)"
            ],
            data: [],
            roseType: "radius"
          }
        ]
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countGoodsBrowse?startDate=${this.gettime1}&endDate=${this.gettime}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map(item => ({
          name: item.goodsName,
          value: item.goodsBrowseValue
        }));
      }
      option.series[0].data = res.data;
      // console.log(res.data);
      option && pie1.setOption(option);
    },
    async getPie2() {
      let pie1 = this.$echarts.init(
        document.getElementById("countOrderStatus")
      );
      var option = {
        title: {
          text: "订单状态",
          left: "center"
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            name: "订单状态",
            radius: [20, 70],
            center: ["50%", "50%"],
            // label: {
            //   normal: {
            //     show: true,
            //     position: "inside",
            //     formatter: "{d}%", //模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比

            //     textStyle: {
            //       align: "center",
            //       baseline: "middle",
            //       fontFamily: "微软雅黑",
            //       fontSize: 15,
            //       fontWeight: "bolder"
            //     }
            //   }
            // },
            data: [].sort(function(a, b) {
              return a.value - b.value;
            })
          }
        ]
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countOrderStatus?startDate=${this.gettime1}&endDate=${this.gettime}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map(item => ({
          name: item.orderStatus,
          value: item.orderStatusValue
        }));
      }

      option.series[0].data = res.data;
      // console.log(res.data);
      option && pie1.setOption(option);
    },
    async getBar() {
      let pie1 = this.$echarts.init(document.getElementById("countGoodsSale"));
      var option = {
        title: {
          text: "销售量前五的商品",
          left: "center"
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 30
            //  showMinLabel: true,
            //   showMaxLabel:true
          },
          axisLine: {
            lineStyle: {
              color: "rgb(0,138,205)"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgb(0,138,205)"
            }
          }
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        series: [
          {
            type: "bar",
            showBackground: true,
            itemStyle: {
              color:'rgb(90,177,239)'
            },
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)"
            },
            data: []
          }
        ]
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countGoodsSale?startDate=${this.gettime1}&endDate=${this.gettime}`
      );
      for (var i = 0; i < res.data.length; i++) {
        // console.log(res.data[i]);
        option.series[0].data.push(res.data[i].goodsSales);
        option.xAxis.data.push(res.data[i].goodsName);
      }
      // console.log(res.data);
      option && pie1.setOption(option);
    },
    async chooseTime(data) {
      let pie1 = this.$echarts.init(
        document.getElementById("countOrderStatus")
      );
      var option = {
        title: {
          text: "订单状态",
          left: "center"
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            name: "订单状态",
            radius: [20, 70],
            center: ["50%", "50%"],
            // color: [
            //   "rgb(46,199,201)",
            //   "rgb(182,162,222)",
            //   "rgb(90,177,239)",
            //   "rgb(255,185,128)",
            //   "rgb(52,191,123)",
            //   "rgb(216,122,128)",
            // ],
            data: [].sort(function(a, b) {
              return a.value - b.value;
            })
          }
        ]
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countGoodsBrowse?startDate=${this.value1[0]}&endDate=${this.value1[1]}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map(item => ({
          name: item.orderStatus,
          value: item.orderStatusValue
        }));
      }
      option.series[0].data = res.data;
      // console.log(res.data);
      option && pie1.setOption(option);
    },
    async chooseTime1(data) {
      let pie1 = this.$echarts.init(
        document.getElementById("countArticleView")
      );
      var option = {
        title: {
          text: "浏览量前五的商品",
          left: "center"
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom"
        },
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            type: "pie",
            name: "销量",
            radius: [20, 70],
            center: ["50%", "50%"],
            color: [
              "rgb(46,199,201)",
              "rgb(182,162,222)",
              "rgb(90,177,239)",
              "rgb(255,185,128)",
              "rgb(216,122,128)"
            ],
            data: [].sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: "radius"
          }
        ]
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countGoodsBrowse?startDate=${this.value[0]}&endDate=${this.value[1]}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map(item => ({
          name: item.goodsName,
          value: item.goodsBrowseValue
        }));
      }
      option.series[0].data = res.data;
      // console.log(res.data);
      option && pie1.setOption(option);
    },
    async chooseTime2(data) {
      let pie1 = this.$echarts.init(document.getElementById("countGoodsSale"));
      var option = {
        title: {
          text: "销售量前五的商品",
          left: "center"
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        series: [
          {
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)"
            },
            data: []
          }
        ]
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countGoodsSale?startDate=${this.value2[0]}&endDate=${this.value2[1]}`
      );
      for (var i = 0; i < res.data.length; i++) {
        // console.log(res.data[i]);
        option.series[0].data.push(res.data[i].goodsSales);
        option.xAxis.data.push(res.data[i].goodsName);
      }
      // console.log(res.data);
      option && pie1.setOption(option);
    },
    styleChange({ row, column, rowIndex, columnIndex }) {
      // console.log(row);
      if (row.operationType === "3" || row.operationType === "8") {
        return { color: "#ce2c2c" };
      } else if (
        row.operationType === "1" ||
        row.operationType === "4" ||
        row.operationType === "9"
      ) {
        return { color: "green" };
      } else if (row.operationType === "2") {
        return { color: "#eeaa2c" };
      } else {
        return { color: "#5766ec" };
      }
    },
    typeFormatter(row) {
      switch (row.operationType) {
        case "0":
          return "查询";
        case "1":
          return "新增";
        case "2":
          return "修改";
        case "3":
          return "删除";
        case "4":
          return "下单";
        case "6":
          return "登录PC后台";
        case "7":
          return "登录app小程序";
        case "8":
          return "退货";
        case "9":
          return "浏览商品";
      }
    },
    async getOperitionList() {
      const { data: res } = await this.$http.post(
        "/api/v1/operation/search",
        this.operationListSearch,
        { params: this.queryInfo }
      );
      if (res.code != 200) {
        return this.$message.error("获取操作记录失败");
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
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 20px 0;
  height: 350px;
  .el-col {
    height: 100%;
    .el-card {
      position: relative;
      height: 100%;
      /deep/ .el-card__body {
        height: 95%;
        padding-top: 5px;
      }
      .timer {
        position: absolute;
        top: 35px;
        text-align: center;
        width: 100%;
        z-index: 100000;
      }
      .timer1 {
        position: absolute;
        top: 32px;
        text-align: center;
        width: 100%;
        z-index: 100000;
      }
      .timer2 {
        position: absolute;
        top: 35px;
        text-align: center;
        width: 100%;
        z-index: 100000;
      }
      .btn {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 100000;
      }
      .btn1 {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 100000;
      }
      .btn2 {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 100000;
      }
    }
  }
}
.title-top {
  height: 100px;
}
.icon1 {
      line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;
    cursor: pointer;
    color: #40c9c6;
    box-sizing: inherit;
    width: 1em;
    height: 1em;
    vertical-align: -.15em;
    fill: currentColor;
    overflow: hidden;
    float: left;
    font-size: 48px;
}

</style>

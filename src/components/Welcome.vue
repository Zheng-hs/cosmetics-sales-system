<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日用户访问量</div>
            <count-to
              :start-val="0"
              :end-val="num1"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="search" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日商品浏览量</div>
            <count-to
              :start-val="0"
              :end-val="num2"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日销售总金额</div>
            <count-to
              :start-val="0"
              :end-val="num3"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日订单总数</div>
            <count-to
              :start-val="0"
              :end-val="num4"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
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
          <div id="countArticleView" style="width: 100%; height: 100%"></div>
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
          <div id="countGoodsSale" style="width: 100%; height: 100%"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-button class="btn" @click="changeTimer2" size="mini"
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
          <div id="countOrderStatus" style="width: 100%; height: 100%"></div>
        </el-card>
      </el-col>
      <!-- <el-col :span="6">
        <el-card></el-card>
      </el-col> -->
    </el-row>
    <el-row :gutter="40">
      <el-col>
        <el-card>
          <el-button class="btn2" size="mini" @click="getCountDay"
            >天</el-button
          >
          <el-button class="btn3" size="mini" @click="getCountMonth"
            >月</el-button
          >
          <el-button class="btn4" size="mini" @click="getCountYear"
            >年</el-button
          >
          <div
            id="countSalesByDays"
            style="width: 100%; height: 110%"
            v-show="showCountSalesByDays"
          ></div>
          <!-- <div id="countSalesByMonth" style="width:100%; height:100%" v-show="showCountSalesByMonth"></div>
          <div id="countSalesByYear" style="width:100%; height:100%" v-show="showCountSalesByYear">
          </div> -->
          <!-- <div>
            <el-radio-group v-model="day">
              <el-radio  label="day" @change="getCountDay">天</el-radio>
              <el-radio  label="month"   @change="getCountMonth">月</el-radio>
              <el-radio  label="year"  @change="getCountYear">年</el-radio>
            </el-radio-group>
          </div> -->
        </el-card>
      </el-col>
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
                style="width: 150px"
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
import CountTo from "vue-count-to";
export default {
  components: {
    CountTo,
  },
  data() {
    return {
      queryInfo: {
        query: "",
        currPage: 1,
        pageSize: 6,
      },
      showTime: false,
      showTime1: false,
      showTime2: false,
      gettime: "",
      gettime1: "",
      value: "",
      value1: "",
      value2: "",
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0,
      operationList: [],
      operationListSearch: {},
      total: 0,
      timer: null,
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
        { label: "浏览商品", value: "9" },
      ],
      showCountSalesByDays: true,
      showCountSalesByMonth: false,
      showCountSalesByYear: false,
    };
  },
  created: function () {
    this.getOperitionList();
    this.getNum();
    clearInterval(this.timer);
    this.timer = null;
    this.setTimer();
  },
  destroyed: function () {
    clearInterval(this.timer);
    this.timer = null;
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
    let dd1 =
      (new Date().getDate()+1) < 10
        ? "0" + (new Date().getDate()+1)
        : (new Date().getDate()+1);
    this.gettime = yy + "-" + mm + "-" + dd1;
    this.gettime1 = yy + "-" + mm1 + "-" + dd;
    this.getPie1();
    this.getPie2();
    this.getBar();
    this.getCountDay();
  },
  methods: {
    async getNum() {
      const { data: res } = await this.$http.get(
        "/api/v1/data-count/getUserViewToday"
      );
      this.num1 = res.data;
      const { data: res1 } = await this.$http.get(
        "/api/v1/data-count/getAllViewToday"
      );
      this.num2 = res1.data;
      const { data: res2 } = await this.$http.get(
        "/api/v1/data-count/getAllSalesPriceToday"
      );
      this.num3 = res2.data;
      const { data: res3 } = await this.$http.get(
        "/api/v1/data-count/getAllOrderCountToday"
      );
      this.num4 = res3.data;
    },
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
          left: "center",
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
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
              "rgb(216,122,128)",
            ],
            data: [],
            roseType: "radius",
          },
        ],
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countGoodsBrowse?startDate=${this.gettime1}&endDate=${this.gettime}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map((item) => ({
          name: item.goodsName,
          value: item.goodsBrowseValue,
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
          left: "center",
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
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
            data: [].sort(function (a, b) {
              return a.value - b.value;
            }),
          },
        ],
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countOrderStatus?startDate=${this.gettime1}&endDate=${this.gettime}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map((item) => ({
          name: item.orderStatus,
          value: item.orderStatusValue,
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
          left: "center",
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 30,
            //  showMinLabel: true,
            //   showMaxLabel:true
          },
          axisLine: {
            lineStyle: {
              color: "rgb(0,138,205)",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgb(0,138,205)",
            },
          },
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        series: [
          {
            type: "bar",
            showBackground: true,
            itemStyle: {
              color: "rgb(90,177,239)",
            },
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            data: [],
          },
        ],
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
          left: "center",
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
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
            data: [].sort(function (a, b) {
              return a.value - b.value;
            }),
          },
        ],
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countOrderStatus?startDate=${this.value1[0]}&endDate=${this.value1[1]}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map((item) => ({
          name: item.orderStatus,
          value: item.orderStatusValue,
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
          left: "center",
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom",
        },
        tooltip: {
          trigger: "item",
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
              "rgb(216,122,128)",
            ],
            data: [].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
          },
        ],
      };
      const { data: res } = await this.$http.post(
        `/api/v1/data-count/countGoodsBrowse?startDate=${this.value[0]}&endDate=${this.value[1]}`
      );
      if (res.data.length > 0) {
        res.data = res.data.map((item) => ({
          name: item.goodsName,
          value: item.goodsBrowseValue,
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
          left: "center",
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        legend: {
          // orient: "vertical",
          bottom: "bottom",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        series: [
          {
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            data: [],
          },
        ],
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
      // if (JSON.stringify(this.operationListSearch) != '{}'){
      //   this.queryInfo.currPage = 1
      //   this.queryInfo.pageSize = 6
      // }
      const { data: res } = await this.$http.post(
        "/api/v1/operation/search",
        this.operationListSearch,
        { params: this.queryInfo }
      );
      if (res.code !== 200) {
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
    },
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          console.log("开始定时...没过一秒执行一次");
          this.getOperitionList();
          this.getNum();
        }, 20000);
      }
    },
    async getCountDay() {
      let xAxis = [];
      let prices = [];
      let quantitys = [];
      const { data: res } = await this.$http.post(
        "/api/v1/data-count/countSalesByDays"
      );
      if (res.code === 200) {
        for (let key in res.data.price) {
          prices.push(Number(res.data.price[key]));
          xAxis.push(key);
        }
        for (let key in res.data.quantity) {
          quantitys.push(Number(res.data.quantity[key]));
        }
      }
      document.getElementById("countSalesByDays").id = "countSalesByDays";
      let myChart = this.$echarts.init(
        document.getElementById("countSalesByDays")
      );
      let option = {
        title: {
          text: "销售额统计",
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 15]
        },
        legend: {},
         grid: {
		        left: '2%',
		        right: '2%',
		        bottom: '8%',
		        containLabel: true
		    },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 30,
            },

            data: xAxis,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "销售额",
            // min: 0,
            // max: 250,
            position: "right",
            axisLabel: {
              formatter: "{value} ¥",
            },
            //  splitLine: {
            //   show: false, //去掉网格线
            // },
          },
          {
            type: "value",
            name: "订单数",
            // min: 0,
            // max: 25,
            position: "left",
            axisLabel: {
              formatter: "{value} 个",
            },
            splitLine: {
              show: false, //去掉网格线
            },
          },
        ],
        series: [
          {
            name: "销售额",
            type: "bar",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "rgb(46,199,201)",
              },
            },
            data: prices,
          },
          {
            name: "订单数",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  // width: 2
                },
              },
            },
            yAxisIndex: 1,
            data: quantitys,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // this.showCountSalesByDays = true;
      // this.showCountSalesByMonth = false;
      // this.showCountSalesByYear = false;
      // //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      // window.addEventListener('resize', function() { myChart.resize() });
    },

    async getCountMonth() {
      let xAxis = [];
      let prices = [];
      let quantitys = [];
      const { data: res } = await this.$http.post(
        "/api/v1/data-count/countSalesByMonth"
      );
      if (res.code === 200) {
        for (let key in res.data.price) {
          prices.push(Number(res.data.price[key]));
          xAxis.push(key);
        }
        for (let key in res.data.quantity) {
          quantitys.push(Number(res.data.quantity[key]));
        }
      }
      document.getElementById("countSalesByDays").id = "countSalesByMonth";
      let myChart = this.$echarts.init(
        document.getElementById("countSalesByMonth")
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
        },
        legend: {},
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },

            data: xAxis,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "销售额",
            // min: 0,
            // max: 250,
            position: "right",
            axisLabel: {
              formatter: "{value} ¥",
            },
          },
          {
            type: "value",
            name: "订单数",
            // min: 0,
            // max: 25,
            position: "left",
            axisLabel: {
              formatter: "{value} 个",
            },
          },
        ],
        series: [
          {
            name: "销售额",
            type: "bar",
            yAxisIndex: 0,
            data: prices,
          },
          {
            name: "订单数",
            type: "line",
            smooth: true,
            yAxisIndex: 1,
            data: quantitys,
          },
        ],
      };
      myChart.setOption(option);
      document.getElementById("countSalesByMonth").id = "countSalesByDays";
      // this.showCountSalesByDays = false;
      // this.showCountSalesByMonth = true;
      // this.showCountSalesByYear = true;
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    async getCountYear() {
      let xAxis = [];
      let prices = [];
      let quantitys = [];
      const { data: res } = await this.$http.post(
        "/api/v1/data-count/countSalesByYear"
      );
      if (res.code === 200) {
        for (let key in res.data.price) {
          prices.push(Number(res.data.price[key]));
          xAxis.push(key);
        }
        for (let key in res.data.quantity) {
          quantitys.push(Number(res.data.quantity[key]));
        }
      }
      document.getElementById("countSalesByDays").id = "countSalesByYear";
      let myChart = this.$echarts.init(
        document.getElementById("countSalesByYear")
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
        },
        legend: {},
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 30,
            },
            data: xAxis,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "销售额",
            // min: 0,
            // max: 250,
            position: "right",
            axisLabel: {
              formatter: "{value} ¥",
            },
          },
          {
            type: "value",
            name: "订单数",
            // min: 0,
            // max: 25,
            position: "left",
            axisLabel: {
              formatter: "{value} 个",
            },
          },
        ],
        series: [
          {
            name: "销售额",
            type: "bar",
            yAxisIndex: 0,
            data: prices,
          },
          {
            name: "订单数",
            type: "line",
            smooth: true,
            yAxisIndex: 1,
            data: quantitys,
          },
        ],
      };
      myChart.setOption(option);
      document.getElementById("countSalesByYear").id = "countSalesByDays";
      // this.showCountSalesByDays = false;
      // this.showCountSalesByMonth = false;
      // this.showCountSalesByYear = true;
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 30px 0;
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
        left: 220px;
        z-index: 100000;
      }

      .btn3 {
        position: absolute;
        top: 5px;
        left: 280px;
        z-index: 100000;
      }

      .btn4 {
        position: absolute;
        top: 5px;
        left: 350px;
        z-index: 100000;
      }
    }
  }
}

.title-top {
  height: 100px;
}

.panel-group {
  margin-top: 0px;
  height: 100px;

  .card-panel-col {
    margin-bottom: 32px;
    // height: 100px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      text-align: center;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;

        width: 100%;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

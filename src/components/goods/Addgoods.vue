<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-row :gutter="22">
          <el-col :span="10">
            <el-form-item label="商品图片">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品轮播图">
              <el-upload
                :action="uploadURL"
                list-type="picture-card"
                :on-success="handleSuccess"
                :on-remove="handleOnremove"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="res" slot-scope="{ res }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="res.path"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(res)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(res)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="一级分类" prop="classifyParentId">
              <el-select
                v-model="addForm.classifyParentId"
                placeholder="请选择评论对象"
                @change="choose"
              >
                <el-option
                  v-for="item in cateList"
                  :key="item.classifyId"
                  :label="item.classifyName"
                  :value="item.classifyId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="二级分类" prop="classifyId">
              <el-select v-model="addForm.classifyId" placeholder="请选择">
                <el-option
                  v-for="item in goodsList"
                  :key="item.classifyId"
                  :label="item.classifyName"
                  :value="item.classifyId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="addForm.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品描述" prop="goodsDescribe">
              <el-input v-model="addForm.goodsDescribe"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="商品默认现价" prop="goodsNewPrice">
              <el-input v-model="addForm.goodsNewPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品默认原价" prop="goodsOldPrice">
              <el-input v-model="addForm.goodsOldPrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="商品库存" prop="goodsStock">
              <el-input v-model="addForm.goodsStock"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品原价" prop="goodsPrice">
              <el-ichooseNormnput v-model="addForm.goodsPrice"></el-ichooseNormnput>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="选择配置">
              <el-select
                v-model="normsName"
                placeholder="请选择评论对象"
                @change="chooseNorm"
              >
                <el-option
                  v-for="item in normList"
                  :key="item.normsId"
                  :label="item.normsName"
                  :value="item.normsName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-button @click="getTable">确定</el-button>
          </el-col> -->
        </el-row>
        <div class="norms" v-for="item in list" :key="item.normsName">
          <span class="normsName">{{ item.normsName }}</span>
          <span class="close" @click="removeNorm(item)"
            ><i class="el-icon-circle-close"></i
          ></span>
          <div>
            <el-tag
              v-for="(items, i) in item.goodsNormsEntities"
              :key="i"
              closable
              @close="handleClose(items, item.goodsNormsEntities,item.normsName)"
            >
              {{ items.normsValue }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="normsValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(item.goodsNormsEntities,item.normsName)"
              @blur="handleInputConfirm(item.goodsNormsEntities,item.normsName)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput()"
              >+ New Tag</el-button
            >
          </div>
        </div>
        <el-button type="primary" class="btnAdd" @click="add"
          >添加公告</el-button
        >
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {},
      cateList: [],
      goodsList: [],
      addFormRules: {
        articlesClassifyId: [
          { required: true, message: "请选择公告分类", trigger: "blur" }
        ],
        articlesTitle: [
          { required: true, message: "请输入公告标题", trigger: "blur" }
        ],
        articlesAuthor: [
          { required: true, message: "请输入作者", trigger: "blur" }
        ],
        articlesDescribe: [
          { required: true, message: "请输入公告描述", trigger: "blur" }
        ]
      },
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      uploadURL: "http://1.15.186.9:8006/api/v1/upload",
      imageUrl: "",
      isShow: true,
      subImageList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      imgPath: "",
      normList: [],
      list: [],
      normsName: "",
      inputVisible: false,
      normsValue: "",
      normsValueList: [],
      normsNameList: [],
      alist: [],
      blist: [],
      allList: [],
      chooseNorms: [],
    };
  },
  created() {
    this.getCateList();
    this.getNormList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.post(
        "/api/v1/goodsClassify/search",
        {}
      );

      if (res.code !== 200) {
        return this.$message.error("获取商品分类失败!");
      }

      this.cateList = res.data.data;
    },
    async getNormList() {
      const { data: res } = await this.$http.post(
        "/api/v1/goodsNorms/search",
        {}
      );

      if (res.code !== 200) {
        return this.$message.error("获取商品分类失败!");
      }

      this.normList = res.data.data;
      //   console.log(this.normList);
    },
    async chooseNorm(val) {
      this.normsValueList = [];
      const { data: res } = await this.$http.post("/api/v1/goodsNorms/search", {
        normsName: val
      });

      if (res.code !== 200) {
        return this.$message.error("获取商品分类失败!");
      }
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].normsName === val) {
          return false;
        }
      }
      this.list.push(res.data.data[0]);
      this.normsNameList.push(val);
      this.chooseNorms = [];
      for (let i = 0;i < res.data.data[0].goodsNormsEntities.length; i++){
          let temp = {}
          temp.normsName = res.data.data[0].normsName;
          temp.normsValue = res.data.data[0].goodsNormsEntities[i].normsValue;
          this.chooseNorms.push(temp)
      }
      // console.log(this.chooseNorms)
      //第一次选取配置，结果集直接赋值
      if (this.allList == undefined || this.allList.length <= 0){
        for (let i = 0; i < this.chooseNorms.length; i++){
            let temp = {}
            this.$set(temp,this.chooseNorms[i].normsName,this.chooseNorms[i].normsValue)
            // temp[`${this.chooseNorms[i].normsName}`]=this.chooseNorms[i].normsValue
            this.allList.push(temp);
        }
        //结果集不为空，直接相乘得出最新结果集
      } else{
        let tempList = []
        for (let i = 0; i < this.allList.length; i++){
          for (let j = 0; j < this.chooseNorms.length;j++){
              let temp = {}
              temp = JSON.parse(JSON.stringify(this.allList[i]));
              // console.log(temp)
              this.$set(temp,this.chooseNorms[j].normsName,this.chooseNorms[j].normsValue);
              // temp[`${this.chooseNorms[j].normsName}`]=this.chooseNorms[j].normsValue
              // console.log('temp',temp)
              tempList.push(temp)
              // console.log(tempList)
          }
        }
        // console.log("tempList",tempList)
        this.allList = tempList;
      }
      // console.log(this.allList)
    },
    removeNorm(item) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i] === item) {
          this.list.splice(i, 1);
          i--;
        }
      }
      for (let j = 0; j < this.normsNameList.length; j++) {
        if (this.normsNameList[j] === item.normsName) {
          this.normsNameList.splice(j, 1);
          j--;
        }
      }
      //将包含删除normsName所有对象的该属性删除
      for (let k = 0;k < this.allList.length;k++){
        this.$delete(this.allList[k],item.normsName)
      }
      //去重
      for (let i = 0; i < this.allList.length;i++){
        for (let j = i + 1;j < this.allList.length; j++){
          let r = JSON.stringify(this.allList[i]);
          let l = JSON.stringify(this.allList[j]);
          if ( r == l){
            this.allList.splice(j, 1);
            j--
          }
        }
      }
      // this.allList = new Set(this.allList)
      // console.log("allList" , this.allList);
      //   console.log(this.normsNameList);
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项!");
        }
        //  发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post(
          "/api/v1/articles/add",
          this.addForm
        );
        if (res.code !== 200) {
          return this.$message.error("添加公告失败!");
        }
        this.$message.success("添加公告成功!");
        this.$router.push("/invoice");
      });
    },
    async choose(val) {
      const { data: res } = await this.$http.post(
        "/api/v1/goodsClassify/search",
        {
          classifyId: val
        }
      );
      this.goodsList = res.data.data[0].goodsClassifyEntities;
      console.log(this.goodsList);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path;
    },
    handleSuccess(res, file) {
      this.userPicture = res.path;
      this.subImageList.push(this.userPicture);
      console.log(this.subImageList);
    },
    handleRemove(res) {
      console.log(111);
      console.log(res);
    },
    handlePictureCardPreview(res) {
      this.dialogImageUrl = res.path;
      this.dialogVisible = true;
    },
    handleOnremove(file, fileList) {
      for (let i = 0; i < this.subImageList.length; i++) {
        if (this.subImageList[i] === file.response.path) {
          this.subImageList.splice(i, 1);
          i--;
        }
      }
    },
    handleInputConfirm(item,normsName) {
      this.normsValueList = [];
      if (this.normsValue.trim().length === 0) {
        this.normsValue = "";
        this.inputVisible = false;
        return;
      }
      var a = { normsValue: this.normsValue };
      item.push(a);
      //将该属性名从所有对象中移除
      for (let k = 0;k < this.allList.length;k++){
        this.$delete(this.allList[k],normsName)
      }
      //去重
      for (let i = 0; i < this.allList.length;i++){
        for (let j = i + 1;j < this.allList.length; j++){
          let r = JSON.stringify(this.allList[i]);
          let l = JSON.stringify(this.allList[j]);
          if ( r == l){
            this.allList.splice(j, 1);
            j--
          }
        }
      }
      //重新组合
      console.log("normsName",normsName)
      console.log("item",item)
      console.log("oAllList",this.allList)
      let tempList = []
        for (let i = 0; i < this.allList.length; i++){
          for (let j = 0; j < item.length;j++){
              let temp = {};
              temp = JSON.parse(JSON.stringify(this.allList[i]));
              this.$set(temp,normsName,item[j].normsValue);
              tempList.push(temp)
          }
        }
        // console.log("tempList",tempList)
      this.allList = tempList;
      this.normsValue = "";
      this.inputVisible = false;
      console.log("new",this.allList)
    },
    showInput() {
      this.inputVisible = true;
    },
    handleClose(items, item,name) {
      item.splice(item.indexOf(items), 1);
      //将删除的尺码从结果集中删除
      for (let i = 0; i < this.allList.length;i++){
        if (this.allList[i][`${name}`] === items.normsValue){
          this.allList.splice(i,1);
          i--;
        }
      }
    console.log("allList",this.allList)
    },
    getTable() {
      // var adist = [];
      // for (var i = 0; i < this.list.length; i++) {
      //   let temp = [];
      //   for (var j = 0; j < this.list[i].goodsNormsEntities.length; j++) {
      //     temp.push(this.list[i].goodsNormsEntities[j].normsValue);
      //   }
      //   adist.push(temp);
      // }
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 100px;
  display: block;
}
.avatars {
  width: 150px;
  height: 100px;
  display: block;
  position: absolute;
}
/deep/ .el-upload--picture-card {
  width: 150px;
  height: 100px;
  line-height: 100px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
  height: 100px;
}
/deep/ .avatar-uploader {
  display: flex;
  justify-content: flex-start;
  padding-bottom: 20px;
}
.el-tag {
  margin: 10px;
}
.close {
  margin-left: 20px;
  cursor: pointer;
}
.normsName {
  margin-left: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>

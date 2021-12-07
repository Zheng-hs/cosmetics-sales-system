<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改公告</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="修改公告信息"
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
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="公告分类" prop="articlesClassifyId">
              <el-select
                v-model="addForm.articlesClassifyId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in articlesList"
                  :key="item.articlesClassifyId"
                  :label="item.articlesClassifyName"
                  :value="item.articlesClassifyId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="公告标题" prop="articlesTitle">
              <el-input v-model="addForm.articlesTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="作者" prop="articlesAuthor">
              <el-input v-model="addForm.articlesAuthor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="公告描述" prop="articlesDescribe">
              <el-input v-model="addForm.articlesDescribe"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 图片上传组件辅助-->
        <el-upload
          class="avatar-uploader"
          :action="serverUrl"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload"
        >
        </el-upload>
        <!-- 富文本编辑器组件 -->
        <quill-editor
          v-model="addForm.articlesContent"
          ref="myQuillEditor"
          :options="editorOption"
        ></quill-editor>
        <el-button type="primary" class="btnAdd" @click="add"
          >修改公告</el-button
        >
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];
var token = sessionStorage.getItem('token')
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {},
      cateList: [],
      articlesList: [],
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
      serverUrl: "http://1.15.186.9:8006/api/v1/upload", // 这里写你要上传的图片服务器地址
      header: { Authorization: token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      detailContent: "", // 富文本内容
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      } // 富文本编辑器配置
    };
  },
  created() {
    this.getCateList();
    this.getList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.post(
        "/api/v1/articlesClassify/search",
        {}
      );
      this.articlesList = res.data.data;
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项!");
        }
        //  发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post(
          "/api/v1/articles/update",
          this.addForm
        );
        if (res.code !== 200) {
          return this.$message.error("修改公告失败!");
        }
        this.$message.success("修改公告成功!");
        this.$router.push("/invoice");
      });
    },
    getList() {
        this.addForm = this.$route.query
    },
    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },

    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
    //   console.log(quill);
      // 如果上传成功
      if (res.status === 1 && res.path !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.path为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.path);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },

    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
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
</style>

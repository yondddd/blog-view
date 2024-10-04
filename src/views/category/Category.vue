<template>
  <div>
    <div class="ui top segment" style="text-align: center">
      <h2 class="m-text-500">分类 {{ categoryName }} 下的文章</h2>
    </div>
    <BlogList :getBlogList="getBlogList" :blogList="blogList" :pageNo="pageNo" :total="total" />
  </div>
</template>

<script>
import BlogList from "@/components/blog/BlogList";
import { getBlogList } from "@/api/blog";
import { mapState } from 'vuex';

export default {
  name: "Category",
  components: { BlogList },
  data () {
    return {
      blogList: [],
      pageNo: 1,
      total: 0,
    }
  },
  watch: {
    '$route.fullPath' () {
      if (this.$route.name === 'category') {
        this.getBlogList()
      }
    }
  },
  created () {
    this.getBlogList()
  },
  computed: {
    ...mapState(['categoryList']),
    categoryId () {
      const id = parseInt(this.$route.params.name, 10);
      return isNaN(id) ? -1 : id;
    },
    categoryName () {
      if (!this.categoryList || this.categoryList.length === 0) {
        return '加载中...';
      }
      const category = this.categoryList.find(cat => cat.id === this.categoryId);
      return category ? category.name : '未知分类';
    }
  },
  methods: {
    getBlogList (pageNo = 1) {
      const req = {
        pageNo: pageNo,
        pageSize: 5,
        categoryId: this.categoryId
      }
      getBlogList(req).then(res => {
        if (res.code === 200) {
          this.blogList = res.data
          this.total = res.total
          this.$nextTick(() => {
            Prism.highlightAll()
          })
        } else {
          this.msgError(res.msg)
        }
      }).catch(() => {
        this.msgError("请求失败")
      })
    }
  }
}
</script>

<style scoped></style>
<template>
  <div>
    <div class="ui top segment" style="text-align: center">
      <h2 class="m-text-500">标签 {{ tagName }} 下的文章</h2>
    </div>
    <BlogList :getBlogList="getBlogList" :blogList="blogList" :pageNo="pageNo" :total="total" />
  </div>
</template>

<script>
import BlogList from "@/components/blog/BlogList";
import { getBlogList } from "@/api/blog";
import { mapState } from 'vuex';

export default {
  name: "Tag",
  components: { BlogList },
  data () {
    return {
      blogList: [],
      pageNo: 1,
      total: 0,
    }
  },
  watch: {
    //在当前组件被重用时，要重新获取博客列表
    '$route.fullPath' () {
      if (this.$route.name === 'tag') {
        this.getBlogList()
      }
    }
  },
  created () {
    this.getBlogList()
  },
  computed: {
    ...mapState(['tagList']),
    tagId () {
      const id = parseInt(this.$route.params.name, 10);
      return isNaN(id) ? -1 : id;
    },
    tagName () {
      if (!this.tagList || this.tagList.length === 0) {
        return '加载中...';
      }
      const tag = this.tagList.find(cat => cat.id === this.tagId);
      return tag ? tag.name : '未知标签';
    }
  },
  methods: {
    getBlogList (pageNo = 1) {
      const req = {
        pageNo: pageNo,
        pageSize: 5,
        tagId: this.tagId
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
<template>
  <div>
    <BlogList :getBlogList="getBlogList" :blogList="blogList" :pageNo="pageNo" :total="total" />
  </div>
</template>

<script>
import BlogList from "@/components/blog/BlogList";
import { getBlogList } from "@/api/blog";
import { SET_IS_BLOG_TO_HOME } from "../../store/mutations-types";

export default {
  name: "Home",
  components: { BlogList },
  data () {
    return {
      blogList: [],
      pageNo: 1,
      total: 0,
      getBlogListFinish: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'blog') {
        vm.$store.commit(SET_IS_BLOG_TO_HOME, false)
        vm.getBlogList()
      } else {
        if (!vm.getBlogListFinish) {
          vm.getBlogList()
        }
        vm.$store.commit(SET_IS_BLOG_TO_HOME, true)
      }
    })
  },
  methods: {
    getBlogList (pageNo = 1) {  // Set default value to 1
      const req = {
        pageNo: pageNo,
        pageSize: 5
      }
      getBlogList(req).then(res => {
        if (res.code === 200) {
          this.blogList = res.data
          this.pageNo = res.pageNo
          this.total = res.total
          this.$nextTick(() => {
            Prism.highlightAll()
          })
          this.getBlogListFinish = true
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
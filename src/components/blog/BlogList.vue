<template>
  <div>
    <!--content-->
    <BlogItem :blogList="blogList" v-viewer />
    <!--分页-->
    <Pagination :getBlogList="getBlogList" :pageNo="pageNo" :total="total" :pageSize="pageSize" />
  </div>
</template>

<script>
import BlogItem from "./BlogItem";
import Pagination from "./Pagination";

export default {
  name: "BlogList",
  components: { Pagination, BlogItem },
  props: {
    getBlogList: {
      type: Function,
      required: true
    },
    blogList: {
      type: Array,
      required: true
    },
    pageNo: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      pageSize: 5
    }
  }
}
</script>

<style scoped></style>
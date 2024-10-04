<template>
  <div class="ui bottom" style="text-align:center">
    <el-pagination @current-change="handleCurrentChange" :current-page="pageNo" :total="total" :page-size="pageSize"
      layout="prev, pager, next" background hide-on-single-page>
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "Pagination",
  props: {
    getBlogList: {
      type: Function,
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
  },
  activated () {
    this.$nextTick(() => {
      if (!this.isBlogToHome) {
        this.$emit('update:pageNo', 1)
      }
    })
  },
  computed: {
    ...mapState(['isBlogToHome', 'clientSize'])
  },
  methods: {
    handleCurrentChange (newPage) {
      if (this.$route.name === 'home') {
        window.scrollTo({ top: this.clientSize.clientHeight, behavior: 'smooth' })
      } else {
        this.scrollToTop()
      }
      this.$emit('update:pageNo', newPage)
      this.getBlogList(newPage)
    },
  }
}
</script>

<style>
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #ffffff !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #409EFF !important;
}
</style>
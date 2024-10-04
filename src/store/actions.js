import {
  SAVE_COMMENT_RESULT,
  SET_PARENT_COMMENT_ID,
  RESET_COMMENT_FORM,
  SET_BLOG_PASSWORD_DIALOG_VISIBLE,
  SET_BLOG_PASSWORD_FORM,
} from "./mutations-types";

import { getCommentListByQuery, submitComment } from "@/api/comment";
import { Message, Notification } from "element-ui";
import router from "../router";
import tvMapper from "@/plugins/tvMapper.json";
import aruMapper from "@/plugins/aruMapper.json";
import paopaoMapper from "@/plugins/paopaoMapper.json";
import sanitizeHtml from "sanitize-html";

export default {
  getCommentList({ commit, rootState }) {
    //密码保护的文章，需要发送密码验证通过后保存在localStorage的Token
    const blogToken = window.localStorage.getItem(`blog${rootState.commentQuery.blogId}`);
    //如果有则发送博主身份Token
    const adminToken = window.localStorage.getItem("adminToken");
    const token = adminToken ? adminToken : blogToken ? blogToken : "";

    function replaceEmoji(comment, emoji) {
      comment.content = comment.content.replace(
        new RegExp(emoji.reg, "g"),
        `<img src="${emoji.src}">`
      );
    }

    function convertEmoji(comment) {
      tvMapper.forEach(emoji => {
        replaceEmoji(comment, emoji);
      });
      aruMapper.forEach(emoji => {
        replaceEmoji(comment, emoji);
      });
      paopaoMapper.forEach(emoji => {
        replaceEmoji(comment, emoji);
      });
    }

    getCommentListByQuery(token, rootState.commentQuery)
      .then(res => {
        if (res.code === 200) {
          const sanitizeHtmlConfig = {
            allowedTags: [],
            allowedAttributes: false,
            disallowedTagsMode: "recursiveEscape",
          };

          const processComment = comment => {
            comment.content = sanitizeHtml(comment.content, sanitizeHtmlConfig);
            if (comment.content.includes("@[")) {
              convertEmoji(comment);
            }
          };

          res.data.forEach(comment => {
            processComment(comment);
            comment.replyComments.forEach(processComment);
          });

          commit(SAVE_COMMENT_RESULT, res);
        } else {
          throw new Error(`Server responded with code ${res.code}`);
        }
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
        Message.error(`获取评论失败: ${error.message}`);
      });
  },
  submitCommentForm({ rootState, dispatch, commit }, token) {
    let form = { ...rootState.commentForm };
    form.page = rootState.commentQuery.page;
    form.blogId = rootState.commentQuery.blogId;
    form.parentCommentId = rootState.parentCommentId;
    submitComment(token, form)
      .then(response => {
        // Axios wraps the response in a data property
        const res = response;
        if (res.code === 200) {
          Notification({
            title: res.msg,
            type: "success",
          });
          commit(SET_PARENT_COMMENT_ID, 0);
          commit(RESET_COMMENT_FORM);
          dispatch("getCommentList");
        } else if (res.code === 403) {
          // Handle the 403 error specifically
          Notification({
            title: "评论失败",
            message: res.msg, // This will show "30秒内只能提交一次评论"
            type: "warning",
          });
        } else {
          // Handle other error codes
          Notification({
            title: "评论失败",
            message: res.msg || "提交评论时发生错误",
            type: "error",
          });
        }
      })
      .catch(error => {
        console.error("Comment submission error:", error);
        if (error.response && error.response.status === 403) {
          // Handle 403 errors that might be caught here
          Notification({
            title: "评论失败",
            message: error.response.data.msg || "30秒内只能提交一次评论",
            type: "warning",
          });
        } else {
          // Handle other unexpected errors
          Notification({
            title: "评论失败",
            message: "提交评论时发生未知错误，请稍后重试",
            type: "error",
          });
        }
      });
  },
  goBlogPage({ commit }, blog) {
    if (blog.privacy) {
      const adminToken = window.localStorage.getItem("adminToken");
      const blogToken = window.localStorage.getItem(`blog${blog.id}`);
      //对于密码保护文章，博主身份Token和经过密码验证后的Token都可以跳转路由，再由后端验证Token有效性
      if (adminToken || blogToken) {
        return router.push(`/blog/${blog.id}`);
      }
      commit(SET_BLOG_PASSWORD_FORM, { blogId: blog.id, password: "" });
      commit(SET_BLOG_PASSWORD_DIALOG_VISIBLE, true);
    } else {
      router.push(`/blog/${blog.id}`);
    }
  },
};

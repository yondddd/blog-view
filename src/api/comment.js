import axios from "@/plugins/axios";

export function getCommentListByQuery(token, CommentPageViewReq) {
  return axios({
    url: "comment/page",
    method: "post",
    headers: {
      Authorization: token,
    },
    data: CommentPageViewReq,
  });
}

export function submitComment(token, form) {
  return axios({
    url: "comment/leave",
    method: "POST",
    headers: {
      Authorization: token,
    },
    data: {
      ...form,
    },
  });
}

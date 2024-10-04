import axios from "@/plugins/axios";

export function getBlogList(BlogPageReq) {
  return axios({
    url: "blog/page",
    method: "post",
    data: BlogPageReq,
  });
}

export function getBlogById(token, BlogDetailReq) {
  return axios({
    url: "blog/detail",
    method: "post",
    headers: {
      Authorization: token,
    },
    data: BlogDetailReq,
  });
}

export function checkBlogPassword(BlogCheckReq) {
  return axios({
    url: "blog/checkPassword",
    method: "POST",
    data: BlogCheckReq,
  });
}

export function getSearchBlogList(BlogSearchReq) {
  return axios({
    url: "blog/search",
    method: "post",
    data: BlogSearchReq,
  });
}

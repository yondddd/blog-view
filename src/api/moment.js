import axios from "@/plugins/axios";

export function pageMoment(token, MomentPageReq) {
  return axios({
    url: "moment/page",
    method: "post",
    headers: {
      Authorization: token,
    },
    data: MomentPageReq,
  });
}

export function likeMoment(id) {
  return axios({
    url: `moment/like/${id}`,
    method: "POST",
  });
}

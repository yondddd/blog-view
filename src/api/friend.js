import axios from "@/plugins/axios";

export function pageFriend() {
  return axios({
    url: "friend/list",
    method: "GET",
  });
}

export function friendClick(FriendClickReq) {
  return axios({
    url: "friend",
    method: "POST",
    data: FriendClickReq,
  });
}

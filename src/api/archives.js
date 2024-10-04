import axios from "@/plugins/axios";

export function getArchives() {
  return axios({
    url: "archive/list",
    method: "GET",
  });
}

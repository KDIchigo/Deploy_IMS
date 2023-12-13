import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  timeout: 300000,
});

const noAuth = [
  {
    url: "/User/login",
    method: "post",
  },
  {
    url: "/User/register",
    method: "post",
  },
];

const onRequest = (config) => {
  const { url, method } = config;
  const permitAuthen = noAuth.some((o) => o.url === url && o.method === method);
  if (!permitAuthen) {
    const accessToken = localStorage.getItem("token");
    config.headers = { Authorization: `Bearer ${accessToken}` };
  }

  return config;
};
const onResponse = (response) => {
  return { data: response.data };
};
const onError = (error) => {
  return { err: error };
};
// const onError = (response) => {
//   console.log(response)
//   return { error: response.Message };
// }

const onStatus = (error) => {
  if (error.response.status >= 200 && error.response.status < 300) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return { err: error };
  } else {
    const statusCode = error.response.status;
    console.log(error);
    switch (statusCode) {
      case 400:
        error.customName = "Bad Request";
        break;
      case 401:
        error.customName = "Unauthorized";
        break;
      case 404:
        error.customName = "Not Found";
        break;
      default:
        error.customName = "Server Error";
    }
    return { err: error.response.data.Message };
  }
};

axiosClient.interceptors.request.use(onRequest);
axiosClient.interceptors.response.use(onResponse, onError);

export { axiosClient };

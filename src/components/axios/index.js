import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";

const abdElghanyUser = localStorage.getItem("AbdElghanyUser");
let user = null;

(function () {
  try {
    user = JSON.parse(abdElghanyUser);
  } catch (e) {
    localStorage.removeItem("AbdElghanyUser");
  }
})();

// interface AxiosOptions {
//     method: AxiosRequestConfig['method'];
//     config?: AxiosRequestConfig;
//     data?: any;
//     url: string;
//     headers?: AxiosRequestConfig['headers'];
//     timeout?: number;
//     file?: boolean;
// }

export const UserData = user;

export const Axios = async ({
  method,
  config,
  data,
  url,
  headers,
  timeout = 50000,
  file = false,
}) => {
  const source = axios.CancelToken.source();
  if (file) {
    data?.append("admin_id", user?.admin_id);
    data?.append("access_token", user?.token_value);
  }
  const axiosConfig = {
    method: method,
    url: url,
    data: file
      ? data
      : user
      ? { admin_id: user?.admin_id, token_value: user?.token_value, ...data }
      : data,
    headers: {
      ...headers,
      Authorization: `Bearer ${abdElghanyUser}`,
    },
    timeout: timeout,
    cancelToken: source.token,
    ...config,
  };

  try {
    // Request interceptor
    axios.interceptors.request.use((request) => {
      return request;
    });

    const response = await axios(axiosConfig);

    // Response interceptor
    axios.interceptors.response.use((response) => {
      return response;
    });
    if (response.data?.status == "out") {
      localStorage.removeItem("AbdElghanyUser");
      window.location.reload();
    }

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
    } else {
    }

    return error?.message;
  }
};

// Usage example:

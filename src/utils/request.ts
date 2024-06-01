import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import Qs from "qs";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
//传no和1时为表单状态，no为默认状态
export function post(url: string, params: any, dataType = "J", from = "0") {
  return new Promise((resolve, reject) => {
    service({
      method: "post",
      url,
      data:
        dataType == "no"
          ? params
          : dataType == "S"
            ? Qs.stringify(params)
            : Qs.parse(Qs.stringify(params)),
      headers: {
        "Content-Type":
          from == "1"
            ? "multipart/form-data;boundary = " + new Date().getTime()
            : "application/json;charset=UTF-8",
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url: string, params: any) {
  return new Promise((resolve, reject) => {
    service({
      method: "get",
      url,
      params,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
//传数组时
export function getOfQs(url: string, params: any) {
  return new Promise((resolve, reject) => {
    service({
      method: "get",
      url,
      params,
      paramsSerializer: (params) => Qs.stringify(params, { indices: false }),
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function delet(url: string, params: any) {
  return new Promise((resolve, reject) => {
    service({
      method: "delete",
      url,
      params,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function put(url: string, params: any, dataType = "J") {
  return new Promise((resolve, reject) => {
    service({
      method: "put",
      url,
      data:
        dataType == "no"
          ? params
          : dataType == "S"
            ? Qs.stringify(params)
            : Qs.parse(Qs.stringify(params)),
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    if (code === "00000") {
      return response.data;
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response;
    }

    ElMessage.error(msg || "系统出错");
    return Promise.reject(new Error(msg || "Error"));
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期,重新登录
      if (code === "A0230") {
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          const userStore = useUserStoreHook();
          // userStore.resetToken().then(() => {
          //   location.reload();
          // });
        });
      } else {
        ElMessage.error(msg || "系统出错");
      }
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;

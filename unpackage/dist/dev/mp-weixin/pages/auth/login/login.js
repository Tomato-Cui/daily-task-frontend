"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const handleLogin = () => {
      loading.value = true;
      common_vendor.wx$1.login({
        success: (res) => {
          if (res.code) {
            common_vendor.wx$1.request({
              url: "https://your-server.com/api/login",
              method: "POST",
              data: {
                code: res.code
              },
              success: (response) => {
                loading.value = false;
                const { openid, session_key } = response.data;
                common_vendor.index.__f__("log", "at pages/auth/login/login.vue:38", "用户 openid:", openid);
                common_vendor.index.setStorageSync("userInfo", response.data);
                common_vendor.index.showToast({
                  title: "登录成功",
                  icon: "success",
                  duration: 2e3,
                  success: () => {
                    setTimeout(() => {
                      common_vendor.index.switchTab({
                        url: "/pages/tasks/list/list"
                      });
                    }, 2e3);
                  }
                });
              },
              fail: (error) => {
                loading.value = false;
                common_vendor.index.__f__("error", "at pages/auth/login/login.vue:59", "请求失败", error);
                common_vendor.index.showToast({
                  title: "登录失败，请重试",
                  icon: "none"
                });
              }
            });
          } else {
            loading.value = false;
            common_vendor.index.__f__("log", "at pages/auth/login/login.vue:68", "登录失败！" + res.errMsg);
            common_vendor.index.showToast({
              title: "登录失败，请重试",
              icon: "none"
            });
          }
        },
        fail: () => {
          loading.value = false;
          common_vendor.index.showToast({
            title: "登录失败，请重试",
            icon: "none"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(handleLogin)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/auth/login/login.js.map

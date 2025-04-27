"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userInfo = common_vendor.ref({
      avatar: "",
      nickname: "张三",
      phone: "138****1234"
    });
    const userRole = common_vendor.ref("worker");
    common_vendor.onMounted(() => {
      const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
      if (cachedUserInfo) {
        userInfo.value = cachedUserInfo;
      }
      const cachedUserRole = common_vendor.index.getStorageSync("userRole");
      if (cachedUserRole) {
        userRole.value = cachedUserRole;
      }
    });
    const switchRole = (role) => {
      if (userRole.value === role)
        return;
      userRole.value = role;
      common_vendor.index.setStorageSync("userRole", role);
      common_vendor.index.showToast({
        title: role === "employer" ? "已切换为雇佣者" : "已切换为求职者",
        icon: "none"
      });
      const currentPages = getCurrentPages();
      const currentPage = currentPages[currentPages.length - 1];
      if (currentPage && currentPage.route && ["pages/tasks/list/list", "pages/applications/status/status", "pages/users/profile/profile"].includes(currentPage.route)) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/" + currentPage.route
          });
        }, 500);
      }
    };
    const navigateTo = (url) => {
      if (url.includes("/pages/applications/status/status") || url.includes("/pages/tasks/list/list")) {
        common_vendor.index.switchTab({
          url
        });
      } else {
        common_vendor.index.navigateTo({
          url
        });
      }
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("userRole");
            common_vendor.index.reLaunch({
              url: "/pages/auth/login/login"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatar || "/static/default-avatar.png",
        b: common_vendor.t(userInfo.value.nickname || "未登录"),
        c: common_vendor.t(userInfo.value.phone || "未绑定手机号"),
        d: common_vendor.n(userRole.value === "employer" ? "role-active" : "role-inactive"),
        e: common_vendor.o(($event) => switchRole("employer")),
        f: common_vendor.n(userRole.value === "worker" ? "role-active" : "role-inactive"),
        g: common_vendor.o(($event) => switchRole("worker")),
        h: common_vendor.o(($event) => navigateTo("/pages/users/editProfile/editProfile")),
        i: common_vendor.o(($event) => navigateTo("/pages/tasks/list/list")),
        j: userRole.value === "employer"
      }, userRole.value === "employer" ? {
        k: common_vendor.o(($event) => navigateTo("/pages/tasks/create/create"))
      } : {}, {
        l: userRole.value === "worker"
      }, userRole.value === "worker" ? {
        m: common_vendor.o(($event) => navigateTo("/pages/applications/status/status"))
      } : {}, {
        n: common_vendor.o(($event) => navigateTo("/pages/payments/history/history")),
        o: common_vendor.o(logout)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/users/profile/profile.js.map

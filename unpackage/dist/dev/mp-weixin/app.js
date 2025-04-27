"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/auth/login/login.js";
  "./pages/auth/register/register.js";
  "./pages/auth/forgetPassword/forgetPassword.js";
  "./pages/users/profile/profile.js";
  "./pages/users/editProfile/editProfile.js";
  "./pages/tasks/list/list.js";
  "./pages/tasks/detail/detail.js";
  "./pages/tasks/create/create.js";
  "./pages/applications/apply/apply.js";
  "./pages/applications/status/status.js";
  "./pages/payments/history/history.js";
  "./pages/payments/payment/payment.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map

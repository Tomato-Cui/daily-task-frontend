"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      taskId: 0,
      // 任务ID
      task: {
        id: 0,
        title: "",
        status: "open",
        reward: 0,
        deadline: /* @__PURE__ */ new Date(),
        publisher: {
          id: 0,
          name: ""
        }
      },
      form: {
        phone: "",
        introduction: "",
        expectedReward: "",
        additionalInfo: ""
      }
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/applications/apply/apply.vue:101", "apply页面接收到的参数:", options);
    if (options.id) {
      this.taskId = Number(options.id);
      this.fetchTaskInfo();
    } else {
      common_vendor.index.showToast({
        title: "参数错误",
        icon: "none"
      });
    }
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.phone) {
      this.form.phone = userInfo.phone;
    }
  },
  methods: {
    // 获取任务信息
    fetchTaskInfo() {
      if (!this.taskId) {
        common_vendor.index.showToast({
          title: "任务ID不存在",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        this.task = {
          id: this.taskId,
          title: "设计一个企业Logo",
          status: "open",
          reward: 500,
          deadline: /* @__PURE__ */ new Date("2023-12-30"),
          publisher: {
            id: 1,
            name: "张企业",
            avatar: "http://iph.href.lu/50x50"
          }
        };
        this.form.expectedReward = this.task.reward;
        common_vendor.index.__f__("log", "at pages/applications/apply/apply.vue:158", "已加载任务信息：", this.task);
      }, 500);
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 提交申请
    submitApplication() {
      if (!this.form.phone) {
        common_vendor.index.showToast({
          title: "请输入联系电话",
          icon: "none"
        });
        return;
      }
      if (!this.form.introduction || this.form.introduction.length < 100) {
        common_vendor.index.showToast({
          title: "个人介绍不能少于100字",
          icon: "none"
        });
        return;
      }
      if (!this.form.expectedReward) {
        common_vendor.index.showToast({
          title: "请输入期望报酬",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "申请成功",
          content: "您的申请已提交，请等待雇主审核。",
          showCancel: false,
          success: () => {
            common_vendor.index.switchTab({
              url: "/pages/applications/status/status"
            });
          }
        });
      }, 1e3);
    },
    // 根据状态获取样式类
    getStatusClass(status) {
      switch (status) {
        case "open":
          return "status-open";
        case "in_progress":
          return "status-progress";
        case "completed":
          return "status-completed";
        case "closed":
          return "status-closed";
        default:
          return "status-completed";
      }
    },
    // 根据状态获取文本
    getStatusText(status) {
      switch (status) {
        case "open":
          return "招募中";
        case "in_progress":
          return "进行中";
        case "completed":
          return "已完成";
        case "closed":
          return "已关闭";
        default:
          return "未知";
      }
    },
    // 格式化日期
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.task.title),
    c: common_vendor.t($options.getStatusText($data.task.status)),
    d: common_vendor.n($options.getStatusClass($data.task.status)),
    e: common_vendor.t($data.task.reward),
    f: common_vendor.t($options.formatDate($data.task.deadline)),
    g: common_vendor.t($data.task.publisher.name),
    h: $data.form.phone,
    i: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    j: $data.form.introduction,
    k: common_vendor.o(($event) => $data.form.introduction = $event.detail.value),
    l: common_vendor.t($data.form.introduction.length),
    m: $data.form.expectedReward,
    n: common_vendor.o(($event) => $data.form.expectedReward = $event.detail.value),
    o: $data.form.additionalInfo,
    p: common_vendor.o(($event) => $data.form.additionalInfo = $event.detail.value),
    q: common_vendor.o((...args) => $options.submitApplication && $options.submitApplication(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/applications/apply/apply.js.map

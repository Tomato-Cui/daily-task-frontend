"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isLoading: true,
      // 添加加载状态标记
      task: {
        id: 0,
        title: "",
        description: "",
        reward: 0,
        publishTime: /* @__PURE__ */ new Date(),
        deadline: /* @__PURE__ */ new Date(),
        location: "",
        requiredPeople: 0,
        contactPerson: "",
        contactPhone: "",
        status: "open",
        // open, in_progress, completed, closed
        requirements: [],
        publisher: {
          id: 0,
          name: "",
          avatar: ""
        },
        applicants: []
      },
      userRole: "worker",
      // 当前用户角色
      isApplied: false,
      // 当前用户是否已申请
      isEmployer: false,
      // 当前用户是否是雇主
      taskId: 0
      // 通过URL参数传入的任务ID
    };
  },
  onLoad(options) {
    if (options.id) {
      this.taskId = options.id;
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      this.fetchTaskDetail();
    }
    const cachedUserRole = common_vendor.index.getStorageSync("userRole");
    if (cachedUserRole) {
      this.userRole = cachedUserRole;
    }
  },
  methods: {
    // 获取任务详情
    fetchTaskDetail() {
      setTimeout(() => {
        this.task = {
          id: this.taskId,
          title: "设计一个企业Logo",
          description: "需要设计一个现代化的企业Logo，要求简洁、大方，能够展现企业的专业形象。需要提供源文件和至少3种不同颜色方案。我们是一家科技公司，希望Logo能够体现创新和科技感。",
          reward: 500,
          publishTime: /* @__PURE__ */ new Date("2023-12-01"),
          deadline: /* @__PURE__ */ new Date("2023-12-30"),
          location: "远程工作",
          requiredPeople: 1,
          contactPerson: "张经理",
          contactPhone: "13800138000",
          status: "open",
          requirements: [
            "有平面设计经验",
            "熟练掌握PS、AI等设计软件",
            "有良好的沟通能力",
            "能够按时完成任务"
          ],
          publisher: {
            id: 1,
            name: "张企业",
            avatar: "http://iph.href.lu/50x50"
          },
          applicants: [
            {
              id: 101,
              name: "李设计",
              avatar: "http://iph.href.lu/50x50",
              applyTime: /* @__PURE__ */ new Date("2023-12-05"),
              status: ""
            },
            {
              id: 102,
              name: "王绘画",
              avatar: "http://iph.href.lu/50x50",
              applyTime: /* @__PURE__ */ new Date("2023-12-06"),
              status: ""
            }
          ]
        };
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo && userInfo.id === this.task.publisher.id) {
          this.isEmployer = true;
        }
        this.isApplied = Math.random() > 0.5;
        common_vendor.index.hideLoading();
        this.isLoading = false;
      }, 500);
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack({
        animationType: "fade-out",
        // 使用淡出动画
        animationDuration: 200
        // 设置动画持续时间较短
      });
    },
    // 申请任务
    applyTask() {
      common_vendor.index.navigateTo({
        url: `/pages/applications/apply/apply?id=${this.task.id}`
      });
    },
    // 取消申请
    cancelApply() {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确认取消申请此任务吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "取消中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              this.isApplied = false;
              common_vendor.index.showToast({
                title: "已取消申请"
              });
            }, 1e3);
          }
        }
      });
    },
    // 联系雇主
    contactEmployer() {
      common_vendor.index.makePhoneCall({
        phoneNumber: this.task.contactPhone,
        fail: () => {
          common_vendor.index.showToast({
            title: "拨打电话失败",
            icon: "none"
          });
        }
      });
    },
    // 完成任务
    completeTask() {
      common_vendor.index.showModal({
        title: "确认完成",
        content: "确认该任务已完成吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "提交中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              this.task.status = "completed";
              common_vendor.index.showToast({
                title: "已标记为完成"
              });
            }, 1e3);
          }
        }
      });
    },
    // 编辑任务
    editTask() {
      common_vendor.index.navigateTo({
        url: `/pages/tasks/edit/edit?id=${this.task.id}`
      });
    },
    // 关闭任务
    closeTask() {
      common_vendor.index.showModal({
        title: "确认关闭",
        content: "确认关闭此任务吗？关闭后将不再接受新的申请。",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "提交中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              this.task.status = "closed";
              common_vendor.index.showToast({
                title: "已关闭任务"
              });
            }, 1e3);
          }
        }
      });
    },
    // 接受申请者
    acceptApplicant(applicantId) {
      common_vendor.index.showModal({
        title: "确认接受",
        content: "确认接受此申请者吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              this.task.applicants.forEach((applicant) => {
                if (applicant.id === applicantId) {
                  applicant.status = "accepted";
                }
              });
              this.task.status = "in_progress";
              common_vendor.index.showToast({
                title: "已接受申请"
              });
            }, 1e3);
          }
        }
      });
    },
    // 拒绝申请者
    rejectApplicant(applicantId) {
      common_vendor.index.showModal({
        title: "确认拒绝",
        content: "确认拒绝此申请者吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              this.task.applicants.forEach((applicant) => {
                if (applicant.id === applicantId) {
                  applicant.status = "rejected";
                }
              });
              common_vendor.index.showToast({
                title: "已拒绝申请"
              });
            }, 1e3);
          }
        }
      });
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
    },
    // 查看申请列表
    viewApplications() {
      common_vendor.index.switchTab({
        url: "/pages/applications/status/status"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.isLoading
  }, $data.isLoading ? {} : common_vendor.e({
    c: common_vendor.t($data.task.title),
    d: common_vendor.t($options.getStatusText($data.task.status)),
    e: common_vendor.n($options.getStatusClass($data.task.status)),
    f: $data.task.publisher.avatar,
    g: common_vendor.t($data.task.publisher.name),
    h: common_vendor.t($options.formatDate($data.task.publishTime)),
    i: common_vendor.t($data.task.reward),
    j: common_vendor.t($options.formatDate($data.task.deadline)),
    k: common_vendor.t($data.task.location),
    l: common_vendor.t($data.task.requiredPeople),
    m: common_vendor.t($data.task.description),
    n: common_vendor.f($data.task.requirements, (requirement, index, i0) => {
      return {
        a: common_vendor.t(requirement),
        b: index
      };
    }),
    o: $data.isApplied || $data.isEmployer
  }, $data.isApplied || $data.isEmployer ? {
    p: common_vendor.t($data.task.contactPerson),
    q: common_vendor.t($data.task.contactPhone)
  } : {}, {
    r: $data.isEmployer && $data.task.applicants && $data.task.applicants.length > 0
  }, $data.isEmployer && $data.task.applicants && $data.task.applicants.length > 0 ? {
    s: common_vendor.t($data.task.applicants.length),
    t: common_vendor.f($data.task.applicants, (applicant, index, i0) => {
      return common_vendor.e({
        a: applicant.avatar,
        b: common_vendor.t(applicant.name),
        c: common_vendor.t($options.formatDate(applicant.applyTime))
      }, $data.task.status === "open" ? {
        d: common_vendor.o(($event) => $options.acceptApplicant(applicant.id), index),
        e: common_vendor.o(($event) => $options.rejectApplicant(applicant.id), index)
      } : applicant.status ? {
        g: common_vendor.t(applicant.status === "accepted" ? "已接受" : "已拒绝")
      } : {}, {
        f: applicant.status,
        h: index
      });
    }),
    v: $data.task.status === "open"
  } : {}, {
    w: $data.userRole === "worker"
  }, $data.userRole === "worker" ? common_vendor.e({
    x: !$data.isApplied && $data.task.status === "open"
  }, !$data.isApplied && $data.task.status === "open" ? {
    y: common_vendor.o((...args) => $options.applyTask && $options.applyTask(...args))
  } : $data.isApplied && $data.task.status === "open" ? {} : {}, {
    z: $data.isApplied && $data.task.status === "open",
    A: $data.isApplied && $data.task.status === "open"
  }, $data.isApplied && $data.task.status === "open" ? {
    B: common_vendor.o((...args) => $options.cancelApply && $options.cancelApply(...args))
  } : {}, {
    C: $data.isApplied && $data.task.status === "in_progress"
  }, $data.isApplied && $data.task.status === "in_progress" ? {
    D: common_vendor.o((...args) => $options.contactEmployer && $options.contactEmployer(...args))
  } : {}, {
    E: $data.isApplied && $data.task.status === "in_progress"
  }, $data.isApplied && $data.task.status === "in_progress" ? {
    F: common_vendor.o((...args) => $options.completeTask && $options.completeTask(...args))
  } : {}) : $data.userRole === "employer" && $data.isEmployer ? common_vendor.e({
    H: $data.task.applicants && $data.task.applicants.length > 0
  }, $data.task.applicants && $data.task.applicants.length > 0 ? {
    I: common_vendor.t($data.task.applicants.length),
    J: common_vendor.o((...args) => $options.viewApplications && $options.viewApplications(...args))
  } : {}, {
    K: $data.task.status === "open"
  }, $data.task.status === "open" ? {
    L: common_vendor.o((...args) => $options.editTask && $options.editTask(...args))
  } : {}, {
    M: $data.task.status === "open"
  }, $data.task.status === "open" ? {
    N: common_vendor.o((...args) => $options.closeTask && $options.closeTask(...args))
  } : {}, {
    O: $data.task.status === "in_progress"
  }, $data.task.status === "in_progress" ? {
    P: common_vendor.o((...args) => $options.completeTask && $options.completeTask(...args))
  } : {}) : {}, {
    G: $data.userRole === "employer" && $data.isEmployer
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tasks/detail/detail.js.map

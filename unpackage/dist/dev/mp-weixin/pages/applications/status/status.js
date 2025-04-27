"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userRole: "worker",
      // 用户角色: 'worker'(求职者) 或 'employer'(雇佣者)
      workerTabs: ["全部", "待审核", "已接受", "已拒绝"],
      employerTabs: ["全部", "待处理", "已接受", "已拒绝"],
      currentTab: 0,
      applications: [],
      // 求职者视角：我的申请列表
      myTasks: [],
      // 雇主视角：我发布的任务及申请者
      loading: false,
      pageNum: 1,
      pageSize: 10
    };
  },
  onLoad() {
    const cachedUserRole = common_vendor.index.getStorageSync("userRole");
    if (cachedUserRole) {
      this.userRole = cachedUserRole;
    }
    this.fetchApplications();
  },
  onShow() {
    this.pageNum = 1;
    this.applications = [];
    this.myTasks = [];
    this.fetchApplications();
  },
  methods: {
    // 获取申请列表
    fetchApplications() {
      this.loading = true;
      setTimeout(() => {
        if (this.userRole === "worker") {
          this.applications = [
            {
              id: 1001,
              task: {
                id: 1,
                title: "设计一个企业Logo",
                publisher: {
                  id: 101,
                  name: "张企业",
                  phone: "13800138000"
                }
              },
              applyTime: /* @__PURE__ */ new Date("2023-12-05"),
              expectedReward: 500,
              status: "pending"
              // pending, accepted, rejected
            },
            {
              id: 1002,
              task: {
                id: 2,
                title: "开发一个小程序页面",
                publisher: {
                  id: 102,
                  name: "李科技",
                  phone: "13900139000"
                }
              },
              applyTime: /* @__PURE__ */ new Date("2023-12-02"),
              expectedReward: 800,
              status: "accepted"
            },
            {
              id: 1003,
              task: {
                id: 3,
                title: "撰写产品介绍文案",
                publisher: {
                  id: 103,
                  name: "王营销",
                  phone: "13700137000"
                }
              },
              applyTime: /* @__PURE__ */ new Date("2023-11-28"),
              expectedReward: 300,
              status: "rejected"
            }
          ];
        } else {
          this.myTasks = [
            {
              id: 101,
              title: "招聘临时搬运工",
              reward: 400,
              status: "open",
              expanded: true,
              // 是否展开显示申请者列表
              applicants: [
                {
                  id: 201,
                  name: "李搬运",
                  avatar: "http://iph.href.lu/50x50",
                  phone: "138****5678",
                  introduction: "有多年搬运经验，力气大，速度快。",
                  expectedReward: 400,
                  additionalInfo: "可带助手一起完成工作",
                  applyTime: /* @__PURE__ */ new Date("2023-12-05"),
                  status: "pending"
                },
                {
                  id: 202,
                  name: "王力工",
                  avatar: "http://iph.href.lu/50x50",
                  phone: "139****1234",
                  introduction: "专业搬家公司员工，有丰富经验。",
                  expectedReward: 450,
                  additionalInfo: "",
                  applyTime: /* @__PURE__ */ new Date("2023-12-06"),
                  status: "pending"
                }
              ]
            },
            {
              id: 102,
              title: "活动现场发传单",
              reward: 300,
              status: "in_progress",
              expanded: false,
              applicants: [
                {
                  id: 203,
                  name: "张宣传",
                  avatar: "http://iph.href.lu/50x50",
                  phone: "136****2345",
                  introduction: "曾参与多个促销活动，经验丰富。",
                  expectedReward: 300,
                  additionalInfo: "",
                  applyTime: /* @__PURE__ */ new Date("2023-12-01"),
                  status: "accepted"
                },
                {
                  id: 204,
                  name: "刘活动",
                  avatar: "http://iph.href.lu/50x50",
                  phone: "135****6789",
                  introduction: "大学生，寻找兼职工作，有责任心。",
                  expectedReward: 280,
                  additionalInfo: "可以全天工作",
                  applyTime: /* @__PURE__ */ new Date("2023-12-02"),
                  status: "rejected"
                }
              ]
            }
          ];
        }
        this.loading = false;
      }, 500);
    },
    // 加载更多
    loadMore() {
      if (this.loading)
        return;
      this.pageNum++;
      this.fetchApplications();
    },
    // 查看申请详情（求职者）
    viewApplicationDetail(id) {
      const application = this.applications.find((item) => item.id === id);
      if (application) {
        common_vendor.index.navigateTo({
          url: `/pages/tasks/detail/detail?id=${application.task.id}`
        });
      }
    },
    // 取消申请（求职者）
    cancelApplication(id) {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确认取消此申请吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "取消中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              const index = this.applications.findIndex((item) => item.id === id);
              if (index !== -1) {
                this.applications.splice(index, 1);
              }
              common_vendor.index.showToast({
                title: "已取消申请",
                icon: "success"
              });
            }, 500);
          }
        }
      });
    },
    // 联系雇主（求职者）
    contactEmployer(phone) {
      if (!phone) {
        common_vendor.index.showToast({
          title: "联系电话不存在",
          icon: "none"
        });
        return;
      }
      common_vendor.index.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          common_vendor.index.showToast({
            title: "拨打电话失败",
            icon: "none"
          });
        }
      });
    },
    // 展开/收起申请者列表（雇主）
    toggleApplicationList(index) {
      this.myTasks[index].expanded = !this.myTasks[index].expanded;
    },
    // 接受申请者（雇主）
    acceptApplicant(taskId, applicantId) {
      common_vendor.index.showModal({
        title: "确认接受",
        content: "确认接受此申请者吗？接受后任务将进入进行中状态，其他申请者将自动被拒绝。",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              const taskIndex = this.myTasks.findIndex((task) => task.id === taskId);
              if (taskIndex !== -1) {
                this.myTasks[taskIndex].applicants.forEach((item) => {
                  if (item.id === applicantId) {
                    item.status = "accepted";
                  } else {
                    item.status = "rejected";
                  }
                });
                this.myTasks[taskIndex].status = "in_progress";
              }
              common_vendor.index.showToast({
                title: "已接受申请",
                icon: "success"
              });
            }, 500);
          }
        }
      });
    },
    // 拒绝申请者（雇主）
    rejectApplicant(taskId, applicantId) {
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
              const taskIndex = this.myTasks.findIndex((task) => task.id === taskId);
              if (taskIndex !== -1) {
                const applicantIndex = this.myTasks[taskIndex].applicants.findIndex((item) => item.id === applicantId);
                if (applicantIndex !== -1) {
                  this.myTasks[taskIndex].applicants[applicantIndex].status = "rejected";
                }
              }
              common_vendor.index.showToast({
                title: "已拒绝申请",
                icon: "success"
              });
            }, 500);
          }
        }
      });
    },
    // 根据状态获取样式类
    getStatusClass(status) {
      switch (status) {
        case "pending":
          return "status-pending";
        case "accepted":
          return "status-accepted";
        case "rejected":
          return "status-rejected";
        case "open":
          return "status-open";
        case "in_progress":
          return "status-progress";
        case "completed":
          return "status-completed";
        case "closed":
          return "status-closed";
        default:
          return "status-pending";
      }
    },
    // 根据状态获取文本
    getStatusText(status) {
      switch (status) {
        case "pending":
          return "待审核";
        case "accepted":
          return "已接受";
        case "rejected":
          return "已拒绝";
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
  return common_vendor.e({
    a: common_vendor.t($data.userRole === "employer" ? "申请管理" : "我的申请"),
    b: common_vendor.f($data.userRole === "employer" ? $data.employerTabs : $data.workerTabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: $data.currentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $data.currentTab = index, index)
      };
    }),
    c: $data.applications.length === 0
  }, $data.applications.length === 0 ? {
    d: common_assets._imports_0$1,
    e: common_vendor.t($data.userRole === "employer" ? "暂无申请记录" : "暂无申请")
  } : $data.userRole === "worker" ? {
    g: common_vendor.f($data.applications, (application, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(application.task.title),
        b: common_vendor.t($options.getStatusText(application.status)),
        c: common_vendor.n($options.getStatusClass(application.status)),
        d: common_vendor.t($options.formatDate(application.applyTime)),
        e: common_vendor.t(application.expectedReward),
        f: common_vendor.t(application.task.publisher.name),
        g: common_vendor.t($options.formatDate(application.applyTime)),
        h: application.status === "pending"
      }, application.status === "pending" ? {
        i: common_vendor.o(($event) => $options.cancelApplication(application.id), index)
      } : {}, {
        j: application.status === "accepted"
      }, application.status === "accepted" ? {
        k: common_vendor.o(($event) => $options.contactEmployer(application.task.publisher.phone), index)
      } : {}, {
        l: index,
        m: common_vendor.o(($event) => $options.viewApplicationDetail(application.id), index)
      });
    })
  } : $data.userRole === "employer" ? {
    i: common_vendor.f($data.myTasks, (task, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(task.title),
        b: common_vendor.t($options.getStatusText(task.status)),
        c: common_vendor.n($options.getStatusClass(task.status)),
        d: common_vendor.t(task.reward),
        e: common_vendor.t(task.applicants.length),
        f: common_vendor.t(task.expanded ? "↑" : "↓"),
        g: common_vendor.o(($event) => $options.toggleApplicationList(index), index),
        h: task.expanded
      }, task.expanded ? {
        i: common_vendor.f(task.applicants, (applicant, appIndex, i1) => {
          return common_vendor.e({
            a: applicant.avatar,
            b: common_vendor.t(applicant.name),
            c: common_vendor.t($options.formatDate(applicant.applyTime)),
            d: applicant.status !== "pending"
          }, applicant.status !== "pending" ? {
            e: common_vendor.t(applicant.status === "accepted" ? "已接受" : "已拒绝")
          } : {}, {
            f: common_vendor.t(applicant.phone),
            g: common_vendor.t(applicant.introduction),
            h: common_vendor.t(applicant.expectedReward),
            i: applicant.additionalInfo
          }, applicant.additionalInfo ? {
            j: common_vendor.t(applicant.additionalInfo)
          } : {}, {
            k: task.status === "open" && applicant.status === "pending"
          }, task.status === "open" && applicant.status === "pending" ? {
            l: common_vendor.o(($event) => $options.acceptApplicant(task.id, applicant.id), appIndex),
            m: common_vendor.o(($event) => $options.rejectApplicant(task.id, applicant.id), appIndex)
          } : {}, {
            n: appIndex
          });
        })
      } : {}, {
        j: index
      });
    })
  } : {}, {
    f: $data.userRole === "worker",
    h: $data.userRole === "employer",
    j: $data.loading && $data.applications.length > 0
  }, $data.loading && $data.applications.length > 0 ? {} : {}, {
    k: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/applications/status/status.js.map

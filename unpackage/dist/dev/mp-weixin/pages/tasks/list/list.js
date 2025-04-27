"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const searchKey = common_vendor.ref("");
    const userRole = common_vendor.ref("worker");
    const workerTabs = ["全部", "最新", "热门", "推荐"];
    const employerTabs = ["全部", "招募中", "进行中", "已完成"];
    const currentTab = common_vendor.ref(0);
    const tasks = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const pageNum = common_vendor.ref(1);
    common_vendor.ref(10);
    common_vendor.watch(userRole, () => {
      tasks.value = [];
      pageNum.value = 1;
      fetchTasks();
    });
    const fetchTasks = async () => {
      loading.value = true;
      try {
        setTimeout(() => {
          let newTasks = [];
          if (userRole.value === "worker") {
            newTasks = [
              {
                id: 1,
                title: "设计一个企业Logo",
                description: "需要设计一个现代化的企业Logo，要求简洁、大方，能够展现企业的专业形象。",
                reward: 500,
                deadline: /* @__PURE__ */ new Date("2023-12-30"),
                status: "open",
                // open, in_progress, completed, closed
                publisher: {
                  id: 1,
                  name: "张企业",
                  avatar: "http://iph.href.lu/50x50"
                }
              },
              {
                id: 2,
                title: "开发一个小程序页面",
                description: "需要开发一个WeChat小程序的商品详情页面，要求有图片轮播、商品信息展示、评价列表等功能。",
                reward: 800,
                deadline: /* @__PURE__ */ new Date("2023-12-25"),
                status: "open",
                publisher: {
                  id: 2,
                  name: "李科技",
                  avatar: "http://iph.href.lu/50x50"
                }
              },
              {
                id: 3,
                title: "撰写产品介绍文案",
                description: "为一款新上市的智能手表撰写产品介绍文案，要求突出产品特点和优势，吸引目标用户。",
                reward: 300,
                deadline: /* @__PURE__ */ new Date("2023-12-20"),
                status: "in_progress",
                publisher: {
                  id: 3,
                  name: "王营销",
                  avatar: "http://iph.href.lu/50x50"
                }
              },
              {
                id: 4,
                title: "拍摄产品宣传视频",
                description: "为一款新上市的厨房用品拍摄宣传视频，视频时长3-5分钟，展示产品的使用过程和效果。",
                reward: 1200,
                deadline: /* @__PURE__ */ new Date("2023-12-15"),
                status: "open",
                publisher: {
                  id: 4,
                  name: "赵影像",
                  avatar: "http://iph.href.lu/50x50"
                }
              }
            ];
          } else {
            newTasks = [
              {
                id: 101,
                title: "招聘临时搬运工",
                description: "需要5名临时工帮忙搬运办公家具，工作地点在市中心，工作时间约4小时。",
                reward: 400,
                deadline: /* @__PURE__ */ new Date("2023-12-28"),
                status: "open",
                publisher: {
                  id: 5,
                  name: "我的公司",
                  avatar: "https://randomuser.me/api/portraits/men/5.jpg"
                },
                applicants: 3
              },
              {
                id: 102,
                title: "活动现场发传单",
                description: "周末商场促销活动，需要10名工作人员发放宣传单页，每人每天工作8小时。",
                reward: 300,
                deadline: /* @__PURE__ */ new Date("2023-12-22"),
                status: "in_progress",
                publisher: {
                  id: 5,
                  name: "我的公司",
                  avatar: "https://randomuser.me/api/portraits/men/5.jpg"
                },
                applicants: 15
              },
              {
                id: 103,
                title: "线上客服",
                description: "需要2名兼职在线客服，负责回答用户咨询，工作时间灵活，有经验者优先。",
                reward: 50,
                deadline: /* @__PURE__ */ new Date("2023-12-18"),
                status: "completed",
                publisher: {
                  id: 5,
                  name: "我的公司",
                  avatar: "https://randomuser.me/api/portraits/men/5.jpg"
                },
                applicants: 8
              }
            ];
          }
          tasks.value = pageNum.value === 1 ? newTasks : [...tasks.value, ...newTasks];
          loading.value = false;
        }, 1e3);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/tasks/list/list.vue:221", "获取任务列表失败:", error);
        loading.value = false;
      }
    };
    const loadMore = () => {
      if (loading.value)
        return;
      pageNum.value++;
      fetchTasks();
    };
    const goToDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/tasks/detail/detail?id=${id}`,
        animationType: "fade-in",
        animationDuration: 200
      });
    };
    const applyTask = (id, event) => {
      event.stopPropagation();
      common_vendor.index.navigateTo({
        url: `/pages/tasks/detail/detail?id=${id}`
      });
    };
    const manageTask = (id, event) => {
      event.stopPropagation();
      common_vendor.index.navigateTo({
        url: `/pages/tasks/detail/detail?id=${id}&manage=true`
      });
    };
    const navigateTo = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    };
    const getStatusClass = (status) => {
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
    };
    const getStatusText = (status) => {
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
    };
    common_vendor.onMounted(() => {
      const cachedUserRole = common_vendor.index.getStorageSync("userRole");
      if (cachedUserRole) {
        userRole.value = cachedUserRole;
      }
      fetchTasks();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(userRole.value === "employer" ? "我发布的任务" : "找任务"),
        b: userRole.value === "employer"
      }, userRole.value === "employer" ? {
        c: common_vendor.o(($event) => navigateTo("/pages/tasks/create/create"))
      } : {}, {
        d: searchKey.value,
        e: common_vendor.o(($event) => searchKey.value = $event.detail.value),
        f: common_vendor.f(userRole.value === "employer" ? employerTabs : workerTabs, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab),
            b: index,
            c: currentTab.value === index ? 1 : "",
            d: common_vendor.o(($event) => currentTab.value = index, index)
          };
        }),
        g: tasks.value.length === 0
      }, tasks.value.length === 0 ? {
        h: common_assets._imports_0$1
      } : {
        i: common_vendor.f(tasks.value, (task, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(task.title),
            b: common_vendor.t(getStatusText(task.status)),
            c: common_vendor.n(getStatusClass(task.status)),
            d: common_vendor.t(task.description),
            e: common_vendor.t(task.reward),
            f: common_vendor.t(formatDate(task.deadline)),
            g: task.publisher.avatar,
            h: common_vendor.t(task.publisher.name),
            i: common_vendor.o(($event) => goToDetail(task.id), task.id)
          }, userRole.value === "worker" ? {
            j: common_vendor.o(($event) => applyTask(task.id, $event), task.id)
          } : {
            k: common_vendor.o(($event) => manageTask(task.id, $event), task.id)
          }, {
            l: task.id
          });
        }),
        j: userRole.value === "worker"
      }, {
        k: loading.value && tasks.value.length > 0
      }, loading.value && tasks.value.length > 0 ? {} : {}, {
        l: common_vendor.o(loadMore)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tasks/list/list.js.map

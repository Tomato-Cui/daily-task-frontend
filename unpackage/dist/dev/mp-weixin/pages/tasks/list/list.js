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
    const pageSize = common_vendor.ref(10);
    common_vendor.watch(userRole, () => {
      tasks.value = [];
      pageNum.value = 1;
      fetchTasks();
    });
    const fetchTasks = async () => {
      loading.value = true;
      try {
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/tasks",
          method: "GET",
          data: {
            page: pageNum.value,
            pageSize: pageSize.value,
            role: userRole.value,
            tab: currentTab.value,
            searchKey: searchKey.value
          }
        });
        if (response.statusCode === 200) {
          const newTasks = response.data.map((task) => ({
            ...task,
            publisher: task.publisher || {
              id: 0,
              name: "未知用户",
              avatar: "/static/default-avatar.png"
            }
          }));
          tasks.value = pageNum.value === 1 ? newTasks : [...tasks.value, ...newTasks];
        } else {
          common_vendor.index.showToast({
            title: "获取任务列表失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/tasks/list/list.vue:141", "获取任务列表失败:", error);
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
      } finally {
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
    common_vendor.onLoad(() => {
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
          var _a, _b;
          return common_vendor.e({
            a: common_vendor.t(task.title),
            b: common_vendor.t(getStatusText(task.status)),
            c: common_vendor.n(getStatusClass(task.status)),
            d: common_vendor.t(task.description),
            e: common_vendor.t(task.reward),
            f: common_vendor.t(formatDate(task.deadline)),
            g: ((_a = task.publisher) == null ? void 0 : _a.avatar) || "/static/default-avatar.png",
            h: common_vendor.t(((_b = task.publisher) == null ? void 0 : _b.name) || "未知用户"),
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

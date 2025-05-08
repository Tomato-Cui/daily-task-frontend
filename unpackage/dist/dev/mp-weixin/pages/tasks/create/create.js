"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "create",
  setup(__props) {
    common_vendor.ref("employer");
    const taskTypes = ["短期兼职", "长期兼职", "项目合作", "其他"];
    const taskForm = common_vendor.ref({
      title: "",
      typeIndex: 0,
      description: "",
      reward: "",
      peopleCount: "",
      deadline: "",
      contactPhone: "",
      location: ""
    });
    const submitDisabled = common_vendor.computed(() => {
      return !taskForm.value.title || !taskForm.value.description || !taskForm.value.reward || !taskForm.value.peopleCount || !taskForm.value.deadline || !taskForm.value.contactPhone;
    });
    const handleTaskTypeChange = (e) => {
      taskForm.value.typeIndex = e.detail.value;
    };
    const handleDateChange = (e) => {
      taskForm.value.deadline = e.detail.value;
    };
    const submitTask = () => {
      if (submitDisabled.value) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      const taskData = {
        title: taskForm.value.title,
        description: taskForm.value.description,
        price: Number(this.form.price),
        peopleCount: Number(this.form.peopleCount),
        deadline: taskForm.value.deadline,
        contactPhone: taskForm.value.contactPhone,
        location: taskForm.value.location
        // 添加其他字段...
      };
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      common_vendor.index.request({
        url: "http://localhost:3000/tasks",
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        data: taskData,
        success(res) {
          common_vendor.index.hideLoading();
          if (res.statusCode === 200 || res.statusCode === 201) {
            common_vendor.index.showToast({
              title: "发布成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/tasks/list/list"
              });
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: "发布失败",
              icon: "none"
            });
          }
        },
        fail(err) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "网络错误，请重试",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/tasks/create/create.vue:173", "任务发布失败:", err);
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: taskForm.value.title,
        b: common_vendor.o(($event) => taskForm.value.title = $event.detail.value),
        c: common_vendor.t(taskTypes[taskForm.value.typeIndex]),
        d: taskTypes,
        e: common_vendor.o(handleTaskTypeChange),
        f: taskForm.value.description,
        g: common_vendor.o(($event) => taskForm.value.description = $event.detail.value),
        h: taskForm.value.reward,
        i: common_vendor.o(($event) => taskForm.value.reward = $event.detail.value),
        j: taskForm.value.peopleCount,
        k: common_vendor.o(($event) => taskForm.value.peopleCount = $event.detail.value),
        l: common_vendor.t(taskForm.value.deadline || "请选择截止日期"),
        m: taskForm.value.deadline,
        n: common_vendor.o(handleDateChange),
        o: taskForm.value.contactPhone,
        p: common_vendor.o(($event) => taskForm.value.contactPhone = $event.detail.value),
        q: taskForm.value.location,
        r: common_vendor.o(($event) => taskForm.value.location = $event.detail.value),
        s: submitDisabled.value,
        t: submitDisabled.value ? 1 : "",
        v: common_vendor.o(submitTask)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tasks/create/create.js.map

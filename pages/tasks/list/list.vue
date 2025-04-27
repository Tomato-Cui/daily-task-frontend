<template>
	<view class="task-list-container">
		<!-- 顶部搜索栏 -->
		<view class="search-header">
			<view class="header-top">
				<text class="header-title">{{ userRole === 'employer' ? '我发布的任务' : '找任务' }}</text>
				<view v-if="userRole === 'employer'" class="publish-button" @tap="navigateTo('/pages/tasks/create/create')">发布任务</view>
			</view>
			<view class="search-bar">
				<text class="iconfont icon-search search-icon"></text>
				<input class="search-input" type="text" v-model="searchKey" placeholder="搜索任务" />
			</view>
		</view>

		<!-- 筛选条件 -->
		<view class="filter-tabs">
			<view v-for="(tab, index) in userRole === 'employer' ? employerTabs : workerTabs" :key="index"
				class="tab-item" :class="{ 'active-tab': currentTab === index }" @tap="currentTab = index">
				<text class="tab-text">{{ tab }}</text>
			</view>
		</view>

		<!-- 任务列表 -->
		<scroll-view scroll-y class="task-scroll-view" @scrolltolower="loadMore">
			<!-- 空状态 -->
			<view v-if="tasks.length === 0" class="empty-state">
				<image src="/static/empty.png" class="empty-image" mode="aspectFit"></image>
				<text class="empty-text">暂无任务</text>
			</view>

			<!-- 任务卡片列表 -->
			<view v-else class="task-list">
				<view v-for="(task, index) in tasks" :key="task.id" class="task-card">
					<!-- 点击卡片整体区域（除按钮外）去详情页 -->
					<view class="card-content" @tap="goToDetail(task.id)">
						<!-- 任务标题和状态 -->
						<view class="card-top">
							<text class="task-title">{{ task.title }}</text>
							<text class="task-status" :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</text>
						</view>

						<!-- 任务描述 -->
						<text class="task-description">{{ task.description }}</text>

						<!-- 任务基本信息 -->
						<view class="task-info">
							<text class="task-reward">报酬: ¥{{ task.reward }}</text>
							<text class="task-deadline">截止时间: {{ formatDate(task.deadline) }}</text>
						</view>

						<!-- 分隔线 -->
						<view class="divider"></view>

						<!-- 发布者信息 -->
						<view class="card-bottom">
							<view class="publisher-info">
								<image :src="task.publisher.avatar" class="publisher-avatar"></image>
								<text class="publisher-name">{{ task.publisher.name }}</text>
							</view>
						</view>
					</view>
					
					<!-- 操作按钮 - 单独放在外面，不受卡片点击事件影响 -->
					<view class="action-buttons">
						<button v-if="userRole === 'worker'" class="apply-button" @tap="applyTask(task.id, $event)">申请</button>
						<button v-else class="manage-button" @tap="manageTask(task.id, $event)">管理</button>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="loading && tasks.length > 0" class="loading-more">
				<text class="loading-text">加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

// 搜索关键字
const searchKey = ref('');

// 用户角色
const userRole = ref('worker'); // 'worker' 或 'employer'

// 标签页
const workerTabs = ['全部', '最新', '热门', '推荐'];
const employerTabs = ['全部', '招募中', '进行中', '已完成'];
const currentTab = ref(0);

// 任务列表数据
const tasks = ref([]);
const loading = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);

// 监听角色变化，重新加载数据
watch(userRole, () => {
	tasks.value = [];
	pageNum.value = 1;
	fetchTasks();
});

// 获取任务列表
const fetchTasks = async () => {
	loading.value = true;
	try {
		// 模拟API请求
		setTimeout(() => {
			let newTasks = [];

			if (userRole.value === 'worker') {
				newTasks = [
					{
						id: 1,
						title: '设计一个企业Logo',
						description: '需要设计一个现代化的企业Logo，要求简洁、大方，能够展现企业的专业形象。',
						reward: 500,
						deadline: new Date('2023-12-30'),
						status: 'open', // open, in_progress, completed, closed
						publisher: {
							id: 1,
							name: '张企业',
							avatar: 'http://iph.href.lu/50x50'
						}
					},
					{
						id: 2,
						title: '开发一个小程序页面',
						description: '需要开发一个WeChat小程序的商品详情页面，要求有图片轮播、商品信息展示、评价列表等功能。',
						reward: 800,
						deadline: new Date('2023-12-25'),
						status: 'open',
						publisher: {
							id: 2,
							name: '李科技',
							avatar: 'http://iph.href.lu/50x50'
						}
					},
					{
						id: 3,
						title: '撰写产品介绍文案',
						description: '为一款新上市的智能手表撰写产品介绍文案，要求突出产品特点和优势，吸引目标用户。',
						reward: 300,
						deadline: new Date('2023-12-20'),
						status: 'in_progress',
						publisher: {
							id: 3,
							name: '王营销',
							avatar: 'http://iph.href.lu/50x50'
						}
					},
					{
						id: 4,
						title: '拍摄产品宣传视频',
						description: '为一款新上市的厨房用品拍摄宣传视频，视频时长3-5分钟，展示产品的使用过程和效果。',
						reward: 1200,
						deadline: new Date('2023-12-15'),
						status: 'open',
						publisher: {
							id: 4,
							name: '赵影像',
							avatar: 'http://iph.href.lu/50x50'
						}
					}
				];
			} else {
				// 雇佣者看到的是自己发布的任务
				newTasks = [
					{
						id: 101,
						title: '招聘临时搬运工',
						description: '需要5名临时工帮忙搬运办公家具，工作地点在市中心，工作时间约4小时。',
						reward: 400,
						deadline: new Date('2023-12-28'),
						status: 'open',
						publisher: {
							id: 5,
							name: '我的公司',
							avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
						},
						applicants: 3
					},
					{
						id: 102,
						title: '活动现场发传单',
						description: '周末商场促销活动，需要10名工作人员发放宣传单页，每人每天工作8小时。',
						reward: 300,
						deadline: new Date('2023-12-22'),
						status: 'in_progress',
						publisher: {
							id: 5,
							name: '我的公司',
							avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
						},
						applicants: 15
					},
					{
						id: 103,
						title: '线上客服',
						description: '需要2名兼职在线客服，负责回答用户咨询，工作时间灵活，有经验者优先。',
						reward: 50,
						deadline: new Date('2023-12-18'),
						status: 'completed',
						publisher: {
							id: 5,
							name: '我的公司',
							avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
						},
						applicants: 8
					}
				];
			}

			tasks.value = pageNum.value === 1 ? newTasks : [...tasks.value, ...newTasks];
			loading.value = false;
		}, 1000);
	} catch (error) {
		console.error('获取任务列表失败:', error);
		loading.value = false;
	}
};

// 加载更多
const loadMore = () => {
	if (loading.value) return;
	pageNum.value++;
	fetchTasks();
};

// 跳转到详情页
const goToDetail = (id) => {
	uni.navigateTo({
		url: `/pages/tasks/detail/detail?id=${id}`,
		animationType: 'fade-in',
		animationDuration: 200
	});
};

// 申请任务
const applyTask = (id, event) => {
	event.stopPropagation();
	
	uni.navigateTo({
		url: `/pages/tasks/detail/detail?id=${id}`
	});
};

// 管理任务
const manageTask = (id, event) => {
	event.stopPropagation();
	
	uni.navigateTo({
		url: `/pages/tasks/detail/detail?id=${id}&manage=true`
	});
};

// 页面导航
const navigateTo = (url) => {
	uni.navigateTo({
		url
	});
};

// 格式化日期
const formatDate = (date) => {
	const d = new Date(date);
	return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

// 根据状态获取样式
const getStatusClass = (status) => {
	switch (status) {
		case 'open':
			return 'status-open';
		case 'in_progress':
			return 'status-progress';
		case 'completed':
			return 'status-completed';
		case 'closed':
			return 'status-closed';
		default:
			return 'status-completed';
	}
};

// 根据状态获取文本
const getStatusText = (status) => {
	switch (status) {
		case 'open':
			return '招募中';
		case 'in_progress':
			return '进行中';
		case 'completed':
			return '已完成';
		case 'closed':
			return '已关闭';
		default:
			return '未知';
	}
};

// 页面加载时获取任务列表
onMounted(() => {
	// 从缓存中获取用户角色
	const cachedUserRole = uni.getStorageSync('userRole');
	if (cachedUserRole) {
		userRole.value = cachedUserRole;
	}

	fetchTasks();
});
</script>

<style>
.task-list-container {
    display: flex;
    flex-direction: column;
    background-color: #f9fafb;
    min-height: 100vh;
    box-sizing: border-box;
    width: 100%;
}

/* 顶部搜索栏 */
.search-header {
    position: sticky;
    top: 0;
    background-color: #ffffff;
    padding: 30rpx;
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
    z-index: 10;
    width: 100%;
    box-sizing: border-box;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
}

.header-title {
    font-size: 36rpx;
    font-weight: bold;
}

.publish-button {
    background-color: #3b82f6;
    color: #ffffff;
    font-size: 26rpx;
    padding: 10rpx 30rpx;
    border-radius: 9999rpx;
}

.search-bar {
    display: flex;
    align-items: center;
    background-color: #f3f4f6;
    border-radius: 9999rpx;
    padding: 15rpx 30rpx;
}

.search-icon {
    color: #9ca3af;
    margin-right: 10rpx;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    height: 60rpx;
}

/* 筛选条件 */
.filter-tabs {
    display: flex;
    padding: 20rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #e5e7eb;
    width: 100%;
    box-sizing: border-box;
}

.tab-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15rpx 0;
}

.tab-text {
    font-size: 28rpx;
}

.active-tab {
    color: #3b82f6;
    font-weight: 500;
}

/* 任务列表 */
.task-scroll-view {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
    width: 100%;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
}

.empty-text {
    color: #9ca3af;
    font-size: 28rpx;
}

.task-list {
    padding: 30rpx;
    box-sizing: border-box;
    width: 100%;
}

.task-card {
    background-color: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.05);
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-sizing: border-box;
    width: 100%;
    position: relative; /* 添加相对定位以便于按钮定位 */
}

.card-content {
    width: 100%;
}

/* 卡片顶部区域 */
.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    width: 100%;
}

.task-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1f2937;
    flex: 1;
    padding-right: 15rpx;
}

.task-status {
    font-size: 24rpx;
    padding: 6rpx 16rpx;
    border-radius: 9999rpx;
    white-space: nowrap;
    flex-shrink: 0;
}

.status-open {
    background-color: #d1fae5;
    color: #047857;
}

.status-progress {
    background-color: #dbeafe;
    color: #1d4ed8;
}

.status-completed {
    background-color: #f3f4f6;
    color: #4b5563;
}

.status-closed {
    background-color: #fee2e2;
    color: #b91c1c;
}

/* 任务描述 */
.task-description {
    font-size: 28rpx;
    color: #4b5563;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
    width: 100%;
}

/* 任务基本信息 */
.task-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 26rpx;
    color: #6b7280;
    margin-bottom: 20rpx;
    width: 100%;
}

.task-reward {
    margin-right: 30rpx;
    color: #f97316;
    font-weight: 500;
}

.task-deadline {
    color: #6b7280;
}

/* 分隔线 */
.divider {
    height: 1rpx;
    background-color: #e5e7eb;
    width: 100%;
    margin: 20rpx 0;
}

/* 卡片底部区域 */
.card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 120rpx; /* 为按钮预留空间，避免文字被遮挡 */
}

.publisher-info {
    display: flex;
    align-items: center;
}

.publisher-avatar {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    margin-right: 10rpx;
}

.publisher-name {
    font-size: 26rpx;
    color: #6b7280;
}

.action-buttons {
    position: absolute;
    right: 30rpx;
    bottom: 30rpx;
    display: flex;
    z-index: 2;
}

.apply-button,
.manage-button {
    font-size: 26rpx;
    border-radius: 8rpx;
    padding: 10rpx 30rpx;
    line-height: 1.2;
    margin: 0;
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.apply-button {
    background-color: #3b82f6;
    color: #ffffff;
}

.manage-button {
    background-color: #f97316;
    color: #ffffff;
}

.loading-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30rpx 0;
    width: 100%;
}

.loading-text {
    color: #9ca3af;
    font-size: 26rpx;
}
</style>

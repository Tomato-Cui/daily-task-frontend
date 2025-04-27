<template>
	<view class="profile-container">
		<!-- 用户资料卡片 -->
		<view class="user-card">
			<view class="user-info">
				<image :src="userInfo.avatar || '/static/default-avatar.png'" class="avatar"></image>
				<view class="user-details">
					<view class="user-name">{{ userInfo.nickname || '未登录' }}</view>
					<view class="user-phone">{{ userInfo.phone || '未绑定手机号' }}</view>
				</view>
			</view>
			
			<!-- 角色切换 -->
			<view class="role-switch">
				<view class="role-label">当前身份</view>
				<view class="role-buttons">
					<view 
						class="role-button" 
						:class="userRole === 'employer' ? 'role-active' : 'role-inactive'"
						@tap="switchRole('employer')"
					>雇佣者</view>
					<view class="role-spacer"></view>
					<view 
						class="role-button"
						:class="userRole === 'worker' ? 'role-active' : 'role-inactive'"
						@tap="switchRole('worker')"
					>求职者</view>
				</view>
			</view>
		</view>
		
		<!-- 功能菜单 -->
		<view class="feature-menu">
			<view class="feature-grid">
				<view class="feature-item" @tap="navigateTo('/pages/users/editProfile/editProfile')">
					<view class="feature-icon feature-edit">
						<text class="feature-icon-text edit-icon">编</text>
					</view>
					<text class="feature-text">编辑资料</text>
				</view>
				
				<view class="feature-item" @tap="navigateTo('/pages/tasks/list/list')">
					<view class="feature-icon feature-task">
						<text class="feature-icon-text task-icon">任</text>
					</view>
					<text class="feature-text">任务列表</text>
				</view>
				
				<view class="feature-item" v-if="userRole === 'employer'" @tap="navigateTo('/pages/tasks/create/create')">
					<view class="feature-icon feature-publish">
						<text class="feature-icon-text publish-icon">发</text>
					</view>
					<text class="feature-text">发布任务</text>
				</view>
				
				<view class="feature-item" v-if="userRole === 'worker'" @tap="navigateTo('/pages/applications/status/status')">
					<view class="feature-icon feature-apply">
						<text class="feature-icon-text apply-icon">申</text>
					</view>
					<text class="feature-text">我的申请</text>
				</view>
			</view>
		</view>
		
		<!-- 列表菜单 -->
		<view class="list-menu">
			<view class="menu-item" @tap="navigateTo('/pages/payments/history/history')">
				<text class="menu-text">支付记录</text>
				<text class="menu-arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-text">意见反馈</text>
				<text class="menu-arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-text">关于我们</text>
				<text class="menu-arrow">></text>
			</view>
			<view class="menu-item logout-item" @tap="logout">
				<text class="logout-text">退出登录</text>
				<text class="menu-arrow">></text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 用户信息
const userInfo = ref({
	avatar: '',
	nickname: '张三',
	phone: '138****1234'
});

// 用户角色：employer(雇佣者) 或 worker(求职者)
const userRole = ref('worker');

// 初始化
onMounted(() => {
	// 从缓存获取用户信息
	const cachedUserInfo = uni.getStorageSync('userInfo');
	if (cachedUserInfo) {
		userInfo.value = cachedUserInfo;
	}
	
	// 从缓存获取用户角色
	const cachedUserRole = uni.getStorageSync('userRole');
	if (cachedUserRole) {
		userRole.value = cachedUserRole;
	}
});

// 切换角色
const switchRole = (role) => {
	if (userRole.value === role) return;
	
	userRole.value = role;
	// 保存角色到缓存
	uni.setStorageSync('userRole', role);
	
	// 显示提示
	uni.showToast({
		title: role === 'employer' ? '已切换为雇佣者' : '已切换为求职者',
		icon: 'none'
	});
	
	// 如果在tabBar页面，刷新当前页面以反映角色变化
	const currentPages = getCurrentPages();
	const currentPage = currentPages[currentPages.length - 1];
	if (currentPage && currentPage.route && ['pages/tasks/list/list', 'pages/applications/status/status', 'pages/users/profile/profile'].includes(currentPage.route)) {
		setTimeout(() => {
			uni.reLaunch({
				url: '/' + currentPage.route
			});
		}, 500);
	}
};

// 页面导航
const navigateTo = (url) => {
	// 对于tabBar页面使用switchTab，其他页面使用navigateTo
	if (url.includes('/pages/applications/status/status') || 
	    url.includes('/pages/tasks/list/list')) {
		uni.switchTab({
			url
		});
	} else {
		uni.navigateTo({
			url
		});
	}
};

// 退出登录
const logout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				// 清除用户信息和登录状态
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('userRole');
				
				// 返回登录页
				uni.reLaunch({
					url: '/pages/auth/login/login'
				});
			}
		}
	});
};
</script>

<style>
.profile-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f9fafb;
}

/* 用户资料卡片样式 */
.user-card {
	background-color: #ffffff;
	padding: 30rpx;
	box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
	margin-bottom: 20rpx;
}

.user-info {
	display: flex;
	align-items: center;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}

.user-details {
	margin-left: 30rpx;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
}

.user-phone {
	font-size: 28rpx;
	color: #6b7280;
	margin-top: 10rpx;
}

/* 角色切换样式 */
.role-switch {
	margin-top: 30rpx;
	background-color: #f3f4f6;
	padding: 20rpx;
	border-radius: 8rpx;
}

.role-label {
	font-size: 28rpx;
	margin-bottom: 20rpx;
	color: #4b5563;
}

.role-buttons {
	display: flex;
}

.role-button {
	flex: 1;
	padding: 15rpx 0;
	text-align: center;
	border-radius: 8rpx;
	font-size: 28rpx;
}

.role-spacer {
	width: 20rpx;
}

.role-active {
	background-color: #3b82f6;
	color: #ffffff;
}

.role-inactive {
	background-color: #e5e7eb;
	color: #4b5563;
}

/* 功能菜单样式 */
.feature-menu {
	background-color: #ffffff;
	box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
}

.feature-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
	padding: 30rpx;
}

.feature-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.feature-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10rpx;
}

.feature-edit {
	background-color: #dbeafe;
}

.feature-task {
	background-color: #d1fae5;
}

.feature-publish {
	background-color: #ffedd5;
}

.feature-apply {
	background-color: #f3e8ff;
}

.feature-icon-text {
	font-size: 40rpx;
}

.edit-icon {
	color: #3b82f6;
}

.task-icon {
	color: #10b981;
}

.publish-icon {
	color: #f97316;
}

.apply-icon {
	color: #8b5cf6;
}

.feature-text {
	font-size: 24rpx;
}

/* 列表菜单样式 */
.list-menu {
	background-color: #ffffff;
	margin-top: 20rpx;
	box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f3f4f6;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.menu-text {
	font-size: 30rpx;
}

.menu-arrow {
	color: #9ca3af;
}

.logout-item {
	border-bottom: none;
}

.logout-text {
	font-size: 30rpx;
	color: #ef4444;
}
</style>

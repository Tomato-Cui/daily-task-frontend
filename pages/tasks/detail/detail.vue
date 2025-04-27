<template>
	<view class="detail-container">
		<!-- 顶部信息栏 -->
		<view class="detail-header">
			<view class="header-top">
				<view class="back-button" @tap="goBack">
					<text class="back-icon">←</text>
				</view>
				<text class="header-title">任务详情</text>
				<view class="header-placeholder"></view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="isLoading" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 任务详情内容（只在数据加载完成后显示） -->
		<template v-else>
			<scroll-view scroll-y class="detail-content">
				<!-- 任务卡片 -->
				<view class="task-card">
					<!-- 任务标题和状态 -->
					<view class="task-header">
						<text class="task-title">{{ task.title }}</text>
						<text class="task-status" :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</text>
					</view>

					<!-- 发布者信息 -->
					<view class="publisher-info">
						<image :src="task.publisher.avatar" class="publisher-avatar"></image>
						<text class="publisher-name">{{ task.publisher.name }}</text>
						<text class="publish-time">发布于 {{ formatDate(task.publishTime) }}</text>
					</view>

					<!-- 任务基本信息 -->
					<view class="task-info-section">
						<view class="info-item">
							<text class="info-label">报酬：</text>
							<text class="info-value reward-value">¥{{ task.reward }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">截止日期：</text>
							<text class="info-value">{{ formatDate(task.deadline) }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">工作地点：</text>
							<text class="info-value">{{ task.location }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">所需人数：</text>
							<text class="info-value">{{ task.requiredPeople }}人</text>
						</view>
					</view>

					<!-- 任务描述 -->
					<view class="task-description-section">
						<text class="section-title">任务描述</text>
						<text class="task-description">{{ task.description }}</text>
					</view>

					<!-- 任务要求 -->
					<view class="task-requirements-section">
						<text class="section-title">任务要求</text>
						<view class="requirements-list">
							<view v-for="(requirement, index) in task.requirements" :key="index" class="requirement-item">
								<text class="requirement-bullet">•</text>
								<text class="requirement-text">{{ requirement }}</text>
							</view>
						</view>
					</view>

					<!-- 联系方式 -->
					<view class="contact-section" v-if="isApplied || isEmployer">
						<text class="section-title">联系方式</text>
						<view class="contact-item">
							<text class="contact-label">联系人：</text>
							<text class="contact-value">{{ task.contactPerson }}</text>
						</view>
						<view class="contact-item">
							<text class="contact-label">联系电话：</text>
							<text class="contact-value">{{ task.contactPhone }}</text>
						</view>
					</view>
				</view>

				<!-- 申请者列表 (仅雇主可见) -->
				<view class="applicants-section" v-if="isEmployer && task.applicants && task.applicants.length > 0">
					<text class="section-title">申请者 ({{ task.applicants.length }}人)</text>
					<view class="applicant-list">
						<view v-for="(applicant, index) in task.applicants" :key="index" class="applicant-item">
							<view class="applicant-info">
								<image :src="applicant.avatar" class="applicant-avatar"></image>
								<view class="applicant-details">
									<text class="applicant-name">{{ applicant.name }}</text>
									<text class="applicant-time">申请于 {{ formatDate(applicant.applyTime) }}</text>
								</view>
							</view>
							<view class="applicant-actions" v-if="task.status === 'open'">
								<button class="accept-button" @tap="acceptApplicant(applicant.id)">接受</button>
								<button class="reject-button" @tap="rejectApplicant(applicant.id)">拒绝</button>
							</view>
							<text class="applicant-status" v-else-if="applicant.status">{{ applicant.status === 'accepted' ? '已接受' : '已拒绝' }}</text>
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 底部操作栏 -->
			<view class="detail-footer">
				<!-- 求职者视角 -->
				<block v-if="userRole === 'worker'">
					<button class="apply-button" v-if="!isApplied && task.status === 'open'" @tap="applyTask">申请任务</button>
					<button class="applied-button" v-else-if="isApplied && task.status === 'open'">已申请</button>
					<button class="cancel-button" v-if="isApplied && task.status === 'open'" @tap="cancelApply">取消申请</button>
					<button class="contact-button" v-if="isApplied && task.status === 'in_progress'" @tap="contactEmployer">联系雇主</button>
					<button class="complete-button" v-if="isApplied && task.status === 'in_progress'" @tap="completeTask">完成任务</button>
				</block>

				<!-- 雇主视角 -->
				<block v-else-if="userRole === 'employer' && isEmployer">
					<button class="view-applications-button" v-if="task.applicants && task.applicants.length > 0" @tap="viewApplications">查看申请 ({{ task.applicants.length }})</button>
					<button class="edit-button" v-if="task.status === 'open'" @tap="editTask">编辑任务</button>
					<button class="close-button" v-if="task.status === 'open'" @tap="closeTask">关闭任务</button>
					<button class="complete-button" v-if="task.status === 'in_progress'" @tap="completeTask">标记完成</button>
				</block>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoading: true, // 添加加载状态标记
				task: {
					id: 0,
					title: '',
					description: '',
					reward: 0,
					publishTime: new Date(),
					deadline: new Date(),
					location: '',
					requiredPeople: 0,
					contactPerson: '',
					contactPhone: '',
					status: 'open', // open, in_progress, completed, closed
					requirements: [],
					publisher: {
						id: 0,
						name: '',
						avatar: ''
					},
					applicants: []
				},
				userRole: 'worker', // 当前用户角色
				isApplied: false, // 当前用户是否已申请
				isEmployer: false, // 当前用户是否是雇主
				taskId: 0, // 通过URL参数传入的任务ID
			}
		},
		onLoad(options) {
			// 获取任务ID
			if (options.id) {
				this.taskId = options.id;
				// 显示加载状态
				uni.showLoading({
					title: '加载中...'
				});
				this.fetchTaskDetail();
			}
			
			// 从缓存获取用户角色
			const cachedUserRole = uni.getStorageSync('userRole');
			if (cachedUserRole) {
				this.userRole = cachedUserRole;
			}
		},
		methods: {
			// 获取任务详情
			fetchTaskDetail() {
				// 模拟API请求获取任务详情
				setTimeout(() => {
					// 模拟数据
					this.task = {
						id: this.taskId,
						title: '设计一个企业Logo',
						description: '需要设计一个现代化的企业Logo，要求简洁、大方，能够展现企业的专业形象。需要提供源文件和至少3种不同颜色方案。我们是一家科技公司，希望Logo能够体现创新和科技感。',
						reward: 500,
						publishTime: new Date('2023-12-01'),
						deadline: new Date('2023-12-30'),
						location: '远程工作',
						requiredPeople: 1,
						contactPerson: '张经理',
						contactPhone: '13800138000',
						status: 'open',
						requirements: [
							'有平面设计经验',
							'熟练掌握PS、AI等设计软件',
							'有良好的沟通能力',
							'能够按时完成任务'
						],
						publisher: {
							id: 1,
							name: '张企业',
							avatar: 'http://iph.href.lu/50x50'
						},
						applicants: [
							{
								id: 101,
								name: '李设计',
								avatar: 'http://iph.href.lu/50x50',
								applyTime: new Date('2023-12-05'),
								status: ''
							},
							{
								id: 102,
								name: '王绘画',
								avatar: 'http://iph.href.lu/50x50',
								applyTime: new Date('2023-12-06'),
								status: ''
							}
						]
					};
					
					// 判断当前用户是否是任务发布者
					const userInfo = uni.getStorageSync('userInfo');
					if (userInfo && userInfo.id === this.task.publisher.id) {
						this.isEmployer = true;
					}
					
					// 判断当前用户是否已申请
					// 实际应用中应从服务器获取此信息
					this.isApplied = Math.random() > 0.5;
					
					// 数据加载完成，隐藏加载状态
					uni.hideLoading();
					this.isLoading = false;
				}, 500);
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack({
					animationType: 'fade-out', // 使用淡出动画
					animationDuration: 200 // 设置动画持续时间较短
				});
			},
			
			// 申请任务
			applyTask() {
				// 直接跳转到申请页面
				uni.navigateTo({
					url: `/pages/applications/apply/apply?id=${this.task.id}`
				});
			},
			
			// 取消申请
			cancelApply() {
				uni.showModal({
					title: '确认取消',
					content: '确认取消申请此任务吗？',
					success: (res) => {
						if (res.confirm) {
							// 模拟API请求
							uni.showLoading({
								title: '取消中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								this.isApplied = false;
								uni.showToast({
									title: '已取消申请'
								});
							}, 1000);
						}
					}
				});
			},
			
			// 联系雇主
			contactEmployer() {
				uni.makePhoneCall({
					phoneNumber: this.task.contactPhone,
					fail: () => {
						uni.showToast({
							title: '拨打电话失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 完成任务
			completeTask() {
				uni.showModal({
					title: '确认完成',
					content: '确认该任务已完成吗？',
					success: (res) => {
						if (res.confirm) {
							// 模拟API请求
							uni.showLoading({
								title: '提交中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								this.task.status = 'completed';
								uni.showToast({
									title: '已标记为完成'
								});
							}, 1000);
						}
					}
				});
			},
			
			// 编辑任务
			editTask() {
				uni.navigateTo({
					url: `/pages/tasks/edit/edit?id=${this.task.id}`
				});
			},
			
			// 关闭任务
			closeTask() {
				uni.showModal({
					title: '确认关闭',
					content: '确认关闭此任务吗？关闭后将不再接受新的申请。',
					success: (res) => {
						if (res.confirm) {
							// 模拟API请求
							uni.showLoading({
								title: '提交中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								this.task.status = 'closed';
								uni.showToast({
									title: '已关闭任务'
								});
							}, 1000);
						}
					}
				});
			},
			
			// 接受申请者
			acceptApplicant(applicantId) {
				uni.showModal({
					title: '确认接受',
					content: '确认接受此申请者吗？',
					success: (res) => {
						if (res.confirm) {
							// 模拟API请求
							uni.showLoading({
								title: '处理中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								// 更新申请者状态
								this.task.applicants.forEach(applicant => {
									if (applicant.id === applicantId) {
										applicant.status = 'accepted';
									}
								});
								
								// 更新任务状态
								this.task.status = 'in_progress';
								
								uni.showToast({
									title: '已接受申请'
								});
							}, 1000);
						}
					}
				});
			},
			
			// 拒绝申请者
			rejectApplicant(applicantId) {
				uni.showModal({
					title: '确认拒绝',
					content: '确认拒绝此申请者吗？',
					success: (res) => {
						if (res.confirm) {
							// 模拟API请求
							uni.showLoading({
								title: '处理中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								// 更新申请者状态
								this.task.applicants.forEach(applicant => {
									if (applicant.id === applicantId) {
										applicant.status = 'rejected';
									}
								});
								
								uni.showToast({
									title: '已拒绝申请'
								});
							}, 1000);
						}
					}
				});
			},
			
			// 根据状态获取样式类
			getStatusClass(status) {
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
			},
			
			// 根据状态获取文本
			getStatusText(status) {
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
			},
			
			// 格式化日期
			formatDate(date) {
				const d = new Date(date);
				return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
			},
			
			// 查看申请列表
			viewApplications() {
				uni.switchTab({
					url: '/pages/applications/status/status'
				});
			},
		}
	}
</script>

<style>
.detail-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f9fafb;
	box-sizing: border-box;
	width: 100%;
}

/* 顶部信息栏 */
.detail-header {
	background-color: #ffffff;
	padding: 30rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	z-index: 10;
	width: 100%;
	box-sizing: border-box;
}

.header-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.back-button {
	padding: 10rpx;
}

.back-icon {
	font-size: 40rpx;
	font-weight: bold;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	text-align: center;
	flex: 1;
}

.header-placeholder {
	width: 40rpx;
}

/* 任务详情内容 */
.detail-content {
	flex: 1;
	padding: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

.task-card {
	background-color: #ffffff;
	border-radius: 8rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
	margin-bottom: 30rpx;
	width: 100%;
	box-sizing: border-box;
}

.task-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	width: 100%;
}

.task-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1f2937;
	flex: 1;
	padding-right: 20rpx;
}

.task-status {
	font-size: 26rpx;
	padding: 8rpx 16rpx;
	border-radius: 9999rpx;
	white-space: nowrap;
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

/* 发布者信息 */
.publisher-info {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f3f4f6;
	width: 100%;
	box-sizing: border-box;
}

.publisher-avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin-right: 15rpx;
	flex-shrink: 0;
}

.publisher-name {
	font-size: 28rpx;
	color: #4b5563;
	margin-right: 20rpx;
}

.publish-time {
	font-size: 26rpx;
	color: #9ca3af;
}

/* 任务基本信息 */
.task-info-section {
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f3f4f6;
	width: 100%;
	box-sizing: border-box;
}

.info-item {
	display: flex;
	margin-bottom: 15rpx;
	width: 100%;
}

.info-label {
	width: 150rpx;
	font-size: 28rpx;
	color: #6b7280;
	flex-shrink: 0;
}

.info-value {
	font-size: 28rpx;
	color: #1f2937;
	flex: 1;
}

.reward-value {
	font-weight: bold;
	color: #f97316;
}

/* 任务描述 */
.task-description-section,
.task-requirements-section,
.contact-section {
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f3f4f6;
	width: 100%;
	box-sizing: border-box;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1f2937;
	margin-bottom: 20rpx;
	display: block;
	width: 100%;
}

.task-description {
	font-size: 28rpx;
	color: #4b5563;
	line-height: 1.6;
	width: 100%;
}

/* 任务要求 */
.requirements-list {
	margin-top: 10rpx;
	width: 100%;
}

.requirement-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 15rpx;
	width: 100%;
}

.requirement-bullet {
	margin-right: 10rpx;
	color: #3b82f6;
	font-size: 30rpx;
	flex-shrink: 0;
}

.requirement-text {
	font-size: 28rpx;
	color: #4b5563;
	line-height: 1.5;
	flex: 1;
}

/* 联系方式 */
.contact-item {
	display: flex;
	margin-bottom: 15rpx;
	width: 100%;
}

.contact-label {
	width: 150rpx;
	font-size: 28rpx;
	color: #6b7280;
	flex-shrink: 0;
}

.contact-value {
	font-size: 28rpx;
	color: #1f2937;
	flex: 1;
}

/* 申请者列表 */
.applicants-section {
	background-color: #ffffff;
	border-radius: 8rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
	width: 100%;
	box-sizing: border-box;
}

.applicant-list {
	margin-top: 20rpx;
	width: 100%;
}

.applicant-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f3f4f6;
	width: 100%;
	box-sizing: border-box;
}

.applicant-item:last-child {
	border-bottom: none;
}

.applicant-info {
	display: flex;
	align-items: center;
	flex: 1;
}

.applicant-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.applicant-details {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.applicant-name {
	font-size: 30rpx;
	color: #1f2937;
	margin-bottom: 5rpx;
}

.applicant-time {
	font-size: 26rpx;
	color: #9ca3af;
}

.applicant-actions {
	display: flex;
}

.accept-button {
	background-color: #10b981;
	color: #ffffff;
	font-size: 26rpx;
	padding: 10rpx 20rpx;
	border-radius: 6rpx;
	margin-right: 10rpx;
}

.reject-button {
	background-color: #ef4444;
	color: #ffffff;
	font-size: 26rpx;
	padding: 10rpx 20rpx;
	border-radius: 6rpx;
}

.applicant-status {
	font-size: 26rpx;
	color: #6b7280;
}

/* 底部操作栏 */
.detail-footer {
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	box-shadow: 0 -2rpx 4rpx rgba(0, 0, 0, 0.05);
	display: flex;
	justify-content: space-around;
	width: 100%;
	box-sizing: border-box;
}

.apply-button {
	background-color: #3b82f6;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 100%;
}

.applied-button {
	background-color: #9ca3af;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 45%;
}

.cancel-button {
	background-color: #ef4444;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 45%;
}

.contact-button {
	background-color: #10b981;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 45%;
}

.complete-button {
	background-color: #f97316;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 100%;
}

.edit-button {
	background-color: #3b82f6;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 45%;
}

.close-button {
	background-color: #ef4444;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 45%;
}

.view-applications-button {
	background-color: #3b82f6;
	color: #ffffff;
	font-size: 30rpx;
	padding: 20rpx 40rpx;
	border-radius: 8rpx;
	width: 100%;
}

/* 加载状态样式 */
.loading-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
}

.loading-spinner {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(0, 0, 0, 0.1);
	border-top-color: #3b82f6;
	animation: spin 1s linear infinite;
	margin-bottom: 20rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #6b7280;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>

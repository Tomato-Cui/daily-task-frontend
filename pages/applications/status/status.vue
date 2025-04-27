<template>
	<view class="status-container">
		<!-- 页面头部 -->
		<view class="status-header">
			<text class="header-title">{{ userRole === 'employer' ? '申请管理' : '我的申请' }}</text>
			<view class="filter-tabs">
				<view v-for="(tab, index) in userRole === 'employer' ? employerTabs : workerTabs" :key="index"
					class="tab-item" :class="{ 'active-tab': currentTab === index }" @tap="currentTab = index">
					<text class="tab-text">{{ tab }}</text>
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view scroll-y class="status-content" @scrolltolower="loadMore">
			<!-- 空状态 -->
			<view v-if="applications.length === 0" class="empty-state">
				<image src="/static/empty.png" class="empty-image" mode="aspectFit"></image>
				<text class="empty-text">{{ userRole === 'employer' ? '暂无申请记录' : '暂无申请' }}</text>
			</view>

			<!-- 求职者视角：我的申请列表 -->
			<view v-else-if="userRole === 'worker'" class="application-list">
				<view v-for="(application, index) in applications" :key="index" class="application-card" @tap="viewApplicationDetail(application.id)">
					<view class="application-top">
						<text class="application-task-title">{{ application.task.title }}</text>
						<text class="application-status" :class="getStatusClass(application.status)">{{ getStatusText(application.status) }}</text>
					</view>
					
					<view class="application-info">
						<view class="info-item">
							<text class="info-label">申请时间：</text>
							<text class="info-value">{{ formatDate(application.applyTime) }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">期望报酬：</text>
							<text class="info-value reward-value">¥{{ application.expectedReward }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">发布者：</text>
							<text class="info-value">{{ application.task.publisher.name }}</text>
						</view>
					</view>
					
					<view class="divider"></view>
					
					<view class="application-actions">
						<view class="apply-time">申请于 {{ formatDate(application.applyTime) }}</view>
						<view class="action-buttons">
							<button v-if="application.status === 'pending'" class="cancel-button" @tap.stop="cancelApplication(application.id)">取消申请</button>
							<button v-if="application.status === 'accepted'" class="contact-button" @tap.stop="contactEmployer(application.task.publisher.phone)">联系雇主</button>
						</view>
					</view>
				</view>
			</view>

			<!-- 雇主视角：申请管理列表 -->
			<view v-else-if="userRole === 'employer'" class="application-list">
				<view v-for="(task, index) in myTasks" :key="index" class="task-with-applications">
					<view class="task-info-card" @tap="toggleApplicationList(index)">
						<view class="task-top">
							<text class="task-title">{{ task.title }}</text>
							<text class="task-status" :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</text>
						</view>
						<view class="task-brief">
							<text class="task-reward">¥{{ task.reward }}</text>
							<text class="applicants-count">{{ task.applicants.length }}人申请</text>
							<text class="expand-icon">{{ task.expanded ? '↑' : '↓' }}</text>
						</view>
					</view>
					
					<view v-if="task.expanded" class="applicants-list">
						<view v-for="(applicant, appIndex) in task.applicants" :key="appIndex" class="applicant-card">
							<view class="applicant-header">
								<view class="applicant-info">
									<image :src="applicant.avatar" class="applicant-avatar"></image>
									<view class="applicant-details">
										<text class="applicant-name">{{ applicant.name }}</text>
										<text class="applicant-time">申请于 {{ formatDate(applicant.applyTime) }}</text>
									</view>
								</view>
								<text class="applicant-status" v-if="applicant.status !== 'pending'">{{ applicant.status === 'accepted' ? '已接受' : '已拒绝' }}</text>
							</view>
							
							<view class="applicant-content">
								<view class="content-item">
									<text class="content-label">联系电话：</text>
									<text class="content-value">{{ applicant.phone }}</text>
								</view>
								
								<view class="content-item">
									<text class="content-label">个人介绍：</text>
									<text class="content-value description">{{ applicant.introduction }}</text>
								</view>
								
								<view class="content-item">
									<text class="content-label">期望报酬：</text>
									<text class="content-value reward">¥{{ applicant.expectedReward }}</text>
								</view>
								
								<view class="content-item" v-if="applicant.additionalInfo">
									<text class="content-label">附加说明：</text>
									<text class="content-value description">{{ applicant.additionalInfo }}</text>
								</view>
							</view>
							
							<view class="applicant-actions" v-if="task.status === 'open' && applicant.status === 'pending'">
								<button class="accept-button" @tap="acceptApplicant(task.id, applicant.id)">接受</button>
								<button class="reject-button" @tap="rejectApplicant(task.id, applicant.id)">拒绝</button>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="loading && applications.length > 0" class="loading-more">
				<text class="loading-text">加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userRole: 'worker', // 用户角色: 'worker'(求职者) 或 'employer'(雇佣者)
				workerTabs: ['全部', '待审核', '已接受', '已拒绝'],
				employerTabs: ['全部', '待处理', '已接受', '已拒绝'],
				currentTab: 0,
				applications: [], // 求职者视角：我的申请列表
				myTasks: [], // 雇主视角：我发布的任务及申请者
				loading: false,
				pageNum: 1,
				pageSize: 10
			}
		},
		onLoad() {
			// 从缓存获取用户角色
			const cachedUserRole = uni.getStorageSync('userRole');
			if (cachedUserRole) {
				this.userRole = cachedUserRole;
			}
			
			// 加载数据
			this.fetchApplications();
		},
		onShow() {
			// 每次页面显示时刷新数据
			this.pageNum = 1;
			this.applications = [];
			this.myTasks = [];
			this.fetchApplications();
		},
		methods: {
			// 获取申请列表
			fetchApplications() {
				this.loading = true;
				
				// 模拟API请求
				setTimeout(() => {
					if (this.userRole === 'worker') {
						// 求职者视角：获取我的申请列表
						this.applications = [
							{
								id: 1001,
								task: {
									id: 1,
									title: '设计一个企业Logo',
									publisher: {
										id: 101,
										name: '张企业',
										phone: '13800138000'
									}
								},
								applyTime: new Date('2023-12-05'),
								expectedReward: 500,
								status: 'pending' // pending, accepted, rejected
							},
							{
								id: 1002,
								task: {
									id: 2,
									title: '开发一个小程序页面',
									publisher: {
										id: 102,
										name: '李科技',
										phone: '13900139000'
									}
								},
								applyTime: new Date('2023-12-02'),
								expectedReward: 800,
								status: 'accepted'
							},
							{
								id: 1003,
								task: {
									id: 3,
									title: '撰写产品介绍文案',
									publisher: {
										id: 103,
										name: '王营销',
										phone: '13700137000'
									}
								},
								applyTime: new Date('2023-11-28'),
								expectedReward: 300,
								status: 'rejected'
							}
						];
					} else {
						// 雇主视角：获取我发布的任务及申请者
						this.myTasks = [
							{
								id: 101,
								title: '招聘临时搬运工',
								reward: 400,
								status: 'open',
								expanded: true, // 是否展开显示申请者列表
								applicants: [
									{
										id: 201,
										name: '李搬运',
										avatar: 'http://iph.href.lu/50x50',
										phone: '138****5678',
										introduction: '有多年搬运经验，力气大，速度快。',
										expectedReward: 400,
										additionalInfo: '可带助手一起完成工作',
										applyTime: new Date('2023-12-05'),
										status: 'pending'
									},
									{
										id: 202,
										name: '王力工',
										avatar: 'http://iph.href.lu/50x50',
										phone: '139****1234',
										introduction: '专业搬家公司员工，有丰富经验。',
										expectedReward: 450,
										additionalInfo: '',
										applyTime: new Date('2023-12-06'),
										status: 'pending'
									}
								]
							},
							{
								id: 102,
								title: '活动现场发传单',
								reward: 300,
								status: 'in_progress',
								expanded: false,
								applicants: [
									{
										id: 203,
										name: '张宣传',
										avatar: 'http://iph.href.lu/50x50',
										phone: '136****2345',
										introduction: '曾参与多个促销活动，经验丰富。',
										expectedReward: 300,
										additionalInfo: '',
										applyTime: new Date('2023-12-01'),
										status: 'accepted'
									},
									{
										id: 204,
										name: '刘活动',
										avatar: 'http://iph.href.lu/50x50',
										phone: '135****6789',
										introduction: '大学生，寻找兼职工作，有责任心。',
										expectedReward: 280,
										additionalInfo: '可以全天工作',
										applyTime: new Date('2023-12-02'),
										status: 'rejected'
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
				if (this.loading) return;
				this.pageNum++;
				this.fetchApplications();
			},
			
			// 查看申请详情（求职者）
			viewApplicationDetail(id) {
				// 跳转到任务详情页
				const application = this.applications.find(item => item.id === id);
				if (application) {
					uni.navigateTo({
						url: `/pages/tasks/detail/detail?id=${application.task.id}`
					});
				}
			},
			
			// 取消申请（求职者）
			cancelApplication(id) {
				uni.showModal({
					title: '确认取消',
					content: '确认取消此申请吗？',
					success: (res) => {
						if (res.confirm) {
							// 模拟API请求
							uni.showLoading({
								title: '取消中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								
								// 更新申请状态
								const index = this.applications.findIndex(item => item.id === id);
								if (index !== -1) {
									this.applications.splice(index, 1);
								}
								
								uni.showToast({
									title: '已取消申请',
									icon: 'success'
								});
							}, 500);
						}
					}
				});
			},
			
			// 联系雇主（求职者）
			contactEmployer(phone) {
				if (!phone) {
					uni.showToast({
						title: '联系电话不存在',
						icon: 'none'
					});
					return;
				}
				
				uni.makePhoneCall({
					phoneNumber: phone,
					fail: () => {
						uni.showToast({
							title: '拨打电话失败',
							icon: 'none'
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
				uni.showModal({
					title: '确认接受',
					content: '确认接受此申请者吗？接受后任务将进入进行中状态，其他申请者将自动被拒绝。',
					success: (res) => {
						if (res.confirm) {
							// 模拟API请求
							uni.showLoading({
								title: '处理中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								
								// 更新申请者状态
								const taskIndex = this.myTasks.findIndex(task => task.id === taskId);
								if (taskIndex !== -1) {
									this.myTasks[taskIndex].applicants.forEach(item => {
										if (item.id === applicantId) {
											item.status = 'accepted';
										} else {
											item.status = 'rejected';
										}
									});
									
									// 更新任务状态
									this.myTasks[taskIndex].status = 'in_progress';
								}
								
								uni.showToast({
									title: '已接受申请',
									icon: 'success'
								});
							}, 500);
						}
					}
				});
			},
			
			// 拒绝申请者（雇主）
			rejectApplicant(taskId, applicantId) {
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
								const taskIndex = this.myTasks.findIndex(task => task.id === taskId);
								if (taskIndex !== -1) {
									const applicantIndex = this.myTasks[taskIndex].applicants.findIndex(item => item.id === applicantId);
									if (applicantIndex !== -1) {
										this.myTasks[taskIndex].applicants[applicantIndex].status = 'rejected';
									}
								}
								
								uni.showToast({
									title: '已拒绝申请',
									icon: 'success'
								});
							}, 500);
						}
					}
				});
			},
			
			// 根据状态获取样式类
			getStatusClass(status) {
				switch (status) {
					case 'pending':
						return 'status-pending';
					case 'accepted':
						return 'status-accepted';
					case 'rejected':
						return 'status-rejected';
					case 'open':
						return 'status-open';
					case 'in_progress':
						return 'status-progress';
					case 'completed':
						return 'status-completed';
					case 'closed':
						return 'status-closed';
					default:
						return 'status-pending';
				}
			},
			
			// 根据状态获取文本
			getStatusText(status) {
				switch (status) {
					case 'pending':
						return '待审核';
					case 'accepted':
						return '已接受';
					case 'rejected':
						return '已拒绝';
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
			}
		}
	}
</script>

<style>
.status-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f9fafb;
	box-sizing: border-box;
	width: 100%;
}

/* 页面头部 */
.status-header {
	position: sticky;
	top: 0;
	background-color: #ffffff;
	padding: 30rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	z-index: 10;
	width: 100%;
	box-sizing: border-box;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	display: block;
}

/* 筛选条件 */
.filter-tabs {
	display: flex;
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
	position: relative;
}

.active-tab::after {
	content: '';
	position: absolute;
	bottom: -10rpx;
	left: 25%;
	width: 50%;
	height: 4rpx;
	background-color: #3b82f6;
	border-radius: 2rpx;
}

/* 内容区域 */
.status-content {
	flex: 1;
	width: 100%;
	box-sizing: border-box;
}

/* 空状态 */
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

/* 申请列表（求职者视角） */
.application-list {
	padding: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

.application-card {
	background-color: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

.application-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	width: 100%;
}

.application-task-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1f2937;
	flex: 1;
	padding-right: 15rpx;
}

.application-status {
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 9999rpx;
	white-space: nowrap;
	flex-shrink: 0;
}

.application-info {
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

.divider {
	height: 1rpx;
	background-color: #e5e7eb;
	width: 100%;
	margin: 20rpx 0;
}

.application-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.apply-time {
	font-size: 26rpx;
	color: #9ca3af;
}

.action-buttons {
	display: flex;
}

.cancel-button {
	background-color: #ef4444;
	color: #ffffff;
	font-size: 26rpx;
	padding: 10rpx 30rpx;
	border-radius: 8rpx;
	line-height: 1.2;
	margin: 0;
}

.contact-button {
	background-color: #10b981;
	color: #ffffff;
	font-size: 26rpx;
	padding: 10rpx 30rpx;
	border-radius: 8rpx;
	line-height: 1.2;
	margin: 0;
}

/* 任务列表（雇主视角） */
.task-with-applications {
	margin-bottom: 30rpx;
}

.task-info-card {
	background-color: #ffffff;
	border-radius: 12rpx 12rpx 0 0;
	box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

.task-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
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

.task-brief {
	display: flex;
	align-items: center;
	font-size: 28rpx;
}

.task-reward {
	color: #f97316;
	font-weight: 500;
	margin-right: 30rpx;
}

.applicants-count {
	color: #6b7280;
}

.expand-icon {
	margin-left: auto;
	font-size: 32rpx;
	color: #9ca3af;
}

.applicants-list {
	background-color: #f9fafb;
	border-radius: 0 0 12rpx 12rpx;
	border: 1rpx solid #e5e7eb;
	border-top: none;
	padding: 20rpx;
	box-sizing: border-box;
	width: 100%;
}

/* 申请者卡片 */
.applicant-card {
	background-color: #ffffff;
	border-radius: 8rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	width: 100%;
	box-sizing: border-box;
}

.applicant-card:last-child {
	margin-bottom: 0;
}

.applicant-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 15rpx;
}

.applicant-info {
	display: flex;
	align-items: center;
}

.applicant-avatar {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	margin-right: 15rpx;
}

.applicant-details {
	display: flex;
	flex-direction: column;
}

.applicant-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #1f2937;
}

.applicant-time {
	font-size: 24rpx;
	color: #9ca3af;
}

.applicant-status {
	font-size: 24rpx;
	color: #6b7280;
}

.applicant-content {
	margin-bottom: 15rpx;
	border-bottom: 1rpx solid #f3f4f6;
	padding-bottom: 15rpx;
}

.content-item {
	margin-bottom: 10rpx;
}

.content-label {
	font-size: 26rpx;
	color: #6b7280;
}

.content-value {
	font-size: 26rpx;
	color: #1f2937;
}

.content-value.description {
	display: block;
	margin-top: 5rpx;
	line-height: 1.5;
}

.content-value.reward {
	color: #f97316;
	font-weight: 500;
}

.applicant-actions {
	display: flex;
	justify-content: flex-end;
}

.accept-button {
	background-color: #10b981;
	color: #ffffff;
	font-size: 26rpx;
	padding: 10rpx 30rpx;
	border-radius: 6rpx;
	margin-left: 15rpx;
	line-height: 1.2;
}

.reject-button {
	background-color: #ef4444;
	color: #ffffff;
	font-size: 26rpx;
	padding: 10rpx 30rpx;
	border-radius: 6rpx;
	line-height: 1.2;
}

/* 状态颜色 */
.status-pending {
	background-color: #dbeafe;
	color: #1d4ed8;
}

.status-accepted {
	background-color: #d1fae5;
	color: #047857;
}

.status-rejected {
	background-color: #fee2e2;
	color: #b91c1c;
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

/* 加载更多 */
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

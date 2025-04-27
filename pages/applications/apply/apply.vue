<template>
	<view class="apply-container">
		<!-- 顶部导航栏 -->
		<view class="apply-header">
			<view class="header-top">
				<view class="back-button" @tap="goBack">
					<text class="back-icon">←</text>
				</view>
				<text class="header-title">申请任务</text>
				<view class="header-placeholder"></view>
			</view>
		</view>

		<!-- 任务信息卡片 -->
		<view class="apply-content">
			<view class="task-card">
				<view class="card-top">
					<text class="task-title">{{ task.title }}</text>
					<text class="task-status" :class="getStatusClass(task.status)">{{ getStatusText(task.status) }}</text>
				</view>
				
				<view class="task-info">
					<view class="info-item">
						<text class="info-label">报酬：</text>
						<text class="info-value reward-value">¥{{ task.reward }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">截止日期：</text>
						<text class="info-value">{{ formatDate(task.deadline) }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">发布者：</text>
						<text class="info-value">{{ task.publisher.name }}</text>
					</view>
				</view>
			</view>

			<!-- 申请表单 -->
			<view class="apply-form">
				<view class="form-title">填写申请信息</view>
				
				<view class="form-item">
					<text class="form-label">联系电话</text>
					<input class="form-input" type="number" v-model="form.phone" placeholder="请输入您的联系电话" />
				</view>
				
				<view class="form-item">
					<text class="form-label">个人介绍</text>
					<textarea class="form-textarea" v-model="form.introduction" placeholder="请简要介绍您的相关经验和技能（100-300字）" maxlength="300" />
					<text class="word-count">{{ form.introduction.length }}/300</text>
				</view>
				
				<view class="form-item">
					<text class="form-label">期望报酬</text>
					<view class="input-group">
						<text class="input-prefix">¥</text>
						<input class="form-input price-input" type="digit" v-model="form.expectedReward" placeholder="请输入您期望的报酬" />
					</view>
					<text class="form-tips">* 默认为发布者设定的报酬</text>
				</view>
				
				<view class="form-item">
					<text class="form-label">附加说明</text>
					<textarea class="form-textarea" v-model="form.additionalInfo" placeholder="可填写其他补充信息（选填）" maxlength="200" />
				</view>
			</view>
			
			<!-- 提交按钮 -->
			<view class="submit-section">
				<button class="submit-button" @tap="submitApplication">提交申请</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskId: 0, // 任务ID
				task: {
					id: 0,
					title: '',
					status: 'open',
					reward: 0,
					deadline: new Date(),
					publisher: {
						id: 0,
						name: ''
					}
				},
				form: {
					phone: '',
					introduction: '',
					expectedReward: '',
					additionalInfo: ''
				}
			}
		},
		onLoad(options) {
			console.log('apply页面接收到的参数:', options);
			
			// 获取任务ID
			if (options.id) {
				this.taskId = Number(options.id);
				this.fetchTaskInfo();
			} else {
				uni.showToast({
					title: '参数错误',
					icon: 'none'
				});
			}
			
			// 从缓存获取用户信息，预填表单
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo && userInfo.phone) {
				this.form.phone = userInfo.phone;
			}
		},
		methods: {
			// 获取任务信息
			fetchTaskInfo() {
				// 如果没有任务ID，显示错误
				if (!this.taskId) {
					uni.showToast({
						title: '任务ID不存在',
						icon: 'none'
					});
					return;
				}
				
				// 显示加载中
				uni.showLoading({
					title: '加载中...'
				});
				
				// 模拟API请求
				setTimeout(() => {
					uni.hideLoading();
					
					// 获取任务信息
					this.task = {
						id: this.taskId,
						title: '设计一个企业Logo',
						status: 'open',
						reward: 500,
						deadline: new Date('2023-12-30'),
						publisher: {
							id: 1,
							name: '张企业',
							avatar: 'http://iph.href.lu/50x50'
						}
					};
					
					// 预填期望报酬
					this.form.expectedReward = this.task.reward;
					
					console.log('已加载任务信息：', this.task);
				}, 500);
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 提交申请
			submitApplication() {
				// 表单验证
				if (!this.form.phone) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					});
					return;
				}
				
				if (!this.form.introduction || this.form.introduction.length < 100) {
					uni.showToast({
						title: '个人介绍不能少于100字',
						icon: 'none'
					});
					return;
				}
				
				if (!this.form.expectedReward) {
					uni.showToast({
						title: '请输入期望报酬',
						icon: 'none'
					});
					return;
				}
				
				// 模拟API请求
				uni.showLoading({
					title: '提交中...'
				});
				
				setTimeout(() => {
					uni.hideLoading();
					uni.showModal({
						title: '申请成功',
						content: '您的申请已提交，请等待雇主审核。',
						showCancel: false,
						success: () => {
							// 申请成功后跳转到申请状态页面
							uni.switchTab({
								url: '/pages/applications/status/status'
							});
						}
					});
				}, 1000);
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
			}
		}
	}
</script>

<style>
.apply-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f9fafb;
	box-sizing: border-box;
	width: 100%;
}

/* 顶部导航栏 */
.apply-header {
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

/* 申请内容区域 */
.apply-content {
	flex: 1;
	padding: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

/* 任务卡片 */
.task-card {
	background-color: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

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

.task-info {
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

/* 申请表单 */
.apply-form {
	background-color: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

.form-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 30rpx;
}

.form-item {
	margin-bottom: 25rpx;
	width: 100%;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #4b5563;
	margin-bottom: 10rpx;
}

.form-input {
	width: 100%;
	height: 80rpx;
	background-color: #f9fafb;
	border: 1rpx solid #e5e7eb;
	border-radius: 8rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.form-textarea {
	width: 100%;
	height: 200rpx;
	background-color: #f9fafb;
	border: 1rpx solid #e5e7eb;
	border-radius: 8rpx;
	padding: 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.word-count {
	display: block;
	text-align: right;
	font-size: 24rpx;
	color: #9ca3af;
	margin-top: 5rpx;
}

.input-group {
	display: flex;
	align-items: center;
	background-color: #f9fafb;
	border: 1rpx solid #e5e7eb;
	border-radius: 8rpx;
	width: 100%;
	height: 80rpx;
}

.input-prefix {
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #4b5563;
}

.price-input {
	border: none;
	background: transparent;
}

.form-tips {
	font-size: 24rpx;
	color: #9ca3af;
	margin-top: 5rpx;
}

/* 提交按钮 */
.submit-section {
	width: 100%;
	margin-top: 20rpx;
	margin-bottom: 50rpx;
}

.submit-button {
	width: 100%;
	height: 90rpx;
	background-color: #3b82f6;
	color: #ffffff;
	font-size: 32rpx;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>

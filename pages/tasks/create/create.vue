<template>
	<view class="create-container">
		<view class="create-card">
			<view class="page-title">发布任务</view>

			<!-- 任务标题 -->
			<view class="form-item">
				<text class="form-label">任务标题</text>
				<input class="form-input" type="text" v-model="taskForm.title" placeholder="请输入任务标题" />
			</view>

			<!-- 任务类型 -->
			<view class="form-item">
				<text class="form-label">任务类型</text>
				<picker class="form-picker" mode="selector" :range="taskTypes" @change="handleTaskTypeChange">
					<view class="picker-display">
						<text class="picker-text">{{ taskTypes[taskForm.typeIndex] }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>

			<!-- 任务描述 -->
			<view class="form-item">
				<text class="form-label">任务描述</text>
				<textarea class="form-textarea" v-model="taskForm.description" placeholder="请详细描述任务要求和内容" />
			</view>

			<!-- 任务报酬 -->
			<view class="form-item">
				<text class="form-label">任务报酬 (元)</text>
				<input class="form-input" type="digit" v-model="taskForm.reward" placeholder="请输入任务报酬" />
			</view>

			<!-- 任务人数 -->
			<view class="form-item">
				<text class="form-label">招募人数</text>
				<input class="form-input" type="number" v-model="taskForm.peopleCount" placeholder="请输入招募人数" />
			</view>

			<!-- 截止日期 -->
			<view class="form-item">
				<text class="form-label">截止日期</text>
				<picker class="form-picker" mode="date" :value="taskForm.deadline" start="2023-01-01" end="2024-12-31"
					@change="handleDateChange">
					<view class="picker-display">
						<text class="picker-text">{{ taskForm.deadline || '请选择截止日期' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>

			<!-- 联系方式 -->
			<view class="form-item">
				<text class="form-label">联系电话</text>
				<input class="form-input" type="number" v-model="taskForm.contactPhone" placeholder="请输入联系电话" />
			</view>

			<!-- 工作地点 -->
			<view class="form-item">
				<text class="form-label">工作地点</text>
				<input class="form-input" type="text" v-model="taskForm.location" placeholder="请输入工作地点" />
			</view>
		</view>

		<!-- 提交按钮 -->
		<button class="submit-button" :disabled="submitDisabled" :class="{ 'button-disabled': submitDisabled }"
			@tap="submitTask">发布任务</button>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 用户角色
const userRole = ref('employer');

// 任务类型选项
const taskTypes = ['短期兼职', '长期兼职', '项目合作', '其他'];

// 表单数据
const taskForm = ref({
	title: '',
	typeIndex: 0,
	description: '',
	reward: '',
	peopleCount: '',
	deadline: '',
	contactPhone: '',
	location: ''
});

// 检查表单是否可提交
const submitDisabled = computed(() => {
	return !taskForm.value.title
		|| !taskForm.value.description
		|| !taskForm.value.reward
		|| !taskForm.value.peopleCount
		|| !taskForm.value.deadline
		|| !taskForm.value.contactPhone;
});

// 任务类型选择处理
const handleTaskTypeChange = (e) => {
	taskForm.value.typeIndex = e.detail.value;
};

// 日期选择处理
const handleDateChange = (e) => {
	taskForm.value.deadline = e.detail.value;
};

// 发布任务
const submitTask = () => {
	if (submitDisabled.value) {
		uni.showToast({
			title: '请填写完整信息',
			icon: 'none'
		});
		return;
	}

	// 这里是你要提交的任务数据，请根据实际字段替换
	const taskData = {
		title: taskForm.value.title,
		description: taskForm.value.description,
		price: Number(this.form.price),
		peopleCount: Number(this.form.peopleCount),

		deadline: taskForm.value.deadline,
		contactPhone: taskForm.value.contactPhone,
		location: taskForm.value.location,

		// 添加其他字段...
	};

	uni.showLoading({
		title: '提交中...'
	});

	uni.request({
		url: 'http://localhost:3000/tasks',
		method: 'POST',
		header: {
			'Content-Type': 'application/json'
		},
		data: taskData,
		success(res) {
			uni.hideLoading();
			if (res.statusCode === 200 || res.statusCode === 201) {
				uni.showToast({
					title: '发布成功',
					icon: 'success'
				});
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/tasks/list/list'
					});
				}, 1500);
			} else {
				uni.showToast({
					title: '发布失败',
					icon: 'none'
				});
			}
		},
		fail(err) {
			uni.hideLoading();
			uni.showToast({
				title: '网络错误，请重试',
				icon: 'none'
			});
			console.error('任务发布失败:', err);
		}
	});
};
</script>

<style>
.create-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f9fafb;
	padding: 30rpx;
	box-sizing: border-box;
	width: 100%;
}

.create-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
	margin-bottom: 30rpx;
	width: 100%;
	box-sizing: border-box;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 30rpx;
	color: #1f2937;
}

.form-item {
	margin-bottom: 30rpx;
	width: 100%;
}

.form-label {
	font-size: 28rpx;
	color: #4b5563;
	display: block;
	margin-bottom: 15rpx;
}

.form-input {
	width: 100%;
	height: 80rpx;
	background-color: #f3f4f6;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.form-textarea {
	width: 100%;
	min-height: 200rpx;
	background-color: #f3f4f6;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.form-picker {
	width: 100%;
}

.picker-display {
	height: 80rpx;
	background-color: #f3f4f6;
	border-radius: 12rpx;
	padding: 0 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.picker-text {
	font-size: 28rpx;
	color: #1f2937;
}

.picker-arrow {
	color: #9ca3af;
	font-size: 24rpx;
}

.submit-button {
	background-color: #3b82f6;
	color: #ffffff;
	font-size: 32rpx;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 45rpx;
	margin-top: 30rpx;
	width: 100%;
	text-align: center;
	border: none;
}

.button-disabled {
	opacity: 0.5;
}
</style>

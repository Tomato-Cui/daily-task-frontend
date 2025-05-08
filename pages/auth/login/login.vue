<template>
	<view class="login-container">
		<view class="logo-container">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
		</view>

		<view class="title">欢迎登录</view>

		<view class="button-container">
			<button class="login-button" @tap="handleLogin">微信一键登录</button>
		</view>
		<view class="tip-text">登录后即可使用完整功能</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);

const handleLogin = () => {
	loading.value = true;
	// 调用微信登录接口
	wx.login({
		success: (res) => {
			if (res.code) {
				// 发送 res.code 到后台换取 openid、session_key 等信息
				wx.request({
					url: 'http://h65cf8b6.natappfree.cc/auth/wechat/login',
					method: 'POST',
					data: {
						code: res.code,
					},
					success: (response) => {
						loading.value = false;
						// 获取到用户的 openid 和 session_key 后处理
						const { openid, session_key } = response.data;
						console.log('用户 openid:', openid);

						// 保存用户登录状态
						uni.setStorageSync('userInfo', response.data);

						// 登录成功后跳转到任务列表页面
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 2000,
							success: () => {
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/tasks/list/list'
									});
								}, 2000);
							}
						});
					},
					fail: (error) => {
						loading.value = false;
						console.error('请求失败', error);
						uni.showToast({
							title: '登录失败，请重试',
							icon: 'none'
						});
					}
				});
			} else {
				loading.value = false;
				console.log('登录失败！' + res.errMsg);
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				});
			}
		},
		fail: () => {
			loading.value = false;
			uni.showToast({
				title: '登录失败，请重试',
				icon: 'none'
			});
		}
	});
};
</script>

<style>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx;
    height: 100vh;
    background-color: #f9fafb;
}

.logo-container {
    margin-top: 100rpx;
    margin-bottom: 60rpx;
}

.logo {
    width: 200rpx;
    height: 200rpx;
}

.title {
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 80rpx;
    color: #1f2937;
    text-align: center;
}

.button-container {
    width: 100%;
    margin-bottom: 40rpx;
}

.login-button {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #10b981;
    border-radius: 45rpx;
    font-size: 32rpx;
    color: white;
}

.tip-text {
    font-size: 28rpx;
    color: #6b7280;
    margin-top: 30rpx;
}
</style>

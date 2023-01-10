<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useClipboardData } from '@uni-helper/uni-use';

const title = ref('Hello');

const { clipboardData, setClipboardData } = useClipboardData();
watchEffect(() => {
  console.log('clipboardData', clipboardData.value);
});
const onUpdateClipboardData = () => {
  setClipboardData({
    data: Math.random().toFixed(2).toString(),
    showToast: true,
  });
};
</script>

<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    {{ clipboardData }}
    <button @click="onUpdateClipboardData">Update Clipboard Data</button>
  </view>
</template>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>

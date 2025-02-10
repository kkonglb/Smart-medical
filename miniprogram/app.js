App({
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'your-environment-id', // 替换实际环境ID
      traceUser: true
    })
  },
  
  // 全局数据（可选）
  globalData: {
    version: '1.0.0'
  }
}) 
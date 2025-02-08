Page({
  data: {
    symptoms: '',
    result: null,
    loading: false
  },

  // 症状输入处理
  handleInput(e) {
    this.setData({ symptoms: e.detail.value })
  },

  // 提交症状
  async submitSymptoms() {
    if (!this.data.symptoms.trim()) {
      wx.showToast({ title: '请输入症状描述', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'medicalAI',
        data: { symptoms: this.data.symptoms }
      })
      
      this.setData({
        result: res.result,
        loading: false
      })
      
    } catch (error) {
      console.error('诊断失败:', error)
      wx.showToast({ title: '诊断服务暂不可用', icon: 'none' })
      this.setData({ loading: false })
    }
  }
}) 
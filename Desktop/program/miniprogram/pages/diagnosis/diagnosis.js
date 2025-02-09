Page({
  data: {
    messages: [],       // 聊天记录
    inputText: '',      // 当前输入
    isAIThinking: false,// AI响应状态
    keywords: [],       // 提取的关键词
    showKeywordConfirm: false
  },

  // 初始化对话
  onLoad() {
    this.addAIMessage('您好，我是健康助手。请描述您的不适症状，例如：部位、持续时间、伴随症状等。')
  },

  // 添加消息
  addMessage(role, content) {
    const newMsg = {
      id: Date.now(),
      role,
      content,
      time: this.getCurrentTime()
    }
    this.setData({
      messages: [...this.data.messages, newMsg]
    })
  },

  // 添加AI消息
  addAIMessage(content) {
    this.addMessage('ai', content)
    wx.pageScrollTo({ selector: '.chat-messages', duration: 300 })
  },

  // 获取当前时间
  getCurrentTime() {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
  },

  // 输入处理
  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  // 发送消息
  async sendMessage() {
    const userInput = this.data.inputText.trim()
    if (!userInput) return

    // 添加用户消息
    this.addMessage('user', userInput)
    this.setData({ inputText: '', isAIThinking: true })

    try {
      // 模拟AI回复（后续替换为真实API）
      const aiResponse = await this.mockAIChat(userInput)
      this.addAIMessage(aiResponse.answer)
      
      // 收集到3个关键词后展示确认
      if (aiResponse.keywords) {
        this.setData({ 
          keywords: [...this.data.keywords, ...aiResponse.keywords],
          showKeywordConfirm: this.data.keywords.length >= 3
        })
      }
    } catch (error) {
      wx.showToast({ title: 'AI服务暂不可用', icon: 'none' })
    }

    this.setData({ isAIThinking: false })
  },

  // 模拟AI对话
  mockAIChat(input) {
    return new Promise(resolve => {
      setTimeout(() => {
        const responses = {
          symptom: {
            answer: "了解，请问这种症状持续多久了？",
            keywords: this.extractMockKeywords(input)
          },
          duration: {
            answer: "谢谢，症状在什么情况下会加重？",
            keywords: this.extractMockKeywords(input)
          },
          trigger: {
            answer: "已记录，正在分析您的症状...",
            keywords: this.extractMockKeywords(input)
          }
        }
        resolve(responses[this.getCurrentStep()])
      }, 800)
    })
  },

  // 模拟关键词提取
  extractMockKeywords(text) {
    const keywordMap = {
      '胸痛': ['胸痛', '胸闷'],
      '三天': ['持续三天'],
      '运动': ['运动后加重']
    }
    return Object.keys(keywordMap).find(key => text.includes(key)) 
      ? keywordMap[text.match(new RegExp(Object.keys(keywordMap).join('|')))[0]]
      : []
  },

  // 获取当前对话阶段
  getCurrentStep() {
    const stepMap = {
      0: 'symptom',
      1: 'duration',
      2: 'trigger'
    }
    return stepMap[Math.min(this.data.keywords.length, 2)]
  },

  // 更新关键词
  updateKeyword(e) {
    const { index, value } = e.detail
    this.setData({
      [`keywords[${index}]`]: value
    })
  },

  // 移除关键词
  removeKeyword(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      keywords: this.data.keywords.filter((_, i) => i !== index)
    })
  },

  // 获取视频
  async fetchVideos() {
    wx.navigateTo({
      url: `/pages/videos/videos?keywords=${this.data.keywords.join(',')}`
    })
  }
}) 
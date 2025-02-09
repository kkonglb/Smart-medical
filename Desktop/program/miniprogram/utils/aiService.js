class AIService {
  constructor() {
    this.cloud = wx.cloud
  }

  // 基础诊断方法
  async basicDiagnosis(content) {
    return this.cloud.callFunction({
      name: 'medicalAI',
      data: { content }
    })
  }

  // 二次验证（可扩展）
  async expertReview(diagnosisId) {
    return this.cloud.callFunction({
      name: 'doctorReview',
      data: { diagnosisId }
    })
  }
}

export default new AIService() 
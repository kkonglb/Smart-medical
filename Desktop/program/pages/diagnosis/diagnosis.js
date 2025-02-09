import aiService from '../../utils/aiService'

Page({
  async submitSymptoms() {
    try {
      const res = await aiService.basicDiagnosis(this.data.symptoms)
      // 处理结果...
    } catch (error) {
      // 错误处理...
    }
  }
}) 
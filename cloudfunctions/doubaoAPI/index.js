const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event) => {
  const { symptoms } = event
  
  // 构建医疗专用prompt
  const medicalPrompt = `
  你是一名全科医生助理，请根据患者描述进行初步分析：
  
  [患者主诉]
  ${symptoms}

  [输出要求]
  1. 用中文列出可能涉及的器官系统
  2. 按可能性排序（不超过3项）
  3. 使用JSON格式返回结果
  4. 包含免责声明

  [示例回复]
  {
    "systems": ["心血管系统", "呼吸系统"],
    "recommendations": ["心电图检查", "胸部X光"],
    "disclaimer": "本建议仅供参考..."
  }
  `

  // 调用豆包API
  const result = await cloud.callFunction({
    name: 'doubaoAPI',
    data: {
      messages: [
        { role: "system", content: "你是一名三甲医院全科医生" },
        { role: "user", content: medicalPrompt }
      ]
    }
  })

  return result
}

// 新增关键词提取方法
async function extractKeywords(text) {
  const prompt = `作为医疗专家，请从以下描述中提取关键症状词（最多5个）：
  
  患者描述：${text}

  要求：
  1. 只返回JSON数组格式
  2. 使用中文医学术语
  3. 按重要性排序

  示例：["头痛","发热","咳嗽"]`;

  const response = await axios.post(API_ENDPOINT, {
    messages: [
      { role: "system", content: "你是一名症状分类专家" },
      { role: "user", content: prompt }
    ]
  });

  return JSON.parse(response.data.choices[0].message.content);
} 
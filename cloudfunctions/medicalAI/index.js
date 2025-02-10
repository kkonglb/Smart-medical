const db = cloud.database()
exports.main = async (event) => {
  const { keywords } = event
  
  // 多关键词匹配
  const queries = keywords.map(keyword => 
    db.collection('medical_videos').where({
      tags: keyword
    }).get()
  )

  const results = await Promise.all(queries)
  const videos = results.flatMap(res => res.data)
  
  // 去重并按匹配度排序
  return Array.from(new Set(videos))
    .sort((a, b) => 
      b.matchScore - a.matchScore
    )
} 
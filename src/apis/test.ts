import { httpInstance } from '@/utils/http-util'


export const createAssistant = () => {
  return httpInstance({
    url:'/assistant/',
    method: "POST",
    data: JSON.stringify({
      assistantId: 1,
      userId: 1,
      name: "",
      type: "chat",
      instruction: "",
      provider: "MoonshotAI",
      model: "moonshot-v1-8k",
      maxTokens: 1024,
      inputMaxTokens: 1024,
      contextSize: 1,
      speechModel: "tts-1",
      speechVoice: "alloy",
      speechSpeed: 1,
      createTime: 1,
      lastUpdateTime: 1,
      }),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}
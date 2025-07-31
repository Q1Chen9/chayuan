<template>
  <div 
    class="ai-assistant"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="startDrag"
    :class="{ dragging: isDragging, expanded: isExpanded }"

    >
    <!-- AI助手虚拟形象 -->
    <div class="ai-avatar" @click="toggleExpanded" :class="{ thinking: isThinking }">
      <div class="virtual-character">
        <img 
          v-if="currentCharacter.type === 'image'"
          :src="currentCharacter.src" 
          :alt="currentCharacter.name"
          class="character-image"
          :class="{ animated: isThinking }"
        />
        <div 
          v-else
          class="character-fallback"
          :class="{ animated: isThinking }"
        >
          <i :class="currentCharacter.icon" :style="{ color: currentCharacter.color }"></i>
        </div>
      </div>
      <div class="status-indicator" :class="{ active: isThinking }"></div>
      <!-- 文件上传区域（隐藏） -->
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*,.gif" 
        @change="handleCharacterUpload" 
        style="display: none;"
      />
    </div>
    
    <!-- 自定义外观面板 -->
      <div class="customization-panel" v-show="showCustomization">
        <div class="panel-header">
          <span>自定义外观</span>
          <button @click="showCustomization = false" class="close-panel-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      <div class="custom-content">
        <div class="character-options">
          <h4>虚拟形象</h4>
          <div class="character-upload">
            <button @click="triggerFileUpload" class="upload-btn">
              <i class="fas fa-upload"></i>
              上传自定义形象
            </button>
            <p class="upload-tip">支持 PNG、JPG、GIF 格式</p>
          </div>
          <div class="character-grid">
            <div 
              v-for="character in characterOptions" 
              :key="character.id"
              class="character-option"
              :class="{ active: currentCharacter.id === character.id }"
              @click="selectCharacter(character)"
            >
              <img 
                v-if="character.type === 'image'"
                :src="character.src" 
                :alt="character.name"
                class="character-preview"
              />
              <div v-else class="character-icon">
                <i :class="character.icon" :style="{ color: character.color }"></i>
              </div>
              <span class="character-name">{{ character.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="animation-options">
          <h4>动画设置</h4>
          <div class="animation-controls">
            <label class="animation-toggle">
              <input 
                type="checkbox" 
                v-model="enableAnimation"
                @change="updateAnimationSetting"
              />
              <span>启用思考动画</span>
            </label>
            <div class="animation-speed">
              <label>动画速度</label>
              <select v-model="animationSpeed" @change="updateAnimationSpeed">
                <option value="slow">慢速</option>
                <option value="normal">正常</option>
                <option value="fast">快速</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 展开的聊天界面 -->
    <div class="chat-panel" v-show="isExpanded">
      <div class="chat-header">
        <span class="title">AI智能助手</span>
        <div class="header-actions">
          <button @click="analyzeCurrentPage" class="analyze-btn" :disabled="isThinking">
            <i class="fas fa-chart-line"></i>
            分析当前页面
          </button>
          <button @click="stopThinking" class="stop-btn" v-show="isThinking">
            <i class="fas fa-stop"></i>
            停止思考
          </button>
          <button @click="toggleCustomization" class="customize-btn">
            <i class="fas fa-palette"></i>
            自定义
          </button>
          <button @click="toggleToolsPanel" class="tools-toggle-btn" :class="{ collapsed: isToolsCollapsed }">
            <i class="fas fa-chevron-up" v-if="!isToolsCollapsed"></i>
            <i class="fas fa-chevron-down" v-else></i>
            <span>{{ isToolsCollapsed ? '展开工具' : '收起工具' }}</span>
          </button>
          <button @click="toggleExpanded" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
        
        <!-- 简化工具栏（工具收起时显示） -->
        <div class="mini-toolbar" v-show="isToolsCollapsed && !showHistory && !showTemplates">
          <button @click="getTodaySummary" class="mini-btn" :disabled="isThinking" title="今日总结">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button @click="getPestAlert" class="mini-btn" :disabled="isThinking" title="病虫害预警">
            <i class="fas fa-exclamation-triangle"></i>
          </button>
          <button @click="getProductionAdvice" class="mini-btn" :disabled="isThinking" title="生产建议">
            <i class="fas fa-lightbulb"></i>
          </button>
          <button @click="showHistory = true" class="mini-btn" title="历史记录">
            <i class="fas fa-history"></i>
          </button>
          <button @click="showTemplates = true" class="mini-btn" title="快捷回复">
            <i class="fas fa-comments"></i>
          </button>
        </div>
        
        <!-- 快捷操作面板 -->
      <div class="quick-actions" v-show="!showHistory && !showTemplates && !isToolsCollapsed">
        <div class="action-grid">
          <button @click="getTodaySummary" class="action-btn" :disabled="isThinking">
            <i class="fas fa-chart-bar"></i>
            <span>今日总结</span>
          </button>
          <button @click="getPestAlert" class="action-btn" :disabled="isThinking">
            <i class="fas fa-exclamation-triangle"></i>
            <span>病虫害预警</span>
          </button>
          <button @click="getProductionAdvice" class="action-btn" :disabled="isThinking">
            <i class="fas fa-lightbulb"></i>
            <span>生产建议</span>
          </button>
          <button @click="getWeatherInfo" class="action-btn" :disabled="isThinking">
            <i class="fas fa-cloud-sun"></i>
            <span>天气信息</span>
          </button>
          <button @click="showHistory = true" class="action-btn">
            <i class="fas fa-history"></i>
            <span>历史记录</span>
          </button>
          <button @click="showTemplates = true" class="action-btn">
            <i class="fas fa-comments"></i>
            <span>快速回复</span>
          </button>
        </div>
      </div>
      
      <!-- 历史记录面板 -->
      <div class="history-panel" v-show="showHistory && !isToolsCollapsed">
        <div class="panel-header">
          <span>历史对话</span>
          <div class="panel-actions">
            <button @click="clearHistory" class="clear-btn">
              <i class="fas fa-trash"></i>
              清空
            </button>
            <button @click="showHistory = false" class="back-btn">
              <i class="fas fa-arrow-left"></i>
              返回
            </button>
          </div>
        </div>
        <div class="history-list">
          <div 
            v-for="(session, index) in chatHistory" 
            :key="index" 
            class="history-item"
            @click="loadHistorySession(session)"
          >
            <div class="history-title">{{ session.title }}</div>
            <div class="history-time">{{ formatDate(session.timestamp) }}</div>
            <div class="history-preview">{{ session.preview }}</div>
          </div>
          <div v-if="chatHistory.length === 0" class="empty-history">
            <i class="fas fa-comments"></i>
            <p>暂无历史记录</p>
          </div>
        </div>
      </div>
      
      <!-- 快速回复模板面板 -->
      <div class="templates-panel" v-show="showTemplates && !isToolsCollapsed">
        <div class="panel-header">
          <span>快速回复</span>
          <button @click="showTemplates = false" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            返回
          </button>
        </div>
        <div class="templates-list">
          <div 
            v-for="template in quickTemplates" 
            :key="template.id"
            class="template-item"
            @click="useTemplate(template.content)"
          >
            <div class="template-icon">
              <i :class="template.icon"></i>
            </div>
            <div class="template-content">
              <div class="template-title">{{ template.title }}</div>
              <div class="template-text">{{ template.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-messages" ref="messagesContainer" v-show="!showHistory && !showTemplates">
        <!-- 虚拟助手形象 -->
        <div class="virtual-assistant" v-show="messages.length === 0">
          <div class="assistant-avatar" :class="{ thinking: isThinking }">
            <div class="avatar-face">
              <div class="eyes">
                <div class="eye left-eye">
                  <div class="pupil" :style="eyeStyle"></div>
                </div>
                <div class="eye right-eye">
                  <div class="pupil" :style="eyeStyle"></div>
                </div>
              </div>
              <div class="mouth" :class="{ talking: isThinking }"></div>
            </div>
            <div class="avatar-glow"></div>
          </div>
          <div class="welcome-message">
            <h3>你好！我是茶园智能助手</h3>
            <p>我可以帮助您分析茶园数据、提供种植建议、预警病虫害等。有什么可以为您服务的吗？</p>
          </div>
        </div>
        
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          class="message"
          :class="{ 'user-message': message.type === 'user', 'ai-message': message.type === 'ai' }"
        >
          <!-- AI消息的虚拟形象 -->
          <div class="message-avatar" v-if="message.type === 'ai'">
            <div class="mini-assistant-avatar" :class="{ thinking: isThinking && index === messages.length - 1 }">
              <div class="mini-avatar-face">
                <div class="mini-eyes">
                  <div class="mini-eye"></div>
                  <div class="mini-eye"></div>
                </div>
                <div class="mini-mouth"></div>
              </div>
            </div>
          </div>
          
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            <div class="message-actions" v-if="message.type === 'ai'">
              <button @click="copyMessage(message.content)" class="action-icon" title="复制">
                <i class="fas fa-copy"></i>
              </button>
              <button @click="exportMessage(message)" class="action-icon" title="导出">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 思考中的动画 -->
        <div v-if="isThinking" class="thinking-indicator">
          <div class="thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="thinking-text">AI正在思考中...</span>
        </div>
      </div>
      
      <div class="chat-input" v-show="!showHistory && !showTemplates">
        <div class="input-container">
          <button @click="toggleVoiceInput" class="voice-btn" :class="{ active: isListening }" :disabled="isThinking">
            <i class="fas fa-microphone" v-if="!isListening"></i>
            <i class="fas fa-stop" v-else></i>
          </button>
          <input 
            v-model="userInput" 
            @keyup.enter="sendMessage" 
            @input="handleUserInput"
            placeholder="请输入您的问题..."
            :disabled="isThinking"
            class="message-input"
            ref="messageInput"
          />
          <button @click="showEmojiPicker = !showEmojiPicker" class="emoji-btn" :disabled="isThinking" v-show="!isToolsCollapsed">
            <i class="fas fa-smile"></i>
          </button>
          <button @click="sendMessage" :disabled="isThinking || !userInput.trim()" class="send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        
        <!-- 表情选择器 -->
        <div class="emoji-picker" v-show="showEmojiPicker && !isToolsCollapsed">
          <div class="emoji-grid">
            <span v-for="emoji in commonEmojis" :key="emoji" @click="addEmoji(emoji)" class="emoji-item">{{ emoji }}</span>
          </div>
        </div>
        
        <!-- 语音输入状态 -->
        <div class="voice-status" v-show="isListening">
          <div class="voice-animation">
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
          </div>
          <span>正在听取语音...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, inject, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 组件状态
const position = reactive({ x: window.innerWidth - 320, y: 100 })
const isDragging = ref(false)
const isExpanded = ref(false)
const isThinking = ref(false)
const userInput = ref('')
const messages = ref([])
const abortController = ref(null) // 用于中断API请求
const messagesContainer = ref(null)
const showCustomization = ref(false)
const showQuickActions = ref(false)
const showHistory = ref(false)
const showTemplates = ref(false)
const showEmojiPicker = ref(false)
const isListening = ref(false)
const messageInput = ref(null)
const chatHistory = ref([])
const isToolsCollapsed = ref(false)
const enableAnimation = ref(true)
const animationSpeed = ref('normal')
const fileInput = ref(null)
const mousePosition = ref({ x: 0, y: 0 })
const isUserTyping = ref(false)
const quickTemplates = ref([
  {
    id: 1,
    title: '病虫害咨询',
    content: '请帮我分析当前的病虫害情况',
    icon: 'fas fa-bug'
  },
  {
    id: 2,
    title: '生产建议',
    content: '请给出茶园生产管理建议',
    icon: 'fas fa-seedling'
  },
  {
    id: 3,
    title: '天气查询',
    content: '请提供今日天气信息',
    icon: 'fas fa-cloud-sun'
  },
  {
    id: 4,
    title: '数据分析',
    content: '请分析茶园整体数据情况',
    icon: 'fas fa-chart-line'
  }
])
const commonEmojis = ref(['😊', '😂', '🤔', '👍', '👎', '❤️', '🎉', '😢', '😮', '🙏'])
const recognition = ref(null)

// 虚拟形象相关
const characterOptions = ref([
  { id: 1, type: 'icon', icon: 'fas fa-robot', color: '#4CAF50', name: '机器人' },
  { id: 2, type: 'icon', icon: 'fas fa-user-astronaut', color: '#2196F3', name: '宇航员' },
  { id: 3, type: 'icon', icon: 'fas fa-user-ninja', color: '#9C27B0', name: '忍者' },
  { id: 4, type: 'icon', icon: 'fas fa-cat', color: '#FF9800', name: '小猫' },
  { id: 5, type: 'icon', icon: 'fas fa-dragon', color: '#F44336', name: '小龙' },
  { id: 6, type: 'icon', icon: 'fas fa-ghost', color: '#607D8B', name: '幽灵' },
  { id: 7, type: 'icon', icon: 'fas fa-magic', color: '#E91E63', name: '魔法师' },
  { id: 8, type: 'icon', icon: 'fas fa-leaf', color: '#4CAF50', name: '茶叶精灵' }
])

const currentCharacter = ref(characterOptions.value[0])

// 虚拟形象相关方法
const selectCharacter = (character) => {
  currentCharacter.value = character
  localStorage.setItem('ai-assistant-character', JSON.stringify(character))
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleCharacterUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const customCharacter = {
        id: Date.now(),
        type: 'image',
        src: e.target.result,
        name: '自定义形象'
      }
      characterOptions.value.push(customCharacter)
      selectCharacter(customCharacter)
    }
    reader.readAsDataURL(file)
  }
}

const updateAnimationSetting = () => {
  localStorage.setItem('ai-assistant-animation', enableAnimation.value.toString())
}

const updateAnimationSpeed = () => {
  localStorage.setItem('ai-assistant-animation-speed', animationSpeed.value)
}

// 虚拟助手交互功能
const handleMouseMove = (event) => {
  mousePosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

const handleUserInput = () => {
  isUserTyping.value = true
  clearTimeout(window.typingTimer)
  window.typingTimer = setTimeout(() => {
    isUserTyping.value = false
  }, 1000)
}

// 计算眼睛看向鼠标的角度
const eyeStyle = computed(() => {
  if (messages.value.length > 0) return {}
  
  const avatarCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const deltaX = mousePosition.value.x - avatarCenter.x
  const deltaY = mousePosition.value.y - avatarCenter.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const maxDistance = 100
  
  const moveX = Math.max(-4, Math.min(4, (deltaX / maxDistance) * 4))
  const moveY = Math.max(-4, Math.min(4, (deltaY / maxDistance) * 4))
  
  return {
    transform: `translate(${moveX}px, ${moveY}px)`
  }
})

// 拖拽相关
let dragOffset = { x: 0, y: 0 }

const startDrag = (e) => {
  if (e.target.closest('.chat-panel')) return // 不在聊天面板上拖拽
  
  isDragging.value = true
  dragOffset.x = e.clientX - position.x
  dragOffset.y = e.clientY - position.y
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  
  position.x = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x))
  position.y = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 切换展开状态
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 切换工具面板
const toggleToolsPanel = () => {
  isToolsCollapsed.value = !isToolsCollapsed.value
  // 保存状态到本地存储
  localStorage.setItem('ai-assistant-tools-collapsed', isToolsCollapsed.value.toString())
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isThinking.value) return
  
  const message = userInput.value.trim()
  userInput.value = ''
  showEmojiPicker.value = false
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  })
  
  nextTick(() => {
    scrollToBottom()
  })
  
  // 调用AI
  await callDeepSeekAPI(message)
  
  // 保存对话历史
  saveConversation()
}

// 分析当前页面
const analyzeCurrentPage = async () => {
  if (isThinking.value) return
  
  const pageData = await getCurrentPageData()
  
  // 构建更智能的分析提示
  let analysisPrompt = `请分析以下茶园管理系统的页面数据：\n\n`
  analysisPrompt += `页面名称：${pageData.pageName}\n`
  analysisPrompt += `页面路径：${pageData.page}\n`
  analysisPrompt += `分析时间：${pageData.timestamp}\n\n`
  
  // 添加DOM数据分析
  if (pageData.domData && !pageData.domData.error) {
    analysisPrompt += `页面内容分析：\n`
    
    if (pageData.domData.visibleText && pageData.domData.visibleText.length > 0) {
      analysisPrompt += `- 页面显示的主要信息：${pageData.domData.visibleText.slice(0, 10).join('、')}\n`
    }
    
    if (pageData.domData.statistics && pageData.domData.statistics.length > 0) {
      analysisPrompt += `- 页面统计数据：${pageData.domData.statistics.slice(0, 5).join('、')}\n`
    }
    
    if (pageData.domData.charts && pageData.domData.charts.length > 0) {
      analysisPrompt += `- 页面图表数量：${pageData.domData.charts.length}个\n`
    }
    
    if (pageData.domData.tables && pageData.domData.tables.length > 0) {
      analysisPrompt += `- 页面表格数量：${pageData.domData.tables.length}个\n`
      pageData.domData.tables.forEach((table, index) => {
        if (table.headers && table.headers.length > 0) {
          analysisPrompt += `  表格${index + 1}列标题：${table.headers.join('、')}\n`
        }
      })
    }
  }
  
  // 添加API数据分析
  if (pageData.apiData) {
    analysisPrompt += `\nAPI数据：\n${JSON.stringify(pageData.apiData, null, 2)}\n`
  }
  
  // 根据页面类型提供专门的分析指导
  if (pageData.page === '/monitor') {
    analysisPrompt += `\n请根据以上环境监测数据提供专业的茶园环境分析和建议，包括：\n`
    analysisPrompt += `1. 土壤环境状况分析（湿度、温度、养分等）\n`
    analysisPrompt += `2. 空气质量和气候条件评估\n`
    analysisPrompt += `3. 环境异常预警和风险识别\n`
    analysisPrompt += `4. 环境优化建议和管理措施\n`
    analysisPrompt += `5. 茶叶品质与环境因素的关联分析`
  } else {
    analysisPrompt += `\n请根据以上信息提供专业的茶园管理数据分析和建议，包括：\n`
    analysisPrompt += `1. 当前页面数据的关键指标分析\n`
    analysisPrompt += `2. 发现的问题或异常情况\n`
    analysisPrompt += `3. 改进建议和操作指导\n`
    analysisPrompt += `4. 相关的茶园管理最佳实践`
  }
  
  messages.value.push({
    type: 'user',
    content: `分析当前页面数据（${pageData.pageName}）`,
    timestamp: new Date()
  })
  
  nextTick(() => {
    scrollToBottom()
  })
  
  await callDeepSeekAPI(analysisPrompt)
}

// 获取当前页面数据
const getCurrentPageData = async () => {
  try {
    const currentPath = route.path
    let pageData = {
      page: currentPath,
      timestamp: new Date().toISOString(),
      pageName: getPageName(currentPath)
    }
    
    // 获取页面DOM中的可见数据
    const domData = extractPageDOMData()
    pageData.domData = domData
    
    // 根据不同页面获取相应的API数据
    if (currentPath === '/' || currentPath === '/home') {
      // 首页数据
      try {
        const responses = await Promise.all([
          fetch('http://localhost:3000/api/health-stats'),
          fetch('http://localhost:3000/api/pest-distribution'),
          fetch('http://localhost:3000/api/detection-trend')
        ])
        
        const [healthStats, pestDistribution, detectionTrend] = await Promise.all(
          responses.map(r => r.json())
        )
        
        pageData.apiData = {
          healthStats,
          pestDistribution,
          detectionTrend
        }
      } catch (apiError) {
        console.warn('API数据获取失败，使用DOM数据:', apiError)
      }
    } else if (currentPath === '/monitor') {
      // 环境监测页面数据
      try {
        const responses = await Promise.all([
          fetch('http://localhost:3000/api/environment-data'),
          fetch('http://localhost:3000/api/soil-data'),
          fetch('http://localhost:3000/api/air-quality'),
          fetch('http://localhost:3000/api/warnings')
        ])
        
        const [environmentData, soilData, airQuality, warnings] = await Promise.all(
          responses.map(r => r.json().catch(() => null))
        )
        
        pageData.apiData = {
          environmentData,
          soilData,
          airQuality,
          warnings
        }
      } catch (apiError) {
        console.warn('环境数据获取失败，使用DOM数据:', apiError)
      }
    } else if (currentPath === '/production') {
      // 生产页面数据
      try {
        const response = await fetch('http://localhost:3000/api/tasks')
        const tasks = await response.json()
        pageData.apiData = { tasks }
      } catch (apiError) {
        console.warn('API数据获取失败，使用DOM数据:', apiError)
      }
    } else if (currentPath === '/prediction') {
      // 预测页面数据
      try {
        const response = await fetch('http://localhost:3000/api/predictions')
        const predictions = await response.json()
        pageData.apiData = { predictions }
      } catch (apiError) {
        console.warn('API数据获取失败，使用DOM数据:', apiError)
      }
    } else if (currentPath === '/sales') {
      // 销售页面数据
      try {
        const response = await fetch('http://localhost:3000/api/sales')
        const sales = await response.json()
        pageData.apiData = { sales }
      } catch (apiError) {
        console.warn('API数据获取失败，使用DOM数据:', apiError)
      }
    }
    
    return pageData
  } catch (error) {
    console.error('获取页面数据失败:', error)
    return { 
      page: route.path, 
      error: '数据获取失败',
      domData: extractPageDOMData()
    }
  }
}

// 获取页面名称
const getPageName = (path) => {
  const pageNames = {
    '/': '首页',
    '/home': '首页',
    '/monitor': '环境监测页面',
    '/production': '生产页面',
    '/prediction': '预测页面',
    '/sales': '销售页面'
  }
  return pageNames[path] || '未知页面'
}

// 提取页面DOM数据
const extractPageDOMData = () => {
  try {
    const data = {
      title: document.title,
      url: window.location.href,
      visibleText: [],
      charts: [],
      tables: [],
      statistics: []
    }
    
    // 提取可见文本内容
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="title"], div[class*="label"], div[class*="value"]')
    textElements.forEach(el => {
      const text = el.textContent?.trim()
      if (text && text.length > 0 && text.length < 200 && !text.includes('AI智能助手')) {
        data.visibleText.push(text)
      }
    })
    
    // 提取图表信息
    const chartElements = document.querySelectorAll('canvas, svg, [class*="chart"], [class*="graph"]')
    chartElements.forEach((el, index) => {
      const chartInfo = {
        type: el.tagName.toLowerCase(),
        id: el.id || `chart-${index}`,
        className: el.className
      }
      data.charts.push(chartInfo)
    })
    
    // 提取表格数据
    const tables = document.querySelectorAll('table')
    tables.forEach((table, index) => {
      const tableData = {
        id: `table-${index}`,
        headers: [],
        rowCount: table.rows.length
      }
      
      if (table.rows.length > 0) {
        const headerRow = table.rows[0]
        for (let cell of headerRow.cells) {
          tableData.headers.push(cell.textContent?.trim())
        }
      }
      
      data.tables.push(tableData)
    })
    
    // 提取统计数据
    const statElements = document.querySelectorAll('[class*="stat"], [class*="count"], [class*="number"], [class*="metric"]')
    statElements.forEach(el => {
      const text = el.textContent?.trim()
      if (text && /\d/.test(text)) {
        data.statistics.push(text)
      }
    })
    
    return data
  } catch (error) {
    console.error('提取DOM数据失败:', error)
    return { error: 'DOM数据提取失败' }
  }
}

// 调用DeepSeek API
const callDeepSeekAPI = async (prompt) => {
  isThinking.value = true
  
  // 创建新的AbortController
  abortController.value = new AbortController()
  
  try {
    const response = await fetch('http://localhost:3000/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: prompt }),
      signal: abortController.value.signal
    })
    
    if (!response.ok) {
      throw new Error('API调用失败')
    }
    
    const data = await response.json()
    
    messages.value.push({
      type: 'ai',
      content: data.response,
      timestamp: new Date()
    })
    
  } catch (error) {
    if (error.name === 'AbortError') {
      // 请求被中断
      messages.value.push({
        type: 'ai',
        content: '思考已停止。',
        timestamp: new Date()
      })
    } else {
      console.error('AI调用失败:', error)
      messages.value.push({
        type: 'ai',
        content: '抱歉，AI服务暂时不可用，请稍后再试。',
        timestamp: new Date()
      })
    }
  } finally {
    isThinking.value = false
    abortController.value = null
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 格式化消息
const formatMessage = (content) => {
  return content.replace(/\n/g, '<br>')
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 自定义外观方法
const toggleCustomization = () => {
  showCustomization.value = !showCustomization.value
}

// 从本地存储加载自定义设置
const loadCustomSettings = () => {
  const savedCharacter = localStorage.getItem('ai-assistant-character')
  const savedToolsCollapsed = localStorage.getItem('ai-assistant-tools-collapsed')
  const savedAnimation = localStorage.getItem('ai-assistant-animation')
  const savedAnimationSpeed = localStorage.getItem('ai-assistant-animation-speed')
  
  if (savedCharacter) {
    try {
      currentCharacter.value = JSON.parse(savedCharacter)
    } catch (e) {
      console.error('加载虚拟形象设置失败:', e)
    }
  }
  
  if (savedAnimation) {
    enableAnimation.value = savedAnimation === 'true'
  }
  
  if (savedAnimationSpeed) {
    animationSpeed.value = savedAnimationSpeed
  }
  
  if (savedToolsCollapsed) {
    isToolsCollapsed.value = savedToolsCollapsed === 'true'
  }
}

// 语音输入功能
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.continuous = false
    recognition.value.interimResults = false
    recognition.value.lang = 'zh-CN'
    
    recognition.value.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      userInput.value = transcript
      isListening.value = false
    }
    
    recognition.value.onerror = () => {
      isListening.value = false
    }
    
    recognition.value.onend = () => {
      isListening.value = false
    }
  }
}

const toggleVoiceInput = () => {
  if (!recognition.value) {
    alert('您的浏览器不支持语音识别功能')
    return
  }
  
  if (isListening.value) {
    recognition.value.stop()
    isListening.value = false
  } else {
    recognition.value.start()
    isListening.value = true
  }
}

// 表情功能
const addEmoji = (emoji) => {
  userInput.value += emoji
  showEmojiPicker.value = false
  messageInput.value?.focus()
}

// 停止思考功能
const stopThinking = () => {
  if (abortController.value) {
    abortController.value.abort()
    console.log('AI思考已被用户中断')
  }
}

// 快捷操作
const getTodaySummary = async () => {
  const message = '请为我总结今天的茶园数据情况'
  messages.value.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  })
  nextTick(() => {
    scrollToBottom()
  })
  await callDeepSeekAPI(message)
}

const getPestAlert = async () => {
  const message = '请检查当前的病虫害预警信息'
  messages.value.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  })
  nextTick(() => {
    scrollToBottom()
  })
  await callDeepSeekAPI(message)
}

const getProductionAdvice = async () => {
  const message = '请给出当前茶园生产管理建议'
  messages.value.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  })
  nextTick(() => {
    scrollToBottom()
  })
  await callDeepSeekAPI(message)
}

const getWeatherInfo = async () => {
  const message = '请提供今日天气信息和对茶园的影响分析'
  messages.value.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  })
  nextTick(() => {
    scrollToBottom()
  })
  await callDeepSeekAPI(message)
}

// 模板功能
const useTemplate = (content) => {
  userInput.value = content
  showTemplates.value = false
  messageInput.value?.focus()
}

// 历史记录功能
const saveConversation = () => {
  if (messages.value.length > 1) {
    const conversation = {
      id: Date.now(),
      title: messages.value[1]?.content?.substring(0, 20) + '...' || '新对话',
      preview: messages.value[1]?.content?.substring(0, 50) + '...' || '',
      messages: [...messages.value],
      timestamp: new Date()
    }
    
    const history = JSON.parse(localStorage.getItem('ai-chat-history') || '[]')
    history.unshift(conversation)
    
    // 只保留最近20条记录
    if (history.length > 20) {
      history.splice(20)
    }
    
    localStorage.setItem('ai-chat-history', JSON.stringify(history))
    loadChatHistory()
  }
}

const loadChatHistory = () => {
  const history = JSON.parse(localStorage.getItem('ai-chat-history') || '[]')
  chatHistory.value = history
}

const loadHistorySession = (session) => {
  messages.value = [...session.messages]
  showHistory.value = false
  nextTick(() => {
    scrollToBottom()
  })
}

const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    localStorage.removeItem('ai-chat-history')
    loadChatHistory()
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 消息操作
const copyMessage = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
    // 可以添加提示
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = content
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const exportMessage = (message) => {
  const blob = new Blob([message.content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `AI回复_${new Date().toLocaleString()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 初始化
onMounted(() => {
  // 加载自定义设置
  loadCustomSettings()
  
  // 初始化语音识别
  initSpeechRecognition()
  
  // 加载历史记录
  loadChatHistory()
  
  // 添加鼠标移动监听器
  document.addEventListener('mousemove', handleMouseMove)
  
  // 添加欢迎消息
  messages.value.push({
    type: 'ai',
    content: '您好！我是您的AI智能助手，可以帮您分析茶园数据、回答问题。点击"分析当前页面"按钮，我可以为您分析当前页面的数据情况。您也可以点击"自定义"按钮来个性化我的外观！',
    timestamp: new Date()
  })
})

onUnmounted(() => {
  // 移除事件监听器
  document.removeEventListener('mousemove', handleMouseMove)
  
  // 清理定时器
  if (window.typingTimer) {
    clearTimeout(window.typingTimer)
  }
})
</script>

<style lang="scss" scoped>
.ai-assistant {
  position: fixed;
  z-index: 9999;
  user-select: none;
  
  &.dragging {
    .ai-avatar {
      transform: scale(0.95);
    }
  }
  
  &.expanded {
    .ai-avatar {
      border-radius: 12px 12px 0 0;
    }
  }
}

.ai-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: transparent;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &.thinking {
    .virtual-character {
      animation: bounce 1s infinite;
    }
  }
  
  .virtual-character {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    
    .character-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      
      &.animated {
        animation: wiggle 0.8s infinite;
      }
    }
    
    .character-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      border-radius: 50%;
      
      i {
        font-size: 24px;
      }
      
      &.animated {
        animation: wiggle 0.8s infinite;
      }
    }
  }
  
  .status-indicator {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 12px;
    height: 12px;
    background: #4CAF50;
    border-radius: 50%;
    border: 2px solid white;
    
    &.active {
      animation: pulse 1.5s infinite;
    }
  }
}

.chat-panel {
  position: absolute;
  top: 60px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #006454 0%, #00a085 100%);
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title {
    font-weight: 600;
    font-size: 16px;
  }
  
  .header-actions {
    display: flex;
    gap: 10px;
    
    .analyze-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .stop-btn {
      background: rgba(255, 87, 87, 0.8);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      animation: pulse-red 1.5s infinite;
      
      &:hover {
        background: rgba(255, 87, 87, 0.9);
        transform: scale(1.05);
      }
    }
    
    .customize-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .tools-toggle-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
      }
      
      &.collapsed {
        background: rgba(255, 255, 255, 0.3);
      }
      
      i {
        font-size: 10px;
      }
      
      span {
        font-size: 11px;
      }
    }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
}

.message {
  display: flex;
  
  &.user-message {
    justify-content: flex-end;
    
    .message-content {
      background: linear-gradient(135deg, #006454 0%, #00a085 100%);
      color: white;
      border-radius: 18px 18px 4px 18px;
    }
  }
  
  &.ai-message {
    justify-content: flex-start;
    display: flex;
    align-items: flex-start;
    
    .message-content {
      background: #f5f5f5;
      color: #333;
      border-radius: 18px 18px 18px 4px;
      flex: 1;
    }
  }
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  
  .message-text {
    line-height: 1.4;
    word-wrap: break-word;
  }
  
  .message-time {
    font-size: 11px;
    opacity: 0.7;
    margin-top: 5px;
  }
}

.thinking-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 18px 18px 18px 4px;
  max-width: 80%;
  
  .thinking-dots {
    display: flex;
    gap: 4px;
    
    span {
      width: 6px;
      height: 6px;
      background: #999;
      border-radius: 50%;
      animation: thinking 1.4s infinite ease-in-out;
      
      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
    }
  }
  
  .thinking-text {
    font-size: 12px;
    color: #666;
  }
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  
  .input-container {
      display: flex;
      gap: 10px;
      
      .voice-btn, .emoji-btn {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: #f0f0f0;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 14px;

        &:hover:not(:disabled) {
          background: #e0e0e0;
          color: #333;
        }

        &.active {
          background: linear-gradient(135deg, #006454, #00a085);
          color: white;
          animation: pulse 1.5s infinite;
        }

        &:disabled {
          background: #f5f5f5;
          color: #ccc;
          cursor: not-allowed;
        }
      }
      
      .message-input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
        
        &:focus {
          border-color: #006454;
        }
        
        &:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
      }
      
      .send-btn {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #006454 0%, #00a085 100%);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
    
    // 表情选择器
    .emoji-picker {
      position: absolute;
      bottom: 60px;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-width: 280px;
    }

    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }

    .emoji-item {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 6px;
      font-size: 18px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f0f0f0;
      }
    }

    // 语音输入状态
    .voice-status {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 100, 84, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .voice-animation {
      display: flex;
      gap: 3px;
    }

    .wave {
      width: 3px;
      height: 20px;
      background: white;
      border-radius: 2px;
      animation: wave 1.2s infinite ease-in-out;

      &:nth-child(2) {
        animation-delay: 0.1s;
      }

      &:nth-child(3) {
        animation-delay: 0.2s;
      }
    }

    @keyframes wave {
      0%, 40%, 100% {
        transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1);
      }
    }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes thinking {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

// 自定义外观面板样式
.customization-panel {
  position: absolute;
  top: 60px;
  left: -300px;
  width: 280px;
  height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10000;
}

.custom-header {
  background: linear-gradient(135deg, #006454 0%, #00a085 100%);
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  
  .close-custom-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.custom-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  
  h4 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }
}

.avatar-options {
  margin-bottom: 25px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.avatar-option {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    border-color: #006454;
    background: linear-gradient(135deg, #006454 0%, #00a085 100%);
    
    i {
      color: white !important;
    }
  }
  
  i {
    font-size: 16px;
    color: #666;
  }
}

.color-options {
  margin-bottom: 20px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.color-option {
  width: 50px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    border-color: #006454;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #006454;
  }
}

.transparency-options {
  margin-bottom: 20px;
}

.transparency-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.transparency-label {
  font-size: 14px;
  font-weight: bold;
  color: #006454;
  min-width: 40px;
}

.transparency-slider {
  flex: 1;
  height: 6px;
  background: linear-gradient(to right, #e0e0e0, #006454);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.transparency-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #006454;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.transparency-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #006454;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-color-options {
  margin-bottom: 20px;
}

.custom-color-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.color-picker {
  width: 50px;
  height: 35px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

.apply-color-btn {
  padding: 8px 16px;
  background: #006454;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.apply-color-btn:hover {
  background: #004d3f;
  transform: translateY(-1px);
}

// 虚拟助手形象样式
  .virtual-assistant {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    text-align: center;
  }
  
  .assistant-avatar {
    position: relative;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #006454, #00a86b);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0, 100, 84, 0.3);
    transition: all 0.3s ease;
  }
  
  .assistant-avatar.thinking {
    animation: pulse 2s infinite;
  }
  
  .avatar-face {
    position: relative;
    width: 80px;
    height: 80px;
  }
  
  .eyes {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .eye {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    position: relative;
    animation: blink 4s infinite;
  }
  
  .pupil {
    width: 8px;
    height: 8px;
    background: #333;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: look-around 6s infinite;
  }
  
  .mouth {
    width: 20px;
    height: 10px;
    border: 2px solid white;
    border-top: none;
    border-radius: 0 0 20px 20px;
    margin: 0 auto;
    transition: all 0.3s ease;
  }
  
  .mouth.talking {
    animation: talk 0.5s infinite alternate;
  }
  
  .avatar-glow {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(0, 100, 84, 0.2), rgba(0, 168, 107, 0.2));
    animation: glow 3s infinite;
    z-index: -1;
  }
  
  .welcome-message {
    max-width: 300px;
  }
  
  .welcome-message h3 {
    color: #006454;
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  .welcome-message p {
    color: #666;
    line-height: 1.5;
    font-size: 14px;
  }
  
  // 消息中的迷你虚拟形象
  .message-avatar {
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .mini-assistant-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #006454, #00a86b);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 100, 84, 0.2);
    transition: all 0.3s ease;
  }
  
  .mini-assistant-avatar.thinking {
    animation: mini-pulse 1.5s infinite;
  }
  
  .mini-avatar-face {
    position: relative;
    width: 24px;
    height: 24px;
  }
  
  .mini-eyes {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  
  .mini-eye {
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    animation: mini-blink 3s infinite;
  }
  
  .mini-mouth {
    width: 8px;
    height: 4px;
    border: 1px solid white;
    border-top: none;
    border-radius: 0 0 8px 8px;
    margin: 0 auto;
  }
  
  // 动画效果
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes mini-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes blink {
    0%, 90%, 100% { height: 16px; }
    95% { height: 2px; }
  }
  
  @keyframes mini-blink {
    0%, 90%, 100% { height: 4px; }
    95% { height: 1px; }
  }
  
  @keyframes look-around {
    0%, 100% { transform: translate(-50%, -50%); }
    25% { transform: translate(-30%, -50%); }
    50% { transform: translate(-50%, -30%); }
    75% { transform: translate(-70%, -50%); }
  }
  
  @keyframes talk {
    0% { height: 10px; }
    100% { height: 6px; }
  }
  
  @keyframes glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.02); }
  }
  
  @keyframes pulse-red {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  
  // 简化工具栏样式
  .mini-toolbar {
   display: flex;
   justify-content: center;
   gap: 8px;
   padding: 10px 15px;
   background: rgba(0, 100, 84, 0.05);
   border-radius: 8px;
   margin: 10px 15px;
   
   .mini-btn {
     width: 36px;
     height: 36px;
     border: none;
     border-radius: 50%;
     background: white;
     color: #006454;
     cursor: pointer;
     display: flex;
     align-items: center;
     justify-content: center;
     transition: all 0.3s ease;
     font-size: 14px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     
     &:hover:not(:disabled) {
       background: #006454;
       color: white;
       transform: scale(1.1);
       box-shadow: 0 4px 8px rgba(0, 100, 84, 0.3);
     }
     
     &:disabled {
       opacity: 0.5;
       cursor: not-allowed;
       transform: none;
     }
   }
 }
 
 // 快捷操作面板样式
 .quick-actions {
   padding: 20px;
   
   .action-grid {
     display: grid;
     grid-template-columns: repeat(2, 1fr);
     gap: 12px;
   }
   
   .action-btn {
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 8px;
     padding: 16px 12px;
     background: white;
     border: 2px solid #e0e0e0;
     border-radius: 12px;
     cursor: pointer;
     transition: all 0.3s ease;
     font-size: 12px;
     color: #666;
     
     &:hover:not(:disabled) {
       border-color: #006454;
       color: #006454;
       transform: translateY(-2px);
       box-shadow: 0 4px 12px rgba(0, 100, 84, 0.15);
     }
     
     &:disabled {
       opacity: 0.5;
       cursor: not-allowed;
       transform: none;
     }
     
     i {
       font-size: 20px;
     }
     
     span {
       font-weight: 500;
     }
   }
 }

// 历史记录和模板面板样式
.history-panel, .templates-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .panel-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: #333;
    
    .panel-actions {
      display: flex;
      gap: 10px;
    }
    
    .clear-btn, .back-btn {
      background: none;
      border: 1px solid #e0e0e0;
      color: #666;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #006454;
        color: #006454;
      }
    }
  }
}

.history-list, .templates-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.history-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #006454;
    background-color: #f8fffe;
  }
  
  .history-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .history-time {
    font-size: 11px;
    color: #999;
    margin-bottom: 6px;
  }
  
  .history-preview {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }
}

.template-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #006454;
    background-color: #f8fffe;
  }
  
  .template-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #006454, #00a085);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
  }
  
  .template-content {
    flex: 1;
    
    .template-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
      font-size: 14px;
    }
    
    .template-text {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
  }
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  
  i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
}

// 消息操作按钮样式
.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

// 虚拟形象相关样式
.character-options {
  .character-upload {
    margin-bottom: 16px;
    text-align: center;
    
    .upload-btn {
      background: linear-gradient(135deg, #006454, #00a085);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 100, 84, 0.3);
      }
      
      i {
        margin-right: 6px;
      }
    }
    
    .upload-tip {
      margin: 8px 0 0 0;
      font-size: 12px;
      color: #666;
    }
  }
  
  .character-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    
    .character-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      border: 2px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8f9fa;
      
      &:hover {
        border-color: #006454;
        background: #e8f5f3;
      }
      
      &.active {
        border-color: #006454;
        background: linear-gradient(135deg, rgba(0, 100, 84, 0.1), rgba(0, 168, 107, 0.1));
      }
      
      .character-preview {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 6px;
      }
      
      .character-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        margin-bottom: 6px;
        
        i {
          font-size: 18px;
        }
      }
      
      .character-name {
        font-size: 12px;
        color: #333;
        text-align: center;
      }
    }
  }
}

.animation-options {
  .animation-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .animation-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      input[type="checkbox"] {
        margin: 0;
      }
      
      span {
        font-size: 14px;
        color: #333;
      }
    }
    
    .animation-speed {
      display: flex;
      align-items: center;
      gap: 8px;
      
      label {
        font-size: 14px;
        color: #333;
        min-width: 60px;
      }
      
      select {
        flex: 1;
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
    }
  }
}

// 动画定义
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.message:hover .message-actions {
  opacity: 1;
}

.action-icon {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
}

.ai-message .action-icon {
  color: rgba(0, 0, 0, 0.5);
  
  &:hover {
    color: #333;
    background: rgba(0, 0, 0, 0.05);
  }
}
</style>
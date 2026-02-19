import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  MessageCircle,
  Send,
  Loader2,
  Lightbulb,
  BookOpen
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { groqService } from '@/api/groqService'
import { useAuth } from '@/contexts/AuthContext'
import { supabaseService } from '@/api/supabaseClient'
import toast from 'react-hot-toast'

// Typing indicator component
const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-lg">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">AI is typing</span>
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2
              }}
            />
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const AIInsights = () => {
  const { user } = useAuth()
  const [insights, setInsights] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState({
    insights: false,
    recommendations: false,
    chat: false
  })
  const [entries, setEntries] = useState([])
  const [userProfile, setUserProfile] = useState({})

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      console.log('🤖 AI Coach loading entries for user:', user.id)
      const userEntries = await supabaseService.getUserEntries(user.id)
      console.log('✅ AI Coach loaded', userEntries.length, 'entries from Supabase')
      setEntries(userEntries)
      
      // Calculate user profile stats
      const categoryStats = userEntries.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1
        return acc
      }, {})
      
      setUserProfile({ categoryStats })
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const generateInsights = async () => {
    if (entries.length === 0) {
      toast.error('No learning entries found. Add some entries first!')
      return
    }

    setLoading(prev => ({ ...prev, insights: true }))
    try {
      const result = await groqService.generateLearningInsights(entries)
      setInsights(result)
      toast.success('AI insights generated!')
    } catch (error) {
      toast.error('Failed to generate insights')
      console.error(error)
    } finally {
      setLoading(prev => ({ ...prev, insights: false }))
    }
  }

  const generateRecommendations = async () => {
    if (entries.length === 0) {
      toast.error('No learning entries found. Add some entries first!')
      return
    }

    setLoading(prev => ({ ...prev, recommendations: true }))
    try {
      const result = await groqService.generateSkillRecommendations(userProfile, entries)
      setRecommendations(result)
      toast.success('Skill recommendations generated!')
    } catch (error) {
      toast.error('Failed to generate recommendations')
      console.error(error)
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }))
    }
  }

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return

    const userMessage = chatMessage.trim()
    setChatMessage('')
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }])
    
    setLoading(prev => ({ ...prev, chat: true }))
    try {
      const context = `User has ${entries.length} learning entries. Recent topics: ${entries.slice(-3).map(e => e.title).join(', ')}`
      const response = await groqService.chatWithAI(userMessage, context)
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      toast.error('Failed to get AI response')
      console.error(error)
    } finally {
      setLoading(prev => ({ ...prev, chat: false }))
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            AI Learning Coach
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Get personalized insights and recommendations powered by Groq AI
        </p>
      </motion.div>


      {/* AI Chat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <MessageCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Chat with AI Coach
            </h2>
          </div>

          {/* Chat History */}
          <div className="h-64 overflow-y-auto mb-4 space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start a conversation with your AI learning coach!</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {loading.chat && <TypingIndicator />}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about learning, skills, or career advice..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              disabled={loading.chat}
            />
            <Button
              onClick={sendChatMessage}
              disabled={!chatMessage.trim() || loading.chat}
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AIInsights
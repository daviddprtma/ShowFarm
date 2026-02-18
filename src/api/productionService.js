// Production-ready service with local-first approach
export const productionService = {
  // Create entry with local-first approach
  async createEntry(entryData) {
    // Always save locally first
    const entries = JSON.parse(localStorage.getItem('showfarm_entries') || '[]')
    entries.unshift(entryData)
    localStorage.setItem('showfarm_entries', JSON.stringify(entries))
    
    // Try cloud sync in background (non-blocking)
    this.syncToCloud(entryData).catch(err => 
      console.log('Background cloud sync failed:', err.message)
    )
    
    return entryData
  },

  // Get entries with local-first approach
  async getUserEntries(userId) {
    const entries = JSON.parse(localStorage.getItem('showfarm_entries') || '[]')
    return entries.filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Update user with local-first approach
  async updateUser(userId, updates) {
    // Update local user
    const users = JSON.parse(localStorage.getItem('showfarm_users') || '[]')
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem('showfarm_users', JSON.stringify(users))
      
      // Update current user
      const currentUser = JSON.parse(localStorage.getItem('showfarm_user') || '{}')
      if (currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updates }
        localStorage.setItem('showfarm_user', JSON.stringify(updatedUser))
        return updatedUser
      }
    }
    
    return null
  },

  // Background cloud sync (non-blocking)
  async syncToCloud(entryData) {
    try {
      const { supabaseService } = await import('./supabaseClient')
      await supabaseService.createEntry(entryData)
      console.log('✅ Background cloud sync successful')
    } catch (error) {
      console.log('⚠️ Background cloud sync failed:', error.message)
    }
  }
}
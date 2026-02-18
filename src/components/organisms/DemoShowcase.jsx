import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DemoShowcase = () => {
  

  const metrics = [
    { label: 'Demo Views', value: '12,847', change: '+23%' },
    { label: 'User Signups', value: '2,394', change: '+45%' },
    { label: 'Blockchain Verifications', value: '8,921', change: '+67%' },
    { label: 'Success Rate', value: '94.2%', change: '+12%' }
  ]


  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            See ShowFarm in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Watch our comprehensive demo showcasing blockchain-verified learning, automated NFT badges, 
            and the future of skill certification
          </p>
          
          {/* Demo Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.label}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {metric.change}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default DemoShowcase
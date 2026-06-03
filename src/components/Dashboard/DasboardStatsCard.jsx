import React from 'react'
import { motion } from 'framer-motion'
import '../../assets/dashboard/dashboardstatscard.css'

export default function DasboardStatsCard({ label, value, change, trend = 'positive', idx }) {
    const isPositive = trend === 'positive'
    const isNegative = trend === 'negative'

    return (
        <motion.div
            className="stats-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
        >
            <p className="stats-card-label">{label}</p>
            <div className="stats-card-value-container">
                <h3 className="stats-card-value">{value}</h3>
                {change && (
                    <span className={`stats-card-change ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
                        {change}
                    </span>
                )}
            </div>
        </motion.div>
    )
}
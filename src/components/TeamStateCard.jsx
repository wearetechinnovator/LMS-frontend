import React from 'react'
import { motion } from 'framer-motion'
export default function TeamStatsCard({ label, value, change, idx }) {
    const isPositive = change && change.includes('+')

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
                <span className={`stats-card-change ${isPositive ? 'positive' : 'negative'}`}>
                    {change}
                </span>

            </div>
        </motion.div>
    )
}
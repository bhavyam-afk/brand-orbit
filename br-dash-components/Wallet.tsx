"use client"

import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Transaction {
  id: string
  amount: string | number
  type: string
  status: string
  createdAt: string
  date?: string
}

interface WalletData {
  monthlySpending: { month: string; amount: number }[]
  totalSpent: number
  pendingAmount: number
  balance: number
  transactions: Transaction[]
}

const Wallet: React.FC = () => {
  const [data, setData] = React.useState<WalletData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    const fetchWallet = async () => {
      try {
        setLoading(true)
        const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : ''
        if (!username) return
        const res = await fetch(`/api/brand2/${username}/wallet`)
        const walletData = await res.json()
        if (cancelled) return
        if (res.ok) {
          const normalized: WalletData = {
            monthlySpending: Array.isArray(walletData.monthlySpending) ? walletData.monthlySpending.map((m: any) => ({ month: m.month, amount: Number(m.amount || 0) })) : [],
            totalSpent: Number(walletData.totalSpent || 0),
            pendingAmount: Number(walletData.pendingAmount || 0),
            balance: Number(walletData.balance || 0),
            transactions: Array.isArray(walletData.transactions) ? walletData.transactions.map((t: any) => ({
              id: t.id,
              amount: t.amount,
              type: t.type,
              status: t.status,
              createdAt: t.createdAt,
            })) : [],
          }
          setData(normalized)
        } else {
          console.error('Failed to fetch brand wallet:', walletData.error)
        }
      } catch (error) {
        if (!cancelled) console.error('Error fetching brand wallet:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchWallet()
    return () => { cancelled = true }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount)
  }

  if (loading) return <div className="text-center py-8">Loading wallet...</div>
  if (!data) return <div className="text-center py-8">No wallet data available</div>

  return (
    <div className="bg-white/5 rounded-2xl shadow-sm p-6">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#5b21b6' }}>Spending (last months)</h3>
          <div style={{ height: 220 }}>
            <Bar
              data={{
                labels: data.monthlySpending.map(m => {
                  const parts = String(m.month).split('-')
                  const idx = Number(parts[1] || '1') - 1
                  return new Date(0, idx).toLocaleString('en-US', { month: 'short' })
                }),
                datasets: [
                  {
                    label: 'Monthly Spend',
                    data: data.monthlySpending.map(m => m.amount),
                    backgroundColor: 'rgba(99,102,241,0.7)',
                    borderColor: 'rgba(99,102,241,1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ color: '#6b7280', fontSize: 12 }}>Total Spent</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(data.totalSpent)}</div>
            </div>
            <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ color: '#6b7280', fontSize: 12 }}>Current Balance</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(data.balance)}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#5b21b6' }}>Overview</h3>
          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ color: '#6b7280' }}>Pending Payments</div>
              <div style={{ fontWeight: 700 }}>{formatCurrency(data.pendingAmount)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ color: '#6b7280' }}>Total Spent</div>
              <div style={{ fontWeight: 700 }}>{formatCurrency(data.totalSpent)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
        <h4 style={{ fontWeight: 700, color: '#5b21b6' }}>Recent Transactions</h4>
        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {data.transactions.map(tx => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, borderRadius: 8, background: 'rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{tx.type}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{new Date(tx.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontWeight: 700 }}>{formatCurrency(Number(tx.amount))}</div>
                <div style={{ padding: '4px 8px', borderRadius: 999, fontSize: 12, color: tx.status === 'COMPLETED' ? '#059669' : tx.status === 'PENDING' ? '#d97706' : '#ef4444', background: tx.status === 'COMPLETED' ? 'rgba(5,150,105,0.08)' : tx.status === 'PENDING' ? 'rgba(217,119,6,0.08)' : 'rgba(239,68,68,0.08)' }}>{tx.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wallet

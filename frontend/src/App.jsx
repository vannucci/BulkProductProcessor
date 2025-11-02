import { useState, useEffect } from 'react'
import { pb } from './lib/pocketbase'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(pb.authStore.model)

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setUser(model)
    })
  }, [])

  if (!user) {
    return <LoginPage onLogin={setUser} />
  }

  return (
  <div style={{ 
    maxWidth: '1600px',  // Increased for comfortable two-column layout
    margin: '0 auto',
    padding: '2rem' 
  }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>Product Dashboard</h1>
        <button 
          onClick={() => {
            pb.authStore.clear()
            setUser(null)
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <Dashboard user={user} />
    </div>
  )
}

export default App
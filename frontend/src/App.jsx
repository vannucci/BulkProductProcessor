import { useState, useEffect } from 'react'
import { pb } from './lib/pocketbase'
import LoginPage from './components/LoginPage'
import ProductsView from './components/ProductsView'

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
      maxWidth: '1200px', 
      margin: '0 auto',  // Centers the dashboard
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
      
      <ProductsView />
    </div>
  )
}

export default App
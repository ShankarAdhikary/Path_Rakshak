import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import EmergencyDashboard from './components/EmergencyDashboard'
import MedicalID from './components/MedicalID'
import EmergencyContacts from './components/EmergencyContacts'
import PostAccidentChecklist from './components/PostAccidentChecklist'
import Settings from './components/Settings'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [emergencyType, setEmergencyType] = useState(null)
  const [profileTab, setProfileTab] = useState('medical')

  function activateEmergency(type) {
    setEmergencyType(type)
    setScreen('dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface text-slate-100 max-w-md mx-auto relative">
      <main className="flex-1 overflow-y-auto pb-16">
        {screen === 'home' && <HomeScreen onActivate={activateEmergency} />}
        {screen === 'dashboard' && (
          <EmergencyDashboard emergencyType={emergencyType} onBack={() => setScreen('home')} />
        )}
        {screen === 'profile' && (
          <div>
            <div className="flex border-b border-slate-700">
              {['medical', 'contacts', 'checklist'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize ${profileTab === tab ? 'text-red-400 border-b-2 border-red-400' : 'text-slate-400'}`}
                >
                  {tab === 'medical' ? '🩺 Medical ID' : tab === 'contacts' ? '📞 Contacts' : '📋 Post-Accident'}
                </button>
              ))}
            </div>
            {profileTab === 'medical' && <MedicalID />}
            {profileTab === 'contacts' && <EmergencyContacts />}
            {profileTab === 'checklist' && <PostAccidentChecklist />}
          </div>
        )}
        {screen === 'settings' && <Settings />}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-slate-700 flex z-50">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'dashboard', icon: '🚨', label: 'Emergency' },
          { id: 'profile', icon: '👤', label: 'Profile' },
          { id: 'settings', icon: '⚙️', label: 'Settings' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'dashboard' && !emergencyType) {
                activateEmergency('Road Accident')
              } else {
                setScreen(item.id)
              }
            }}
            className={`flex-1 flex flex-col items-center py-2 text-xs ${screen === item.id ? 'text-red-400' : 'text-slate-400'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

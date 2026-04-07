export default function SOSButton({ onPress }) {
  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <div className="absolute w-full h-full rounded-full bg-red-600 opacity-30 animate-pulse-ring" />
      <div className="absolute w-4/5 h-4/5 rounded-full bg-red-600 opacity-20 animate-pulse-ring [animation-delay:0.5s]" />
      <button
        onClick={onPress}
        className="relative z-10 w-36 h-36 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-2xl shadow-red-900 flex flex-col items-center justify-center"
        aria-label="SOS Emergency Button"
      >
        <span className="text-white text-4xl font-black tracking-widest">SOS</span>
        <span className="text-red-200 text-xs mt-1">EMERGENCY</span>
      </button>
    </div>
  )
}

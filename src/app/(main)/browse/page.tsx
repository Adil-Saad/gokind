export default function BrowsePage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-120px)]">
      <h2 className="text-2xl font-bold text-white mb-2">Quests Near You</h2>
      <p className="text-gray-400 text-center mb-8">Swipe right to accept a quest, left to skip.</p>
      
      {/* Tinder Card Container goes here */}
      <div className="relative w-full max-w-sm h-96 bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-700">
        <span className="text-gray-500">No quests available right now.</span>
      </div>
    </div>
  );
}

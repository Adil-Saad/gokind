export default function PostPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-120px)]">
      <h2 className="text-2xl font-bold text-white mb-4">Create a Quest</h2>
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <form className="flex flex-col gap-4 text-white">
          <label className="text-sm font-medium">Title</label>
          <input className="rounded-md px-4 py-2 bg-gray-800 border border-gray-700 outline-none focus:border-[#34D1BF]" placeholder="E.g. Help carry groceries" />
          
          <label className="text-sm font-medium mt-2">Description</label>
          <textarea className="rounded-md px-4 py-2 bg-gray-800 border border-gray-700 outline-none focus:border-[#34D1BF] h-24" placeholder="Details..." />
          
          <button type="button" className="mt-4 bg-[#34D1BF] text-[#0A1628] rounded-md px-4 py-3 font-bold hover:bg-[#2bb4a4] transition-colors">
            Post Quest
          </button>
        </form>
      </div>
    </div>
  );
}

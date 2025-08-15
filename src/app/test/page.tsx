export default function TestPage() {
  return (
    <div className="p-8 bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Test CSS</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
      <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
        <p className="text-gray-700">Test card with Tailwind styles</p>
      </div>
    </div>
  )
}

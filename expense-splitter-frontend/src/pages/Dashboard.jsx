import { useState, useEffect } from "react"
import { getMyGroups, createGroup } from "../services/api"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const [groups, setGroups] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", description: "" })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    const data = await getMyGroups()
    setGroups(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const data = await createGroup(form)
    if (data.id) {
      setGroups([...groups, data])
      setForm({ name: "", description: "" })
      setShowForm(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Expense Splitter</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Groups</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Group
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white p-4 rounded-2xl shadow mb-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Group name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Group
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-gray-500">
            No groups yet. Create one!
          </p>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="bg-white p-4 rounded-2xl shadow cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {group.name}
                </h3>
                {group.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {group.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Created by {group.createdBy.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
import { useState, useEffect } from "react"
import {
  getGroupById,
  getGroupExpenses,
  getSettlements,
  addExpense,
  addMember,
  settleUp
} from "../services/api"
import { useParams, useNavigate } from "react-router-dom"

function GroupDetails() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [settlements, setSettlements] = useState([])
  const [activeTab, setActiveTab] = useState("expenses")
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [memberEmail, setMemberEmail] = useState("")
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    paidByUserId: "",
    splitMemberIds: []
  })

  useEffect(() => {
    fetchAll()
  }, [groupId])

  const fetchAll = async () => {
    const [g, e, s] = await Promise.all([
      getGroupById(groupId),
      getGroupExpenses(groupId),
      getSettlements(groupId)
    ])
    setGroup(g)
    setExpenses(Array.isArray(e) ? e : [])
    setSettlements(Array.isArray(s) ? s : [])
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    const data = await addExpense(groupId, {
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
      paidByUserId: parseInt(expenseForm.paidByUserId),
      splitMemberIds: expenseForm.splitMemberIds.map(Number)
    })
    if (data.id) {
      setShowExpenseForm(false)
      setExpenseForm({
        description: "",
        amount: "",
        paidByUserId: "",
        splitMemberIds: []
      })
      fetchAll()
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    const data = await addMember(groupId, { email: memberEmail })
    if (data.id) {
      setMemberEmail("")
      setShowMemberForm(false)
      alert("Member added successfully!")
      fetchAll()
    }
  }

  const handleSettleUp = async (splitId) => {
    await settleUp(splitId)
    fetchAll()
  }

  if (!group) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-blue-600">{group.name}</h1>
        <div />
      </nav>

      <div className="max-w-2xl mx-auto p-6">

        {/* Members Section */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Members</h3>
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Member
            </button>
          </div>
          {showMemberForm && (
            <form onSubmit={handleAddMember} className="flex gap-2 mb-3">
              <input
                type="email"
                placeholder="member@email.com"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
              >
                Add
              </button>
            </form>
          )}
          <p className="text-sm text-gray-500">
            Created by {group.createdBy.name}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "expenses"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-200"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab("settlements")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "settlements"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-200"
            }`}
          >
            Settlements
          </button>
        </div>

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Expenses</h3>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                + Add Expense
              </button>
            </div>

            {showExpenseForm && (
              <form
                onSubmit={handleAddExpense}
                className="bg-white p-4 rounded-2xl shadow mb-4 space-y-3"
              >
                <input
                  type="text"
                  placeholder="Description"
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  placeholder="Paid by user ID"
                  value={expenseForm.paidByUserId}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, paidByUserId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Split among (enter user IDs comma separated):
                  </p>
                  <input
                    type="text"
                    placeholder="1,2,3"
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        splitMemberIds: e.target.value
                          .split(",")
                          .map(Number)
                          .filter(Boolean)
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Add Expense
                </button>
              </form>
            )}

            {expenses.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No expenses yet.
              </p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white p-4 rounded-2xl shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">
                        {expense.description}
                      </h4>
                      <span className="font-bold text-blue-600">
                        ₹{expense.amount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Paid by {expense.paidBy.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settlements Tab */}
        {activeTab === "settlements" && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">
              Outstanding Settlements
            </h3>
            {settlements.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                All settled up! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {settlements.map((split) => (
                  <div
                    key={split.id}
                    className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {split.owedBy.name}{" "}
                        <span className="text-gray-400">owes</span>{" "}
                        {split.owedTo.name}
                      </p>
                      <p className="text-lg font-bold text-red-500">
                        ₹{split.amountOwed}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSettleUp(split.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
                    >
                      Settle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default GroupDetails
import { useState } from 'react'
import './App.css'
import MenuItemForm from './components/MenuItemForm.jsx'
import MenuList from './components/MenuList.jsx'
import initialMenuItems from './data/menuItems.js'

function createMenuItemId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `menu-item-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function App() {
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [feedback, setFeedback] = useState('')

  const editingItem =
    menuItems.find((item) => item.id === editingItemId) ?? null

  const availableItemCount = menuItems.filter((item) => item.available).length
  const itemCategories = [...new Set(menuItems.map((item) => item.category))]
  const categories =
    selectedCategory !== 'All' && !itemCategories.includes(selectedCategory)
      ? [...itemCategories, selectedCategory]
      : itemCategories
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(normalizedSearchQuery) ||
      item.description.toLowerCase().includes(normalizedSearchQuery)
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })
  const summaryItems = [
    { label: 'Menu items', value: menuItems.length },
    { label: 'Available items', value: availableItemCount },
  ]

  const openAddForm = () => {
    setEditingItemId(null)
    setIsFormOpen(true)
    setFeedback('')
  }

  const openEditForm = (itemId) => {
    setEditingItemId(itemId)
    setIsFormOpen(true)
    setFeedback('')
  }

  const closeForm = () => {
    setEditingItemId(null)
    setIsFormOpen(false)
  }

  const handleFormSubmit = (itemValues) => {
    if (editingItem) {
      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...itemValues } : item,
        ),
      )
      setFeedback(`“${itemValues.name}” was updated successfully.`)
    } else {
      const newItem = { id: createMenuItemId(), ...itemValues }
      setMenuItems((currentItems) => [...currentItems, newItem])
      setFeedback(`“${itemValues.name}” was added successfully.`)
    }

    closeForm()
  }

  const handleAvailabilityChange = (itemId, available) => {
    const itemToUpdate = menuItems.find((item) => item.id === itemId)

    if (!itemToUpdate) {
      return
    }

    setMenuItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, available } : item,
      ),
    )
    setFeedback(
      `“${itemToUpdate.name}” is now ${available ? 'available' : 'unavailable'}.`,
    )
  }

  const handleDeleteItem = (itemId) => {
    const itemToDelete = menuItems.find((item) => item.id === itemId)

    if (!itemToDelete) {
      return
    }

    setMenuItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    )

    if (editingItemId === itemId) {
      closeForm()
    }

    setFeedback(`“${itemToDelete.name}” was deleted successfully.`)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-content">
          <a className="brand" href="/" aria-label="MenuFlow home">
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span>MenuFlow</span>
          </a>
          <span className="header-label">Menu management</span>
        </div>
      </header>

      <main className="container page-content">
        <section className="page-intro" aria-labelledby="page-title">
          <p className="eyebrow">Workspace</p>
          <h1 id="page-title">Your menu, clearly organized</h1>
          <p className="intro-copy">
            Keep menu information in one dependable workspace built for quick,
            confident updates.
          </p>
        </section>

        <section className="summary-grid" aria-label="Menu summary">
          {summaryItems.map((item) => (
            <article className="summary-card" key={item.label}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="workspace" aria-labelledby="workspace-title">
          <header className="toolbar">
            <div>
              <p className="toolbar-kicker">Menu workspace</p>
              <h2 id="workspace-title">Menu items</h2>
            </div>
            <div className="toolbar-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={openAddForm}
              >
                Add item
              </button>
            </div>
          </header>

          {feedback && (
            <p className="success-feedback" role="status">
              {feedback}
            </p>
          )}

          {isFormOpen && (
            <MenuItemForm
              key={editingItem?.id ?? 'add-item'}
              item={editingItem}
              categories={categories}
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
            />
          )}

          <div className="filter-bar">
            <div className="toolbar-controls">
              <label className="filter-control search-control">
                <span>Search menu</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name or description"
                />
              </label>

              <label className="filter-control category-control">
                <span>Category</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  <option value="All">All</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="content-panel">
            <MenuList
              items={visibleItems}
              onEdit={openEditForm}
              onToggleAvailability={handleAvailabilityChange}
              onDelete={handleDeleteItem}
            />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="container footer-content">
          <span>MenuFlow</span>
          <span>Simple menu management</span>
        </div>
      </footer>
    </div>
  )
}

export default App

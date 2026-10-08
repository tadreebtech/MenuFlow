import { useEffect, useRef, useState } from 'react'
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const formTriggerRef = useRef(null)
  const categoryControlRef = useRef(null)
  const categoryTriggerRef = useRef(null)
  const categoryOptionRefs = useRef([])

  const editingItem =
    menuItems.find((item) => item.id === editingItemId) ?? null

  const availableItemCount = menuItems.filter((item) => item.available).length
  const itemCategories = [...new Set(menuItems.map((item) => item.category))]
  const categories =
    selectedCategory !== 'All' && !itemCategories.includes(selectedCategory)
      ? [...itemCategories, selectedCategory]
      : itemCategories
  const categoryOptions = ['All', ...categories]
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
  const emptyStateMessage =
    menuItems.length === 0
      ? 'Your menu is empty. Add an item to get started.'
      : 'No menu items match the current search and category filters.'

  useEffect(() => {
    if (!isCategoryMenuOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (!categoryControlRef.current?.contains(event.target)) {
        setIsCategoryMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isCategoryMenuOpen])

  useEffect(() => {
    if (isCategoryMenuOpen) {
      categoryOptionRefs.current[activeCategoryIndex]?.focus()
    }
  }, [activeCategoryIndex, isCategoryMenuOpen])

  const openCategoryMenu = () => {
    const selectedIndex = categoryOptions.indexOf(selectedCategory)
    setActiveCategoryIndex(Math.max(0, selectedIndex))
    setIsCategoryMenuOpen(true)
  }

  const closeCategoryMenu = ({ restoreFocus = false } = {}) => {
    setIsCategoryMenuOpen(false)

    if (restoreFocus) {
      requestAnimationFrame(() => categoryTriggerRef.current?.focus())
    }
  }

  const selectCategory = (category) => {
    setSelectedCategory(category)
    closeCategoryMenu({ restoreFocus: true })
  }

  const handleCategoryTriggerKeyDown = (event) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openCategoryMenu()
    }
  }

  const handleCategoryOptionKeyDown = (event, optionIndex) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeCategoryMenu({ restoreFocus: true })
      return
    }

    if (event.key === 'Tab') {
      closeCategoryMenu()
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectCategory(categoryOptions[optionIndex])
      return
    }

    let nextIndex

    if (event.key === 'ArrowDown') {
      nextIndex = (optionIndex + 1) % categoryOptions.length
    } else if (event.key === 'ArrowUp') {
      nextIndex =
        (optionIndex - 1 + categoryOptions.length) % categoryOptions.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = categoryOptions.length - 1
    } else {
      return
    }

    event.preventDefault()
    setActiveCategoryIndex(nextIndex)
  }

  const openAddForm = (trigger) => {
    formTriggerRef.current = trigger
    setEditingItemId(null)
    setIsFormOpen(true)
    setFeedback('')
  }

  const openEditForm = (itemId, trigger) => {
    formTriggerRef.current = trigger
    setEditingItemId(itemId)
    setIsFormOpen(true)
    setFeedback('')
  }

  const closeForm = () => {
    setEditingItemId(null)
    setIsFormOpen(false)

    const trigger = formTriggerRef.current
    requestAnimationFrame(() => {
      if (trigger?.isConnected) {
        trigger.focus()
      }
    })
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
                onClick={(event) => openAddForm(event.currentTarget)}
                aria-expanded={isFormOpen && !editingItem}
                aria-controls="menu-item-form-panel"
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

          <div className="filter-bar" role="search" aria-label="Filter menu items">
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

              <div
                className="filter-control category-control"
                ref={categoryControlRef}
              >
                <span id="category-filter-label">Category</span>
                <button
                  className="category-trigger"
                  ref={categoryTriggerRef}
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryMenuOpen}
                  aria-controls="category-filter-options"
                  aria-labelledby="category-filter-label category-filter-value"
                  onClick={() =>
                    isCategoryMenuOpen
                      ? closeCategoryMenu()
                      : openCategoryMenu()
                  }
                  onKeyDown={handleCategoryTriggerKeyDown}
                >
                  <span id="category-filter-value">{selectedCategory}</span>
                  <span className="category-trigger-icon" aria-hidden="true" />
                </button>

                {isCategoryMenuOpen && (
                  <div
                    className="category-options"
                    id="category-filter-options"
                    role="listbox"
                    aria-labelledby="category-filter-label"
                  >
                    {categoryOptions.map((category, optionIndex) => (
                      <button
                        className="category-option"
                        key={category}
                        ref={(element) => {
                          categoryOptionRefs.current[optionIndex] = element
                        }}
                        type="button"
                        role="option"
                        aria-selected={selectedCategory === category}
                        tabIndex={activeCategoryIndex === optionIndex ? 0 : -1}
                        onClick={() => selectCategory(category)}
                        onKeyDown={(event) =>
                          handleCategoryOptionKeyDown(event, optionIndex)
                        }
                      >
                        <span>{category}</span>
                        {selectedCategory === category && (
                          <span className="category-option-check" aria-hidden="true">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="content-panel">
            <MenuList
              items={visibleItems}
              emptyStateMessage={emptyStateMessage}
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

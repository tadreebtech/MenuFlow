import MenuItemCard from './MenuItemCard.jsx'

function MenuList({ items, onEdit }) {
  if (items.length === 0) {
    return (
      <p className="menu-empty-state">
        No menu items match the current filters.
      </p>
    )
  }

  return (
    <ul className="menu-list">
      {items.map((item) => (
        <li key={item.id}>
          <MenuItemCard item={item} onEdit={onEdit} />
        </li>
      ))}
    </ul>
  )
}

export default MenuList

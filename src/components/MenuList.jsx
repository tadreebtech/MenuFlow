import MenuItemCard from './MenuItemCard.jsx'

function MenuList({ items }) {
  return (
    <ul className="menu-list">
      {items.map((item) => (
        <li key={item.id}>
          <MenuItemCard item={item} />
        </li>
      ))}
    </ul>
  )
}

export default MenuList

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function MenuItemCard({ item }) {
  return (
    <article className="menu-item-card">
      <div className="menu-item-heading">
        <p className="menu-item-category">{item.category}</p>
        <span
          className={`availability-badge ${item.available ? 'is-available' : 'is-unavailable'}`}
        >
          {item.available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <h3>{item.name}</h3>
      <p className="menu-item-description">{item.description}</p>
      <p className="menu-item-price">{priceFormatter.format(item.price)}</p>
    </article>
  )
}

export default MenuItemCard

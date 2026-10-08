const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function MenuItemCard({ item, onEdit }) {
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
      <div className="menu-item-footer">
        <p className="menu-item-price">{priceFormatter.format(item.price)}</p>
        <button
          className="button button-secondary button-compact"
          type="button"
          onClick={() => onEdit(item.id)}
          aria-label={`Edit ${item.name}`}
        >
          Edit
        </button>
      </div>
    </article>
  )
}

export default MenuItemCard

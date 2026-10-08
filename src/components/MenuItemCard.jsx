import { useRef, useState } from 'react'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function MenuItemCard({ item, onEdit, onToggleAvailability, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const deleteButtonRef = useRef(null)
  const confirmationId = `delete-confirmation-${item.id}`

  const cancelDelete = () => {
    setIsConfirmingDelete(false)
    requestAnimationFrame(() => deleteButtonRef.current?.focus())
  }

  return (
    <article
      className={`menu-item-card ${item.available ? '' : 'is-unavailable'}`}
    >
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
        <div className="menu-item-actions">
          <button
            className="button button-secondary button-compact"
            type="button"
            onClick={() => onToggleAvailability(item.id, !item.available)}
            aria-label={`${item.available ? 'Mark' : 'Restore'} ${item.name} ${
              item.available ? 'unavailable' : 'as available'
            }`}
          >
            {item.available ? 'Mark unavailable' : 'Mark available'}
          </button>
          <button
            className="button button-secondary button-compact"
            type="button"
            onClick={(event) => onEdit(item.id, event.currentTarget)}
            aria-label={`Edit ${item.name}`}
          >
            Edit
          </button>
          <button
            ref={deleteButtonRef}
            className="button button-danger button-compact"
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            aria-label={`Delete ${item.name}`}
            aria-expanded={isConfirmingDelete}
            aria-controls={confirmationId}
          >
            Delete
          </button>
        </div>
      </div>

      {isConfirmingDelete && (
        <div
          id={confirmationId}
          className="delete-confirmation"
          role="alert"
          aria-label={`Confirm deletion of ${item.name}`}
        >
          <p>
            Delete <strong>{item.name}</strong>? This action cannot be undone.
          </p>
          <div className="delete-confirmation-actions">
            <button
              className="button button-secondary button-compact"
              type="button"
              onClick={cancelDelete}
              autoFocus
            >
              Cancel
            </button>
            <button
              className="button button-danger-filled button-compact"
              type="button"
              onClick={() => onDelete(item.id)}
            >
              Confirm delete
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default MenuItemCard

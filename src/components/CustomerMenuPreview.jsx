const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function CustomerMenuPreview({ items }) {
  const availableItems = items.filter((item) => item.available)

  return (
    <>
      <section className="page-intro customer-intro" aria-labelledby="page-title">
        <p className="eyebrow">Customer preview</p>
        <h1 id="page-title">Today&rsquo;s menu</h1>
        <p className="intro-copy">
          Freshly prepared dishes currently available from our kitchen.
        </p>
      </section>

      <section className="customer-menu" aria-labelledby="customer-menu-title">
        <header className="customer-menu-heading">
          <div>
            <p className="toolbar-kicker">MenuFlow</p>
            <h2 id="customer-menu-title">Available now</h2>
          </div>
          <p className="customer-item-count">
            {availableItems.length}{' '}
            {availableItems.length === 1 ? 'item' : 'items'}
          </p>
        </header>

        {availableItems.length > 0 ? (
          <ul className="customer-menu-grid">
            {availableItems.map((item) => (
              <li key={item.id}>
                <article className="customer-menu-card">
                  <p className="customer-menu-category">{item.category}</p>
                  <h3>{item.name}</h3>
                  <p className="customer-menu-description">
                    {item.description || 'No description available.'}
                  </p>
                  <p className="customer-menu-price">
                    {priceFormatter.format(item.price)}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="customer-menu-empty">
            No menu items are available right now. Please check back soon.
          </p>
        )}
      </section>
    </>
  )
}

export default CustomerMenuPreview

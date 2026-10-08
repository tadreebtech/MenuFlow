import './App.css'
import MenuList from './components/MenuList.jsx'
import menuItems from './data/menuItems.js'

function App() {
  const availableItemCount = menuItems.filter((item) => item.available).length
  const summaryItems = [
    { label: 'Menu items', value: menuItems.length },
    { label: 'Available items', value: availableItemCount },
  ]

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
            <p className="toolbar-placeholder">Workspace tools will appear here</p>
          </header>

          <div className="content-panel">
            <MenuList items={menuItems} />
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

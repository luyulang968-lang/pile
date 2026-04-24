import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/drilling-progress', label: '钻孔桩成孔进度' },
  { to: '/tremie-placement', label: '导管提管与混凝土灌注模拟' },
];

export function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <p className="brand-eyebrow">Bored Pile Toolset</p>
            <h1>钻孔桩施工计算工具</h1>
          </div>
          <button type="button" className="menu-toggle" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? '收起菜单' : '展开菜单'}
          </button>
        </div>
        <nav className={`nav-list${menuOpen ? ' nav-open' : ''}`} aria-label="主导航">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="workspace">{children}</main>
    </div>
  );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { NAV_TREE } from '@/lib/site';
import Logo from './Logo';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass-nav" aria-label="메인 메뉴" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 1.5rem' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', height: '4rem', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link href="/" aria-label="메이크업학원 수강료 비교 홈" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={34} />
        </Link>

        {/* 데스크탑 */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
          {NAV_TREE.map((item) => (
            <div key={item.path} className="nav-item">
              <Link href={item.path} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', padding: '20px 0', display: 'inline-block', whiteSpace: 'nowrap' }}>
                {item.label}{item.children.length > 0 ? ' ▾' : ''}
              </Link>
              {item.children.length > 0 && (
                <div className="nav-dd">
                  <Link href={item.path} style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.label} 전체 보기</Link>
                  {item.children.map((c) => (
                    <Link key={c.path} href={c.path}>{c.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/#form" className="btn btn--primary" style={{ padding: '10px 18px', fontSize: 13, borderRadius: 50, whiteSpace: 'nowrap' }}>
            무료 수강료 견적
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="hamburger-btn"
          onClick={() => setOpen(!open)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5 }}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: open ? 'transparent' : 'var(--text-primary)', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text-primary)', opacity: open ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text-primary)', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* 모바일 드로어 */}
      {open && (
        <div style={{ position: 'fixed', top: '4rem', left: 0, right: 0, bottom: 0, background: 'white', overflowY: 'auto', padding: '1rem 1.5rem 6rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <Link href="/#form" onClick={() => setOpen(false)} className="btn btn--primary" style={{ width: '100%', marginBottom: 16 }}>
            내 조건 수강료 견적 받기 →
          </Link>
          {NAV_TREE.map((item) => (
            <div key={item.path} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <Link href={item.path} onClick={() => setOpen(false)} style={{ display: 'block', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', padding: '14px 0' }}>
                {item.label}
              </Link>
              {item.children.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 14 }}>
                  {item.children.map((c) => (
                    <Link key={c.path} href={c.path} onClick={() => setOpen(false)} className="chip chip--outline" style={{ fontSize: 13, padding: '7px 12px' }}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

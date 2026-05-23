import React from 'react';
import './TopBar.css';

interface TopBarProps {
  onMenuClick: () => void;
  onSettingsClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onSettingsClick }) => {
  return (
    <header className="top-bar">
      <button
        className="top-bar__icon-btn"
        onClick={onMenuClick}
        aria-label="メニューを開く"
        id="menu-button"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <h1 className="top-bar__title">Circadian</h1>

      <button
        className="top-bar__icon-btn"
        onClick={onSettingsClick}
        aria-label="設定"
        id="settings-button"
      >
        <span className="material-symbols-outlined">settings</span>
      </button>
    </header>
  );
};

export default TopBar;

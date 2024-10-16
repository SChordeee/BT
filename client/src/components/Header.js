// client/src/components/Header.js
import React from 'react';
import './Header.css';

const Header = ({ account, onConnect }) => {
  return (
    <header className="header">
      <h1>Crowdfunding App</h1>
      {account ? (
        <span>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
      ) : (
        <button onClick={onConnect} className="connect-btn">Connect Wallet</button>
      )}
    </header>
  );
};

export default Header;

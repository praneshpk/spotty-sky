import React from 'react';
import './Code.scss';

export default function Code({ checked = true, title, children }) {
  return (
    <code>
      <label htmlFor={`code__${title.replace(/\s+/g, '_')}`}>
        <input id={`code__${title.replace(/\s+/g, '_')}`} type="checkbox" defaultChecked={checked} />
        <span className="title">{title}</span>
        <div className="content">{children}</div>
      </label>
    </code>
  );
}

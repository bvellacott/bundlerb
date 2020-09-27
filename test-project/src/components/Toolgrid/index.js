import './Toolgrid.scss';
import { h } from 'preact';

export const Toolgrid = ({ children }) => (
  <div className="toolgrid">
    {(Array.isArray(children) ? children : [children]).map((c) => (
      <div className="toolgrid__item">
        {c}
      </div>))}
  </div>
);

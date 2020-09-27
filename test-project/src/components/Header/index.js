import { h } from 'preact'

export const Header = ({
  children,
  LeftIcon,
  RightIcon,
}) => (
  <header>
    {LeftIcon || <div/>}
    {children}
    {RightIcon || <div/>}
  </header>
)

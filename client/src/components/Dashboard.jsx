/**
 * Dashboard Component
 *
 * A layout wrapper component that serves as the main container for dashboard content.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be rendered inside the dashboard
 * @returns {JSX.Element} The Dashboard layout wrapper
 *
 */

import "./Dashboard.css";

export default function Dashboard({ children }) {
  // Future: add media permissions or other logic here
  return <section className="dashboard">{children}</section>;
}

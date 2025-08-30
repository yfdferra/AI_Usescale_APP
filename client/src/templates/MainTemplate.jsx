import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";

export default function MainTemplate() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Dashboard />
      </main>
    </div>
  );
}

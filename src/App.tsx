import Navbar from "@/components/layout/Navbar";
import CreateUrlPage from "./pages/CreateUrlPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <CreateUrlPage />
    </div>
  );
}

export default App;
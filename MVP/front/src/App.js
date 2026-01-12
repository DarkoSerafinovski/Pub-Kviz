import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sezone from "./pages/Sezone";
import Dogadjaji from "./pages/Dogadjaji";
import RangListaSezone from "./pages/RangListaSezone";
import RangListaDogadjaja from "./pages/RangListaDogadjaja";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sezone" element={<Sezone />} />
            <Route path="/sezone/:id/dogadjaji" element={<Dogadjaji />} />
            <Route
              path="/sezone/:id/rang-lista"
              element={<RangListaSezone />}
            />
            <Route path="/dogadjaj/:id/rang" element={<RangListaDogadjaja />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

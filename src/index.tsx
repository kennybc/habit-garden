import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import * as Pages from "@/pages";

import "./global.css";

const App = () => {
  return (
    <Router basename={"/vite-template/"}>
      <Routes>
        <Route index element={<Pages.Home />} />
        <Route path="about" element={<Pages.About />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";



import { LANDINGROUTE, TESTINGROUTE } from "./lib/routes";

import { LandingPage  } from "./views/landing-page";
import { TestingPage } from "./views/testing-page";

function App() {
  return (
    <AnimatePresence>
      <Router>
        <Routes>
          <Route path={LANDINGROUTE} element={<LandingPage />} />
          <Route path={TESTINGROUTE} element={<TestingPage />} />
        </Routes>
      </Router>
    </AnimatePresence>
  );
};
export default App

import React from "react";
import AdminLogin from "./Component/admin/AdminLogin";
import AdminRegistration from "./Component/admin/AdminRegistration";
import Admin from "./Component/admin/Admin";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Component/Home";
import UserLogin from "./Component/User/UserLogin";
import UserRegistration from "./Component/User/UserRegistration";
import Songs from "./Component/Songs";
// import IdSongs from "./Component/IdSongs";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/userLogin" element={<UserLogin />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/songs/:genre" element={<Songs />} />

          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/userRegistration" element={<UserRegistration />} />
          <Route path="/adminRegistration" element={<AdminRegistration />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

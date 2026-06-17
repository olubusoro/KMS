import {Routes, Route} from "react-router-dom";
import Login from "./Pages/Login";
import DashboardLayout from "./Components/SdashboardLayout";
import Post from "./Pages/Posts";
import Editor from "./Components/PostEditor"
import Users from "./Pages/Users";
import Departments from "./Pages/Departments";
import Profile from "./Pages/Profile";
import Category from "./Components/Category";
import Logs from "./Pages/Logs"
import ProtectedRoute from "./Components/ProtectedRoute";
import Requests from "./Components/AccessRequest"
import {Toaster} from "react-hot-toast";
import AdminFeedbackView from "./Components/FeedbackView";
import Feedback from "./Components/Feedback";
import IndexPage from "./Pages/IndexPage";


function App() {
  return (
    <>
      <Toaster />
     <Routes>
      {/* Public Route */}
      {/* <Route path="/" element={<Login />} /> */}

      {/* Private Layout with Sidebar + Topbar */}
      {/* <Route path="/dashboardLayout" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
        }> */}
         <Route path="/" element={<DashboardLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="new-post" element={<Post />}>
          <Route path="editor" element={<Editor />} />
        </Route>
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="profile" element={<Profile />} />
        <Route path="category" element={<Category />} />
        <Route path="logs" element={<Logs />} />
        <Route path="requests" element={<Requests />} />
        <Route path="feedback" element={<AdminFeedbackView />} />
        <Route path="send-feedback" element={<Feedback />} />
      </Route>
    </Routes>
    </>
   
  );
}

export default App;

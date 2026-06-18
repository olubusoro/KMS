import React, {useState, useEffect} from "react";
import {Outlet} from "react-router-dom";
import PostEditor from "../Components/PostEditor";
import Modal from "../Props/Modal";
import Button from "../Props/Button";
import PostList from "../Components/PostList";

const Posts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5085/api/Posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const sortedPosts = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);

      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePostCreated = () => {
    // Prepend the new post to the list
    fetchPosts();
    closeModal();
  };

  return (
    <>
      <Button
        label="New Post"
        onClick={handleNewPost}
        className="border rounded-xl w-30 cursor-pointer hover:bg-green-700 bg-green-500 p-3"
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} className="w-full max-w-7xl">
        <PostEditor onClose={closeModal} onPostCreated={handlePostCreated} />
      </Modal>

      <PostList posts={posts} />
      <Outlet />
    </>
  );
};

export default Posts;

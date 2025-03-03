import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa"; 
import { commdata } from "../utils/communitydata.js";

const Community = () => {
  const [posts, setPosts] = useState(commdata);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const newId = posts.length + 1;
    setPosts([...posts, { id: newId, title: newPost.title, content: newPost.content, likes: 0 }]);
    setNewPost({ title: "", content: "" }); 
  };

  const handleLike = (postId) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
  };

  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <div className="p-14 bg-white shadow-lg rounded-lg py-16">
      <h1 className="text-3xl font-bold mb-6 text-black">Community Posts</h1>
      <PostForm newPost={newPost} setNewPost={setNewPost} onPostSubmit={handlePostSubmit} />
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {sortedPosts.map((post) => (
          <Post key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
};

// Post Component
const Post = ({ post, onLike }) => {
  return (
    <div className="border border-gray-300 p-6 rounded-lg shadow-md bg-gray-100 hover:shadow-lg transition duration-300">
      <h2 className="font-bold text-xl text-black">{post.title}</h2>
      <p className="mt-2 text-gray-700">{post.content}</p>
      <div className="flex items-center mt-4">
        <button 
          onClick={() => onLike(post.id)} 
          className="text-yellow-500 hover:text-yellow-600 flex items-center font-semibold"
        >
          <FaThumbsUp className="mr-2" /> {post.likes}
        </button>
      </div>
    </div>
  );
};

// PostForm Component
const PostForm = ({ newPost, setNewPost, onPostSubmit }) => {
  return (
    <form onSubmit={onPostSubmit} className="mb-6 bg-gray-100 p-6 rounded-lg shadow-md">
      <input
        type="text"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        placeholder="Post Title"
        required
        className="border border-gray-300 rounded p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        placeholder="Share your experience..."
        required
        className="border border-gray-300 rounded p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      ></textarea>
      <button
        type="submit"
        className="bg-yellow-500 text-black font-semibold rounded p-3 hover:bg-yellow-600 transition duration-200 w-full"
      >
        Post
      </button>
    </form>
  );
};

export default Community;

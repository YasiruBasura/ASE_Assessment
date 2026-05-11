import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, getComments, deletePost } from '../services/api';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


import PostViewer from '../components/PostViewer';
import PostEditor from '../components/PostEditor';
import CommentSection from '../components/CommentSection';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');
  
 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [readerCount, setReaderCount] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchPostAndComments = useCallback(async () => {
    try {
      const postData = await getPostById(id);
      setPost(postData);
      
      const commentsData = await getComments(id, 0, 50); 
      setComments(commentsData.content);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  useEffect(() => {
    import('../services/api').then(({ getPostLiveCount }) => {
        getPostLiveCount(id).then(setReaderCount);
    });

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/posts/${id}/comments`, () => {
        fetchPostAndComments(); 
      });

      stompClient.subscribe(`/topic/posts/${id}/readers`, (message) => {
        setReaderCount(parseInt(message.body));
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [id, fetchPostAndComments]);

  const confirmDelete = async () => {
    try {
      await deletePost(id);
      navigate('/');
    } catch (error) {
      alert("Failed to delete post.");
      setIsDeleteModalOpen(false); 
    }
  };

  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      
      <div style={{ padding: '30px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
        {isEditing ? (
          <PostEditor 
            post={post} 
            onSaveSuccess={() => { setIsEditing(false); fetchPostAndComments(); }} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <PostViewer 
            post={post} 
            currentUser={currentUser} 
            readerCount={readerCount} 
            onEdit={() => setIsEditing(true)} 
            onDelete={() => setIsDeleteModalOpen(true)} 
          />
        )}
      </div>

      <CommentSection postId={id} comments={comments} />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}

export default PostDetail;
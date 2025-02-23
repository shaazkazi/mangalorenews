import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await axios.get(
          `https://www.mangalorean.com/wp-json/wp/v2/posts/${id}?_embed`
        );
        
        setPost(postResponse.data);
        
        const categoryId = postResponse.data.categories[0];
        const relatedResponse = await axios.get(
          `https://www.mangalorean.com/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3&exclude=${id}&_embed`
        );
        
        setRelatedPosts(relatedResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!post) return <div>Post not found</div>;

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <div className="single-post-container">
      <article className="single-post">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to News
        </button>
        {featuredImage && (
          <div className="single-post-image">
            <img src={featuredImage} alt={post.title.rendered} />
          </div>
        )}
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <div className="post-meta">
          <span>Published: {new Date(post.date).toLocaleDateString()}</span>
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>

      {relatedPosts.length > 0 && (
        <div className="related-posts">
          <h2>Related Stories</h2>
          <div className="related-posts-grid">
            {relatedPosts.map(relatedPost => {
              const relatedImage = relatedPost._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              return (
                <article
                  key={relatedPost.id}
                  className="related-post-card"
                  onClick={() => navigate(`/post/${relatedPost.id}`)}
                >
                  {relatedImage && (
                    <div className="related-post-image">
                      <img src={relatedImage} alt={relatedPost.title.rendered} />
                    </div>
                  )}
                  <h3 dangerouslySetInnerHTML={{ __html: relatedPost.title.rendered }} />
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SinglePost;

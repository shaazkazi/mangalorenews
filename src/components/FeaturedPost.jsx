import React from 'react';
import { useNavigate } from 'react-router-dom';

function FeaturedPost({ post }) {
  const navigate = useNavigate();

  if (!post) return null;

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <article className="featured-post" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {featuredImage && (
        <div className="featured-image">
          <img src={featuredImage} alt={post.title.rendered} />
        </div>
      )}
      <div className="featured-content">
        <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <div className="featured-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
      </div>
    </article>
  );
}

export default FeaturedPost;

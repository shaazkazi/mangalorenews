import React from 'react';
import { Link } from 'react-router-dom';

function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return <div className="no-posts">No articles available</div>;
  }

  return (
    <div className="post-list">
      {posts.map((post, index) => {
        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        
        return (
          <Link to={`/post/${post.id}`} className="post-item" key={`${post.id}-${index}`}>
            {featuredImage && (
              <div className="post-image">
                <img src={featuredImage} alt={post.title.rendered} loading="lazy" />
              </div>
            )}
            <div className="post-content">
              <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              <div className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PostList;

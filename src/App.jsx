import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import PostList from './components/PostList';
import FeaturedPost from './components/FeaturedPost';
import Categories from './components/Categories';
import LoadingSpinner from './components/LoadingSpinner';
import SinglePost from './components/SinglePost';

function App() {
  const [posts, setPosts] = useState({});
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const mainCategories = [
    { id: 'latest', name: 'Latest News', slug: 'latest' },
    { id: 78299, name: 'Agency News', slug: 'agency-news' },
    { id: 78331, name: 'Article', slug: 'article' },
    { id: 78294, name: 'Articles', slug: 'articles' },
    { id: 78312, name: 'Best Schools & Colleges', slug: 'best-schools-colleges' },
    { id: 14, name: 'Business', slug: 'business' },
    { id: 78351, name: 'Business', slug: 'business-2' },
    { id: 58, name: 'Captured Moments', slug: 'captured-moments' },
    { id: 78338, name: 'Carving', slug: 'carving' },
    { id: 78311, name: 'Classifieds', slug: 'classifieds' }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const latestResponse = await axios.get(
          `https://www.mangalorean.com/wp-json/wp/v2/posts?per_page=4&_embed`
        );
        
        const categoryRequests = mainCategories
          .filter(cat => cat.id !== 'latest')
          .map(category => 
            axios.get(`https://www.mangalorean.com/wp-json/wp/v2/posts?categories=${category.id}&per_page=4&_embed`)
          );

        const categoryResponses = await Promise.all(categoryRequests);
        
        const categoryPosts = {};
        mainCategories.forEach((category, index) => {
          if (category.id === 'latest') {
            categoryPosts[category.id] = latestResponse.data;
          } else {
            categoryPosts[category.id] = categoryResponses[index - 1].data;
          }
        });

        setPosts(categoryPosts);
        setFeaturedPost(latestResponse.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <header className="header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>Mangalorean News</h1>
          </Link>
          <Categories categories={mainCategories} />
        </header>
        
        <Routes>
          <Route path="/" element={
            loading ? (
              <LoadingSpinner />
            ) : (
              <main>
                <FeaturedPost post={featuredPost} />
                {mainCategories.map(category => (
                  <section key={category.id} className="category-section">
                    <div className="category-header">
                      <h2 className="category-title">{category.name}</h2>
                      <Link
                        to={`/category/${category.slug}`}
                        className="see-more-button"
                        style={{ textDecoration: 'none' }}
                      >
                        See More
                      </Link>
                    </div>
                    <PostList posts={posts[category.id] || []} />
                  </section>
                ))}
              </main>
            )
          } />
          <Route path="/category/:slug" element={<Categories categories={mainCategories} />} />
          <Route path="/post/:id" element={<SinglePost />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

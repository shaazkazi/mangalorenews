import React from 'react';
import { Link } from 'react-router-dom';

function Categories({ categories }) {
  return (
    <nav className="categories">
      {categories.map(category => (
        <Link
          key={category.id}
          to={`/category/${category.slug}`}
          className="category-button"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

export default Categories;

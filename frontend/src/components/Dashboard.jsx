import { useState } from 'react';
import SearchBar from './SearchBar';
import ProductsView from './ProductsView';
import FilesView from './FilesView';

function Dashboard({ user }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  function handleSearchResults(results, searchTerm) {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
    } else {
      setIsSearching(true);
      setSearchResults(results);
    }
  }

  return (
    <div>
      <SearchBar onResults={handleSearchResults} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        <ProductsView 
          user={user} 
          searchResults={searchResults}
          isSearching={isSearching}
        />
        <FilesView user={user} />
      </div>
    </div>
  );
}

export default Dashboard;
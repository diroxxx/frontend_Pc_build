import instance from '../../components/instance.tsx';
import {useEffect, useState, useRef} from "react";
import Component, { type ComponentDto } from './Component';

const getComponents = async (): Promise<ComponentDto[]> => {
    try {
        const response = await instance.get("/components");
        console.log("Components:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        throw error;
    }
};

function Components() {
    const [components, setComponents] = useState<ComponentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const componentsPerPage = 25;
    const mainContentRef = useRef<HTMLDivElement>(null);
    
    // Filter states
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedShop, setSelectedShop] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filteredComponents, setFilteredComponents] = useState<ComponentDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getComponents()
            .then((data) => {
                setComponents(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Błąd podczas ładowania komponentów');
                setLoading(false);
            });
    }, []);

    // Get unique manufacturers, conditions, categories, and shops
    const manufacturers = [...new Set(components.map(c => c.brand))].sort();
    const conditions = [...new Set(components.map(c => c.condition))].sort();
    const categories = [...new Set(components.map(c => c.componentType))].sort();
    const shops = [...new Set(components.map(c => c.shop))].sort();
    
    // Filter components based on selected filters
    useEffect(() => {
        let filtered = components.filter(component => {
            const priceMatch = component.price >= priceRange.min && component.price <= priceRange.max;
            const manufacturerMatch = !selectedManufacturer || component.brand === selectedManufacturer;
            const conditionMatch = !selectedCondition || component.condition === selectedCondition;
            const categoryMatch = !selectedCategory || component.componentType === selectedCategory;
            const shopMatch = !selectedShop || component.shop === selectedShop;
            
            if (!component.brand) {
                component.brand = '';
            }
            if (!component.model) {
                component.model = '';
            }
            if (!component.componentType) {
                component.componentType = '';
            }
            const searchMatch = !searchText ||
                component.brand.toLowerCase().includes(searchText.toLowerCase()) ||
                component.model.toLowerCase().includes(searchText.toLowerCase()) ||
                component.componentType.toLowerCase().includes(searchText.toLowerCase());
            
            return priceMatch && manufacturerMatch && conditionMatch && categoryMatch && shopMatch && searchMatch;
        });
        
        setFilteredComponents(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [components, priceRange, selectedManufacturer, selectedCondition, selectedCategory, selectedShop, searchText]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg text-gray-600">Ładowanie komponentów...</div>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg text-red-600 bg-red-50 p-4 rounded-lg">Błąd: {error}</div>
        </div>
    );
    
    // Calculate total pages for filtered components
    const totalComponents = filteredComponents.length;
    const totalPages = Math.ceil(totalComponents / componentsPerPage);
    
    // Get components for current page
    const startIndex = (currentPage - 1) * componentsPerPage;
    const endIndex = startIndex + componentsPerPage;
    const currentPageComponents = filteredComponents.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setIsLoading(true);
        setCurrentPage(page);
        
        // Instant scroll to top of the page
        window.scrollTo({ 
            top: 0, 
            behavior: 'instant' 
        });
        
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

    const handleSearch = () => {
        // Search is handled automatically by useEffect when searchText changes
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Komponenty komputerowe</h1>
              
              {/* Search bar podobny do Allegro */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Wyszukaj komponent (np. Nvidia, RTX 4080)..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button 
                      onClick={handleSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                  <option>filter by oldest date</option>
                  <option>Najnowsze</option>
                  <option>Najtańsze</option>
                  <option>Najdroższe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content with sidebar */}
          <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
            {/* Sidebar with filters */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtry</h3>
                
                {/* Category filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Wszystkie kategorie</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cena: {priceRange.min}zł - {priceRange.max}zł
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Manufacturer filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producent
                  </label>
                  <select
                    value={selectedManufacturer}
                    onChange={(e) => setSelectedManufacturer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Wszyscy producenci</option>
                    {manufacturers.map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stan
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Wszystkie stany</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shop filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sklep
                  </label>
                  <select
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Wszystkie sklepy</option>
                    {shops.map(shop => (
                      <option key={shop} value={shop}>
                        {shop === 'allegro' && 'Allegro'}
                        {shop === 'olx' && 'OLX'}
                        {shop === 'allegro_lokalnie' && 'Allegro Lokalnie'}
                        {!['allegro', 'olx', 'allegro_lokalnie'].includes(shop) && shop}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear filters button */}
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 10000 });
                    setSelectedManufacturer('');
                    setSelectedCondition('');
                    setSelectedCategory('');
                    setSelectedShop('');
                    setSearchText('');
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Wyczyść filtry
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1" ref={mainContentRef}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2">
                  {selectedCategory ? `${selectedCategory}` : 'Wszystkie komponenty'}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({totalComponents} {totalComponents === 1 ? 'komponent' : 'komponentów'})
                  </span>
                </h2>
              </div>
              
              {/* List komponentów - płaska lista bez grupowania */}
              <div className={`space-y-4 transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
                {currentPageComponents.map((component, index) => (
                  <Component key={`component-${startIndex + index}`} {...component} />
                ))}
              </div>
              
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}
              
              {totalComponents === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">Nie znaleziono komponentów spełniających kryteria wyszukiwania</div>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded ${
                          currentPage === pageNum
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-3 py-2 text-gray-500">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
              
              {/* Page info */}
              {totalPages > 1 && (
                <div className="text-center mt-4 text-gray-500">
                  Strona {currentPage} z {totalPages} ({totalComponents} komponentów)
                </div>
              )}
            </div>
          </div>
        </div>
    );
}

export default Components;
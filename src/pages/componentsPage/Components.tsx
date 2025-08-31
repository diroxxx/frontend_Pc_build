import instance from '../../components/instance.tsx';
import {useEffect, useState, useRef} from "react";
import { useAtom } from 'jotai';
import Component from './Component';
import SidePanelBuilds from '../builds/SidePanelBuilds';
import {
  type ComponentDto,
  componentsAtom,
  componentsLoadingAtom,
  componentsErrorAtom,
  priceRangeAtom,
  selectedManufacturerAtom,
  selectedConditionAtom,
  selectedCategoryAtom,
  selectedShopAtom,
  searchTextAtom,
  filteredComponentsAtom,
  manufacturersAtom,
  conditionsAtom,
  categoriesAtom,
  shopsAtom,
  clearFiltersAtom
} from '../../atomContext/offerAtom';
import { currentBuildAtom } from '../../atomContext/computer';
import { compatibilityIssuesAtom, clearCompatibilityIssuesAtom } from '../../atomContext/computer';
import ToastContainer from '../../components/ui/ToastProvider/ToastContainer.tsx';
import { useNavigate } from 'react-router-dom';

const getComponents = async (): Promise<ComponentDto[]> => {
    try {
        const response = await instance.get("/components");
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        throw error;
    }
};

function Components() {
    // Atom state
    const [components, setComponents] = useAtom(componentsAtom);
    const [loading, setLoading] = useAtom(componentsLoadingAtom);
    const [error, setError] = useAtom(componentsErrorAtom);
    const [priceRange, setPriceRange] = useAtom(priceRangeAtom);
    const [selectedManufacturer, setSelectedManufacturer] = useAtom(selectedManufacturerAtom);
    const [selectedCondition, setSelectedCondition] = useAtom(selectedConditionAtom);
    const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
    const [selectedShop, setSelectedShop] = useAtom(selectedShopAtom);
    const [searchText, setSearchText] = useAtom(searchTextAtom);
    const [currentBuild] = useAtom(currentBuildAtom);
    const [compatibilityIssues] = useAtom(compatibilityIssuesAtom);
    
    const [, clearFilters] = useAtom(clearFiltersAtom);
    const [, clearCompatibilityIssues] = useAtom(clearCompatibilityIssuesAtom);

    // Derived state
    const [filteredComponents] = useAtom(filteredComponentsAtom);
    const [manufacturers] = useAtom(manufacturersAtom);
    const [conditions] = useAtom(conditionsAtom);
    const [categories] = useAtom(categoriesAtom);
    const [shops] = useAtom(shopsAtom);

    // Local state for pagination and loading
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('');
    const componentsPerPage = 25;
    const mainContentRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // ALL useEffect hooks MUST be here, before any conditional returns
    useEffect(() => {
        // Only fetch if components are empty to avoid refetching
        if (components.length === 0) {
            getComponents()
                .then((data) => {
                  console.log('Wszystkie komponenty:', data);
                console.log('Unikalne typy komponentów:', 
                    [...new Set(data.map(c => c.componentType))]
                );
                const coolers = data.filter(c => 
                    c.componentType?.toLowerCase().includes('cool') ||
                    c.componentType?.toLowerCase().includes('chłodz') ||
                    c.componentType?.toLowerCase().includes('wentyl')
                );
                console.log('Znalezione coolery:', coolers);
                    setComponents(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError('Błąd podczas ładowania komponentów');
                    setLoading(false);
                });
        }
    }, [components.length, setComponents, setLoading, setError]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredComponents.length]);

    // Sort filtered components - create new array to avoid mutation
    const sortedComponents = sortBy === '' 
        ? filteredComponents  // No sorting - maintain original order
        : [...filteredComponents].sort((a, b) => {
            switch (sortBy) {
                case 'cheapest':
                    return a.price - b.price;
                case 'expensive':
                    return b.price - a.price;
                case 'newest':
                case 'oldest':
                    return 0; // Default sorting when no date field available
                default:
                    return 0;
            }
        });

    // CONDITIONAL RETURNS can only happen AFTER all hooks
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
    const totalComponents = sortedComponents.length;
    const totalPages = Math.ceil(totalComponents / componentsPerPage);
    
    // Get components for current page
    const startIndex = (currentPage - 1) * componentsPerPage;
    const endIndex = startIndex + componentsPerPage;
    const currentPageComponents = sortedComponents.slice(startIndex, endIndex);

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
        // Search is handled automatically by filteredComponentsAtom
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const translateCondition = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'new':
      return 'Nowy';
    case 'used':
      return 'Używany';
    case 'defective':
      return 'Uszkodzony';
    case 'refurbished':
      return 'Odnowiony';
    default:
      return condition;
  }
};
const translateCategory = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'graphicscard':
      return 'Karty graficzne';
    case 'processor':
      return 'Procesory';
    case 'memory':
      return 'Pamięć RAM';
    case 'storage':
    case 'ssd':
    case 'hdd':
      return 'Dyski';
    case 'motherboard':
      return 'Płyty główne';
    case 'powersupply':
      return 'Zasilacze';
    case 'cooler':
      return 'Chłodzenie';
    case 'casepc':
      return 'Obudowy';
    default:
      return category;
        }
};
const getCategoryCount = (category: string): number => {
  if (!category) return components.length;
  return components.filter(component => 
    component.componentType?.toLowerCase() === category.toLowerCase()
  ).length;
};
    return (
        <div className="min-h-screen bg-gray-50">
          {/* Toast Container */}
          <ToastContainer />
          
          {/* Side Panel */}
          <SidePanelBuilds />
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Komponenty komputerowe</h1>
              
              {/* Search bar */}
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
                
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Domyślne sortowanie</option>
                  {/* <option value="oldest">Od najstarszych</option>
                  <option value="newest">Najnowsze</option> */}
                  <option value="cheapest">Najtańsze</option>
                  <option value="expensive">Najdroższe</option>
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
                        {translateCategory(category)} ({getCategoryCount(category)})
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
                        {translateCondition(condition)}
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
                  onClick={clearFilters}
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
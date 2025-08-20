import { useAtom } from 'jotai';
import { addComponentToBuildAtom, currentBuildAtom } from '../../atomContext/computer';
import type { ComponentDto } from '../../atomContext/offerAtom';

function Component(props: ComponentDto) {
  const [, addComponentToBuild] = useAtom(addComponentToBuildAtom);
  const [currentBuild] = useAtom(currentBuildAtom);

  const isInBuild = currentBuild.some(c => c.componentType === props.componentType);
  const existingComponent = currentBuild.find(c => c.componentType === props.componentType);

  const handleAddToBuild = () => {
    addComponentToBuild(props);
  };

  // Funkcja do renderowania specyfikacji w formie tagów
  const renderSpecTags = () => {
    const tags = [];
    
    const componentType = props.componentType?.toLowerCase().replace(/\s+/g, '_');
    
    switch (componentType) {
      case 'graphics_card':
      case 'graphicscard':
        if (props.gpuMemorySize) tags.push(`${props.gpuMemorySize}GB`);
        if (props.gpuGddr) tags.push(props.gpuGddr);
        if (props.gpuPowerDraw) tags.push(`${props.gpuPowerDraw}W TDP`);
        break;
      case 'processor':
      case 'cpu':
        if (props.cpuCores) tags.push(`${props.cpuCores} rdzeni`);
        if (props.cpuThreads) tags.push(`${props.cpuThreads} wątków`);
        if (props.cpuBase_clock) {
          const baseClockValue = props.cpuBase_clock;
          // Check if it already contains GHz, if not add it
          if (baseClockValue.includes('GHz') || baseClockValue.includes('MHz')) {
            tags.push(baseClockValue);
          } else {
            tags.push(`${baseClockValue} GHz`);
          }
        }
        if (props.cpuSocketType) tags.push(props.cpuSocketType);
        break;
      case 'memory':
      case 'ram':
        if (props.ramCapacity) tags.push(`${props.ramCapacity}GB`);
        if (props.ramSpeed) tags.push(props.ramSpeed);
        if (props.ramType) tags.push(props.ramType);
        break;
      case 'storage':
      case 'ssd':
      case 'hdd':
        if (props.storageCapacity) tags.push(`${props.storageCapacity}GB`);
        break;
      case 'power_supply':
      case 'powersupply':
        if (props.powerSupplyMaxPowerWatt) tags.push(`${props.powerSupplyMaxPowerWatt}W`);
        break;
      case 'motherboard':
        if (props.boardSocketType) tags.push(props.boardSocketType);
        if (props.boardChipset) tags.push(props.boardChipset);
        if (props.boardFormat) tags.push(props.boardFormat);
        break;
      case 'cooler':
      case 'chlodzenie':
        if (props.coolerSocketsType) tags.push(...props.coolerSocketsType);
        break;
      case 'case_pc':
      case 'casepc':
        if (props.caseFormat) tags.push(props.caseFormat);
        break;
      default:
        // Add brand as fallback
        if (props.brand) tags.push(props.brand);
        // Try to add any available specs
        if (props.gpuMemorySize) tags.push(`${props.gpuMemorySize}GB`);
        if (props.cpuCores) tags.push(`${props.cpuCores} rdzeni`);
        if (props.ramCapacity) tags.push(`${props.ramCapacity}GB`);
        if (props.storageCapacity) tags.push(`${props.storageCapacity}GB`);
        break;
    }
    
    return tags;
  };

  const specTags = renderSpecTags();

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm transition-shadow duration-200 mx-4 relative border-gray-200 hover:border-gray-300">
      <div className="flex gap-6 min-h-[120px]">
        {/* Product image on the left */}
        <div className="w-32 h-32 flex-shrink-0">
          <img 
            src={props.photo_url} 
            alt={`${props.brand} ${props.model}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY2MEgzNVY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQ1IDQ1SDU1VjUwSDQ1VjQ1WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onLoad={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Top section - condition, model, and shop logo in one line */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {props.condition.toLowerCase() === 'defective' && (
                <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-medium">
                  defective
                </span>
              )}
              {props.condition.toLowerCase() === 'used' && (
                <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">
                  used
                </span>
              )}
              {props.condition.toLowerCase() === 'new' && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                  new
                </span>
              )}
              <h3 className="text-lg font-medium text-gray-900 leading-tight">
                {props.brand} {props.model}
              </h3>
            </div>
            
            {/* Shop logo */}
            <div className="flex-shrink-0">
              {props.shop === 'allegro' && (
                <img 
                  src="allegro.png" 
                  alt="Allegro" 
                  className="w-12 h-12 object-contain" 
                />
              )}
              {props.shop === 'olx' && (
                <img 
                  src="olx.png" 
                  alt="OLX" 
                  className="w-12 h-12 object-contain" 
                />
              )}
              {props.shop === 'allegro_lokalnie' && (
                <img 
                  src="Allegro-Lokalnie.png" 
                  alt="Allegro Lokalnie" 
                  className="w-12 h-12 object-contain" 
                />
              )}
            </div>
          </div>

          {/* Specification tags */}
          {specTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {specTags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded border font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom section - price and buttons */}
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              }).format(props.price).replace('PLN', 'zł')}
            </span>
            
            <div className="flex gap-2">
              <a
                href={props.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zobacz ofertę
              </a>
              
              <button
                onClick={handleAddToBuild}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isInBuild
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isInBuild 
                  ? `Zamień ${props.componentType}` 
                  : `Dodaj do zestawu`
                }
              </button>
            </div>
          </div>
          
          {isInBuild && existingComponent && (
            <p className="text-xs text-orange-600 mt-1">
              Zastąpi: {existingComponent.brand} {existingComponent.model}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Component;
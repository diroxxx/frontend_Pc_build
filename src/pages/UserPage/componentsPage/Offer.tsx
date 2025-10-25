import { useAtom } from 'jotai';
import { addComponentToBuildAtom, currentBuildAtom } from '../../../atomContext/computerAtom.tsx';
import type { ComponentOffer } from '../../../atomContext/offerAtom.tsx';

function Offer(props: ComponentOffer) {
  const [, addComponentToBuild] = useAtom(addComponentToBuildAtom);
  const [currentBuild] = useAtom(currentBuildAtom);

  const isInBuild = currentBuild.some(c => c.componentType === props.componentType);
  const existingComponent = currentBuild.find(c => c.componentType === props.componentType);

  const handleAddToBuild = () => {
    addComponentToBuild(props);
  };

  const renderSpecTags = () => {
    const tags = [];
    
    switch (props.componentType) {
      case 'graphicsCard':
        tags.push(`${props.memorySize}GB`);
        tags.push(props.gddr);
        tags.push(`${props.powerDraw}W TDP`);
        break;
        
       case 'processor':
        tags.push(`${props.cores} rdzeni`);
        tags.push(`${props.threads} wątków`);
        tags.push(props.baseClock);
        tags.push(props.socketType);
        break;
        
      case 'memory':
        tags.push(`${props.capacity}GB`);
        tags.push(`${props.speed}MHz`);
        tags.push(props.type);
        break;

      case 'storage':
        tags.push(`${props.capacity}GB`);
        break;
        
      case 'powerSupply':
        tags.push(`${props.maxPowerWatt}W`);
        break;
        
      case 'motherboard':
        tags.push(props.socketType);
        tags.push(props.chipset);
        tags.push(props.format);
        break;
        
      case 'cooler':
        tags.push(...props.coolerSocketsType);
        break;
        
      case 'casePc':
        tags.push(props.format);
        break;
        
      default:
        break;
    }
    
    return tags;
  };

  const specTags = renderSpecTags();

  return (
    <div className="bg-gradient-gray border rounded-lg p-4 shadow-sm transition-all duration-300 mx-4 relative border-ocean-light-blue hover:border-ocean-blue hover:shadow-md">
      <div className="flex gap-6 min-h-[120px]">
        {/* Product image on the left */}
        <div className="w-32 h-32 flex-shrink-0">
          <img 
            src={props.photoUrl} 
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
                <span className="bg-red-100 text-ocean-red text-sm px-3 py-1 rounded-full font-medium">
                  Uszkodzony
                </span>
              )}
              {props.condition.toLowerCase() === 'used' && (
                <span className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
                  Używany
                </span>
              )}
              {props.condition.toLowerCase() === 'new' && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                  Nowy
                </span>
              )}
              <h3 className="text-lg font-medium text-midnight-dark leading-tight">
                <a
                href={props.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-midnight-dark hover:text-ocean-blue hover:underline transition-colors duration-200 cursor-pointer"
                >
                {props.brand} {props.model}
              </a>
              </h3>
            </div>
            
            {/* Shop logo */}
            <div className="flex-shrink-0">
              {props.shop === 'allegro' && (
                <img 
                  src="allegro.png" 
                  alt="Allegro" 
                  className="w-12 h-12" 
                />
              )}
              {props.shop === 'olx' && (
                <img 
                  src="olx.png" 
                  alt="OLX" 
                  className="w-12 h-12" 
                />
              )}
              {props.shop === 'allegro_lokalnie' && (
                <img 
                  src="Allegro-Lokalnie.png" 
                  alt="Allegro Lokalnie" 
                  className="w-12 h-12" 
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
                  className="bg-ocean-light-blue bg-opacity-20 text-ocean-dark-blue text-sm px-3 py-1 rounded border border-ocean-light-blue font-medium hover:bg-ocean-light-blue hover:bg-opacity-30 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

           {/* Bottom section - price and buttons */}
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-midnight-dark">
              {new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              }).format(props.price).replace('PLN', 'zł')}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddToBuild}
                className={`px-4 py-2 rounded-lg font-medium  ${
                  isInBuild
                    ? 'bg-gradient-warning text-white hover:bg-gradient-warning-hover shadow-lg hover:shadow-xl'
                    : 'bg-gradient-blue-horizontal text-white hover:bg-gradient-blue-horizontal-hover'
                }`}
              >
                {isInBuild 
                  ? `Zamień` 
                  : `Dodaj do zestawu`
                }
              </button>
            </div>
          </div>
          
          {isInBuild && existingComponent && (
            <p className="text-xs text-orange-600 mt-1 font-medium">
              Zastąpi: {existingComponent.brand} {existingComponent.model}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Offer;
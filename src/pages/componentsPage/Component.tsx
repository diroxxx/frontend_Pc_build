export interface ComponentDto {
  // item
  brand: string;
  model: string;
  condition: string;
  photo_url: string;
  website_url: string;
  price: number;
  shop: string;
  componentType: string;

  // processor
  cpuCores?: number;
  cpuThreads?: number;
  cpuSocketType?: string;
  cpuBase_clock?: string;

  // cooler
  coolerSocketsType?: string[];

  // graphics card
  gpuMemorySize?: number;
  gpuGddr?: string;
  gpuPowerDraw?: number;

  // memory
  ramType?: string;
  ramCapacity?: number;
  ramSpeed?: string;
  ramLatency?: string;

  // motherboard
  boardChipset?: string;
  boardSocketType?: string;
  boardMemoryType?: string;
  boardFormat?: string;

  // power supply
  powerSupplyMaxPowerWatt?: number;

  // storage
  storageCapacity?: number;

  // case
  caseFormat?: string;
}

function Component(props: ComponentDto) {
  // Funkcja do renderowania specyfikacji w formie tagów
  const renderSpecTags = () => {
    const tags = [];
    
    // Debug: log the componentType and props
    console.log('ComponentType:', props.componentType);
    console.log('Props:', props);
    
    const componentType = props.componentType?.toLowerCase().replace(/\s+/g, '_');
    console.log('Processed componentType:', componentType);
    
    switch (componentType) {
      case 'graphicsCard':
        if (props.gpuMemorySize) tags.push(`${props.gpuMemorySize}GB`);
        if (props.gpuGddr) tags.push(props.gpuGddr);
        if (props.gpuPowerDraw) tags.push(`${props.gpuPowerDraw}W TDP`);
        break;
      case 'processor':
        if (props.cpuCores) tags.push(`${props.cpuCores} rdzeni`);
        if (props.cpuThreads) tags.push(`${props.cpuThreads} wątków`);
        if (props.cpuBase_clock) tags.push(props.cpuBase_clock);
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
      case 'powerSupply':
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
      case 'casePc':
        if (props.caseFormat) tags.push(props.caseFormat);
        break;
      default:
        console.log('Unknown component type:', componentType);
        // Add brand as fallback
        if (props.brand) tags.push(props.brand);
        // Try to add any available specs
        if (props.gpuMemorySize) tags.push(`${props.gpuMemorySize}GB`);
        if (props.cpuCores) tags.push(`${props.cpuCores} rdzeni`);
        if (props.ramCapacity) tags.push(`${props.ramCapacity}GB`);
        if (props.storageCapacity) tags.push(`${props.storageCapacity}GB`);
        break;
    }
    
    console.log('Generated tags:', tags);
    console.log('Tags length:', tags.length);
    return tags;
  };

  const specTags = renderSpecTags();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 mx-4 relative">
      <div className="flex gap-6 min-h-[120px]">
        {/* Product image on the left */}
        <div className="w-32 h-32 flex-shrink-0">
          <img 
            src={props.photo_url} 
            alt={`${props.brand} ${props.model}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.png';
            }}
          />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Top section - condition, model, and shop logo in one line */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {props.condition.toLowerCase() === 'defective' && (
                <span className="bg-pink-100 text-pink-700 text-sm px-3 py-1 rounded-full font-medium">
                  defective
                </span>
              )}
              {props.condition.toLowerCase() === 'used' && (
                <span className="bg-pink-100 text-pink-700 text-sm px-3 py-1 rounded-full font-medium">
                  used
                </span>
              )}
              {props.condition.toLowerCase() === 'new' && (
                <span className="bg-pink-100 text-pink-700 text-sm px-3 py-1 rounded-full font-medium">
                  new
                </span>
              )}
              <h3 className="text-lg font-medium text-gray-900 leading-tight">
                {props.model}
              </h3>
            </div>
            
            {/* Shop logo */}
            <div className="flex-shrink-0">
              {props.shop === 'allegro' && (
                <img src="allegro.png" alt="Allegro" className="w-12 h-12 object-contain" />
              )}
              {props.shop === 'olx' && (
                <img src="olx.png" alt="OLX" className="w-12 h-12 object-contain" />
              )}
              {props.shop === 'allegro_lokalnie' && (
                <img src="allegroLok.png" alt="Allegro Lokalnie" className="w-12 h-12 object-contain" />
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

          {/* Bottom section - date and price/button */}
          <div className="flex justify-end items-end">
            <div className="flex items-end gap-4">
              <span className="text-3xl font-bold text-gray-900">
                {props.price?.toFixed(0)}zł
              </span>
              
              <a
                href={props.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Dodaj do zestawu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
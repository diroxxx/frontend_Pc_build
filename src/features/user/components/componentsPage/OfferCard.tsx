import type {ComponentOffer} from "../../../../types/OfferBase.ts";
import {type FC} from "react";
import { useAtomValue} from "jotai";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {selectedComputerAtom} from "../../../../atomContext/computerAtom.tsx";
import {useUpdateOffersToComputer} from "../../../admin/hooks/useUpdateOffersToComputer.ts";
import {validateCompatibility} from "../../hooks/validateCompatibility.ts";

interface Props {
    offer: ComponentOffer;
}

const OfferCard: FC<Props> = ( {offer})=> {
    const selectedComputer = useAtomValue(selectedComputerAtom)
    const updateMutation = useUpdateOffersToComputer();


    async function updateComputer() {
        if (!selectedComputer) {
            showToast.warning("Najpierw wybierz zestaw komputerowy");
            return;
        }

        const error = validateCompatibility(selectedComputer, offer);

        if (error) {
            showToast.error(error);
            return;
        }

        updateMutation.mutate({
            computerId: selectedComputer.id,
            offerUrl: offer.websiteUrl,
        });

        showToast.success("Podzespół został dodany do zestawu!");
    }

  const renderSpecTags = () => {
    const tags = [];
    
    switch (offer.componentType) {
      case 'GRAPHICS_CARD':
        tags.push(`${offer.memorySize}GB`);
        tags.push(offer.gddr);
        tags.push(`${offer.powerDraw}W TDP`);
        break;
        
       case 'PROCESSOR':
        tags.push(`${offer.cores} rdzeni`);
        tags.push(`${offer.threads} wątków`);
        tags.push(offer.baseClock);
        tags.push(offer.socketType);
        break;
        
      case 'MEMORY':
        tags.push(`${offer.capacity}GB`);
        tags.push(`${offer.speed}MHz`);
        tags.push(offer.type);
        break;

      case 'STORAGE':
        tags.push(`${offer.capacity}GB`);
        break;
        
      case 'POWER_SUPPLY':
        tags.push(`${offer.maxPowerWatt}W`);
        break;
        
      case 'MOTHERBOARD':
        tags.push(offer.socketType);
        tags.push(offer.chipset);
        tags.push(offer.format);
        break;
        
      case 'CPU_COOLER':
        tags.push(...offer.coolerSocketsType);
        break;
        
      case 'CASE_PC':
        tags.push(offer.format);
        break;

      default:
        break;
    }
    
    return tags;
  };

  const specTags = renderSpecTags();



  return (
    <div
        className="relative group bg-gradient-gray border rounded-lg p-2 sm:p-3 shadow-sm transition-all duration-300 mx-4 border-ocean-light-blue hover:border-ocean-blue hover:shadow-md">
      <div className="flex gap-6 min-h-[120px]">
          <button
              onClick={updateComputer}
              className={`absolute top-2 right-2 z-10 p-2 rounded-full border bg-ocean-white text-ocean-blue border-ocean-light-blue 
            transition-all duration-200 shadow-sm hover:shadow-md hover:bg-ocean-light-blue hover:text-ocean-dark-blue`}
              aria-label="Dodaj do zestawu"
          >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
              >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
          </button>




          {/* Product image on the left */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
          <img 
            src={offer.photoUrl}
            alt={`${offer.brand} ${offer.model}`}
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
              {offer.condition.toLowerCase() === 'defective' && (
                <span className="bg-red-100 text-ocean-red text-sm px-3 py-1 rounded-full font-medium">
                  Uszkodzony
                </span>
              )}
              {offer.condition.toLowerCase() === 'used' && (
                <span className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
                  Używany
                </span>
              )}
              {offer.condition.toLowerCase() === 'new' && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                  Nowy
                </span>
              )}
              <h3 className="text-lg font-medium text-midnight-dark leading-tight">
                <a
                href={offer.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-midnight-dark hover:text-ocean-blue hover:underline transition-colors duration-200 cursor-pointer"
                >
                {offer.brand} {offer.model}
              </a>
              </h3>
            </div>
            
            {/* Shop logo */}
            <div className="flex-shrink-0">
              {offer.shopName?.toLowerCase() === 'allegro' && (
                <img 
                  src="allegro.png" 
                  alt="Allegro" 
                  className="w-12 h-12" 
                />
              )}
              {offer.shopName?.toLowerCase() === 'olx' && (
                <img 
                  src="olx.png" 
                  alt="OLX" 
                  className="w-12 h-12" 
                />
              )}
              {offer.shopName?.toLowerCase() === 'allegrolokalnie' && (
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
              }).format(offer.price).replace('PLN', 'zł')}
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}

export default OfferCard;
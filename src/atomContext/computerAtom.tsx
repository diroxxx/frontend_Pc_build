import {atom} from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { userAtom, canSaveComputersAtom } from './userAtom';
import customAxios from '../lib/customAxios.tsx';
import { showToast } from '../lib/ToastContainer.tsx';

import {type ComponentOffer, isMemoryOffer} from "./offerAtom";
import {isMotherboardOffer,isProcessorOffer,isCoolerOffer} from "./offerAtom";

export type computerAtom = {
    name: string;
    price: number;
    isVisible: boolean;
    offers: ComponentOffer[]
}

export type CompatibilityIssue = {
  type: 'warning' | 'error';
  message: string;
  affectedComponents: string[];
}

// Compatibility checking functions
const checkSocketCompatibility = (offers: ComponentOffer[], newOffer: ComponentOffer): CompatibilityIssue[] => {
    const issues: CompatibilityIssue[] = [];

    const cpu = offers.find(isProcessorOffer);
    const motherboard = offers.find(isMotherboardOffer);
    const cooler = offers.find(isCoolerOffer);

    // CPU-Motherboard
    if (isProcessorOffer(newOffer)) {
        if (motherboard && isMotherboardOffer(motherboard)) {
            if (motherboard.memoryType !== newOffer.socketType) {
                issues.push({
                    type: 'error',
                    message: `Procesor (${newOffer.socketType}) nie jest kompatybilny z płytą główną (${motherboard.socketType})`,
                    affectedComponents: ['processor', 'motherboard']
                });
            }
        }
    }
    if (isMotherboardOffer(newOffer)) {
        if (cpu && isProcessorOffer(cpu)) {
            if (cpu.socketType !== newOffer.socketType) {
                issues.push({
                    type: 'error',
                    message: `Płyta główna (${newOffer.socketType}) nie jest kompatybilna z procesorem (${cpu.socketType})`,
                    affectedComponents: ['motherboard', 'processor']
                });
            }
        }
    }
    return issues;
};
const checkMemoryCompatibility = (components: ComponentOffer[], newComponent: ComponentOffer): CompatibilityIssue[] => {
    const issues: CompatibilityIssue[] = [];

    const motherboard = components.find(isMotherboardOffer);
    const ram = components.find(isMemoryOffer);

    if (isMemoryOffer(newComponent)) {
        if (motherboard && isMotherboardOffer(motherboard)) {
            if (motherboard.memoryType !== newComponent.type) {
                issues.push({
                    type: 'error',
                    message: `Pamięć RAM (${newComponent.type}) nie jest kompatybilna z płytą główną (${motherboard.memoryType})`,
                    affectedComponents: ['memory', 'motherboard']
                });
            }
        }
    }
    if (isMotherboardOffer(newComponent)) {
        if (ram && isMemoryOffer(ram)) {
            if (ram.type !== newComponent.memoryType) {
                issues.push({
                    type: 'error',
                    message: `Płyta główna (${newComponent.memoryType}) nie jest kompatybilna z pamięcią RAM (${ram.type})`,
                    affectedComponents: ['motherboard', 'memory']
                });
            }
        }
    }

    return issues;
};

const checkAllCompatibility = (components: ComponentOffer[], newComponent: ComponentOffer): CompatibilityIssue[] => {



    const issues: CompatibilityIssue[] = [];
  
  issues.push(...checkSocketCompatibility(components, newComponent));
  issues.push(...checkMemoryCompatibility(components, newComponent));
  // issues.push(...checkPowerRequirements(components, newComponent));
  
  return issues;
};

export const compatibilityIssuesAtom = atom<CompatibilityIssue[]>([]);

const userComputersAtom = atomWithStorage<computerAtom[]>('user_computers', []);
const guestComputersAtom = atomWithStorage<computerAtom[]>('guest_computers', []);
export const listOfComputers = atom(
  (get) => {
    const user = get(userAtom);
    if (user) {
      return get(userComputersAtom);
    } else {
      return get(guestComputersAtom);
    }
  },
  (get, set, newComputers: computerAtom[]) => {
    const user = get(userAtom);
    if (user) {
      set(userComputersAtom, newComputers);
    } else {
      set(guestComputersAtom, newComputers);
    }
  }
);

const guestSelectedComputerIdAtom = atomWithStorage<number | null>('guest_selectedComputerId', null);
const userSelectedComputerIdAtom = atomWithStorage<number | null>('user_selectedComputerId', null);

export const selectedComputerIdAtom = atom(
  (get) => {
    const user = get(userAtom);
    if (user) {
      return get(userSelectedComputerIdAtom);
    } else {
      return get(guestSelectedComputerIdAtom);
    }
  },
  (get, set, newIndex: number | null) => {
    const user = get(userAtom);
    if (user) {
      set(userSelectedComputerIdAtom, newIndex);
    } else {
      set(guestSelectedComputerIdAtom, newIndex);
    }
  }
);

// Current build being created (now represents the selected computerAtom's components)
export const currentBuildAtom = atom<ComponentOffer[]>((get) => {
  const computers = get(listOfComputers);
  const selectedIndex = get(selectedComputerIdAtom);
  
  if (selectedIndex === null) return [];
  
  const selectedComputer = computers[selectedIndex];
  return selectedComputer?.offers || [];
});

// Action to create new empty computerAtom
export const createNewEmptyComputerAtom = atom(
  null,
  (get, set) => {
    const computers = get(listOfComputers);
    
    const newComputer: computerAtom = {
      name: `Komputer ${computers.length + 1}`,
      price: 0,
      isVisible: false,
      offers: []
    };
    
    const newComputers = [...computers, newComputer];
    set(listOfComputers, newComputers);
    set(selectedComputerIdAtom, newComputers.length - 1);
  }
);

// Action to select computerAtom
export const selectComputerAtom = atom(
  null,
  (get, set, computerIndex: number | null) => {
    set(selectedComputerIdAtom, computerIndex);
  }
);

// Action to add component to selected computerAtom with compatibility checking
export const addComponentToBuildAtom = atom(
  null,
  (get, set, component: ComponentOffer) => {
    const computers = get(listOfComputers);
    const selectedIndex = get(selectedComputerIdAtom);
    
    if (selectedIndex === null) {
      // Create new computerAtom if none selected
      const newComputer: computerAtom = {
        name: `Komputer ${computers.length + 1}`,
        price: component.price,
        isVisible: false,
        offers: [component]
      };
      
      const newComputers = [...computers, newComputer];
      set(listOfComputers, newComputers);
      set(selectedComputerIdAtom, newComputers.length - 1);
      set(compatibilityIssuesAtom, []);
      
      showToast.success(`Dodano ${component.brand} ${component.model} do nowego komputera`);
      
      return;
    }
    
    const selectedComputer = computers[selectedIndex];
    if (!selectedComputer) return;
    
    // Check compatibility before adding
    const otherComponents = selectedComputer.offers.filter(c => c.componentType !== component.componentType);
    const compatibilityIssues = checkAllCompatibility(otherComponents, component);
    
    // Show compatibility issues as toasts
    if (compatibilityIssues.length > 0) {
      const errorIssues = compatibilityIssues.filter(issue => issue.type === 'error');
      const warningIssues = compatibilityIssues.filter(issue => issue.type === 'warning');
      
      if (errorIssues.length > 0) {
        errorIssues.forEach(issue => {
          showToast.error(issue.message);
        });
      }
      
      if (warningIssues.length > 0) {
        warningIssues.forEach(issue => {
          showToast.warning(issue.message);
        });
      }
    }
    
    set(compatibilityIssuesAtom, compatibilityIssues);
    
    const updatedComputers = computers.map((computer, index) => {
      if (index !== selectedIndex) return computer;
      
      const existingIndex = computer.offers.findIndex(c => c.componentType === component.componentType);
      let newComponents;
      
      if (existingIndex >= 0) {
        newComponents = [...computer.offers];
        newComponents[existingIndex] = component;
        
        showToast.success(`Zastąpiono komponent: ${component.brand} ${component.model}`);
      } else {
        newComponents = [...computer.offers, component];
        
        showToast.success(`Dodano: ${component.brand} ${component.model}`);
      }
      
      const newPrice = newComponents.reduce((sum, comp) => sum + comp.price, 0);
      
      return {
        ...computer,
        offers: newComponents,
        price: newPrice
      };
    });
    
    set(listOfComputers, updatedComputers);
  }
);

export const clearCompatibilityIssuesAtom = atom(
  null,
  (get, set) => {
    set(compatibilityIssuesAtom, []);
  }
);

export const removeComponentFromBuildAtom = atom(
  null,
  (get, set, componentType: string) => {
    const computers = get(listOfComputers);
    const selectedIndex = get(selectedComputerIdAtom);
    
    if (selectedIndex === null) return;
    
    const updatedComputers = computers.map((computer, index) => {
      if (index !== selectedIndex) return computer;
      
      const newComponents = computer.offers.filter(c => c.componentType !== componentType);
      const newPrice = newComponents.reduce((sum, comp) => sum + comp.price, 0);
      
      showToast.success(`Usunięto komponent typu: ${componentType}`);
      
      return {
        ...computer,
        offers: newComponents,
        price: newPrice
      };
    });
    
    set(listOfComputers, updatedComputers);
    
    set(compatibilityIssuesAtom, []);
  }
);

export const deleteComputerAtom = atom(
  null,
  (get, set, computerIndex: number) => {
    const computers = get(listOfComputers);
    const selectedIndex = get(selectedComputerIdAtom);
    
    const updatedComputers = computers.filter((_, index) => index !== computerIndex);
    set(listOfComputers, updatedComputers);
    
    if (selectedIndex === computerIndex) {
      set(selectedComputerIdAtom, null);
      set(compatibilityIssuesAtom, []);
    } else if (selectedIndex !== null && selectedIndex > computerIndex) {
      set(selectedComputerIdAtom, selectedIndex - 1);
    }
  }
);

export const renameComputerAtom = atom(
  null,
  (get, set, computerIndex: number, newName: string) => {
    const computers = get(listOfComputers);
    
    const updatedComputers = computers.map((computer, index) => 
      index === computerIndex 
        ? { ...computer, name: newName }
        : computer
    );
    
    set(listOfComputers, updatedComputers);
  }
);

export const toggleComputerVisibilityAtom = atom(
  null,
  (get, set, computerIndex: number) => {
    const computers = get(listOfComputers);
    
    const updatedComputers = computers.map((computer, index) => 
      index === computerIndex 
        ? { ...computer, isVisible: !computer.isVisible }
        : computer
    );
    
    set(listOfComputers, updatedComputers);
  }
);

export const migrateGuestDataAtom = atom(
  null,
  (get, set) => {
    const guestComputers = get(guestComputersAtom);
    const guestSelectedId = get(guestSelectedComputerIdAtom);
    
    if (guestComputers.length > 0) {
      const existingUserComputers = get(userComputersAtom);
      const mergedComputers = [...existingUserComputers, ...guestComputers];
      set(userComputersAtom, mergedComputers);
      set(userSelectedComputerIdAtom, guestSelectedId);

      set(guestComputersAtom, []);
      set(guestSelectedComputerIdAtom, null);
      
    }
  }
);
export const saveComputerToDbAtom = atom(
  null,
  async (get, set) => {
    const canSave = get(canSaveComputersAtom);
    if (!canSave) {
      throw new Error('Musisz być zalogowany aby zapisać zestaw');
    }

    const computers = get(listOfComputers);
    const userEmail = get(userAtom)?.email;
    if (!computers) return;

    const mappedComputers = computers.map(computer => ({
      name: computer.name,
      price: computer.price,
      isVisible: computer.isVisible,
      offers: computer.offers.map(offer => ({
        ...offer,
        type: offer.componentType
      }))
    }));
    console.log('Mapped computers to save:', mappedComputers);
    try {
      await customAxios.post(`/computerApi/user/${userEmail}/computers`, mappedComputers);
      console.log('Komputer zapisany w bazie');
    } catch (error) {
      console.error('Błąd zapisu do bazy:', error);
      throw error;
    }
  }
);
export const retriveComputersFromDbAtom = atom(
  null,
  async(get, set) => {
    const userEmail = get(userAtom)?.email;
    try {
      const response = await customAxios.get(`/computerApi/user/${userEmail}/computers`);
      set(userComputersAtom, response.data);
    } catch (error) {
      console.error('Błąd pobierania z bazy:', error);
      throw error;
    }
  }
)

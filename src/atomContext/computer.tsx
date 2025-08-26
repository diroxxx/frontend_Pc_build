import {atom} from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { userAtom, canSaveComputersAtom } from './userAtom';
import instance from '../components/instance';
import { showToast } from '../components/ui/ToastProvider/toastUtils';

import type { ComponentDto } from './offerAtom';

export type computer= {
    name: string;
    price: number;
    isVisible: boolean;
    components: ComponentDto[]
}

export type CompatibilityIssue = {
  type: 'warning' | 'error';
  message: string;
  affectedComponents: string[];
}

// Compatibility checking functions
const checkSocketCompatibility = (components: ComponentDto[], newComponent: ComponentDto): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const cpu = components.find(c => c.componentType.toLowerCase().includes('processor') || c.componentType.toLowerCase().includes('cpu'));
  const motherboard = components.find(c => c.componentType.toLowerCase().includes('motherboard'));
  const cooler = components.find(c => c.componentType.toLowerCase().includes('cooler') || c.componentType.toLowerCase().includes('chlodzenie'));
  
  // Check CPU-Motherboard compatibility
  if (newComponent.componentType.toLowerCase().includes('processor') || newComponent.componentType.toLowerCase().includes('cpu')) {
    if (motherboard && motherboard.boardSocketType && newComponent.cpuSocketType) {
      if (motherboard.boardSocketType !== newComponent.cpuSocketType) {
        issues.push({
          type: 'error',
          message: `Procesor (${newComponent.cpuSocketType}) nie jest kompatybilny z płytą główną (${motherboard.boardSocketType})`,
          affectedComponents: ['processor', 'motherboard']
        });
      }
    }
  }
  
  if (newComponent.componentType.toLowerCase().includes('motherboard')) {
    if (cpu && cpu.cpuSocketType && newComponent.boardSocketType) {
      if (cpu.cpuSocketType !== newComponent.boardSocketType) {
        issues.push({
          type: 'error',
          message: `Płyta główna (${newComponent.boardSocketType}) nie jest kompatybilna z procesorem (${cpu.cpuSocketType})`,
          affectedComponents: ['motherboard', 'processor']
        });
      }
    }
  }
  
  // Check Cooler-CPU compatibility
  if (newComponent.componentType.toLowerCase().includes('cooler') || newComponent.componentType.toLowerCase().includes('chlodzenie')) {
    if (cpu && cpu.cpuSocketType && newComponent.coolerSocketsType) {
      if (!newComponent.coolerSocketsType.includes(cpu.cpuSocketType)) {
        issues.push({
          type: 'error',
          message: `Chłodzenie nie obsługuje socketu procesora (${cpu.cpuSocketType})`,
          affectedComponents: ['cooler', 'processor']
        });
      }
    }
  }
  
  if (newComponent.componentType.toLowerCase().includes('processor') || newComponent.componentType.toLowerCase().includes('cpu')) {
    if (cooler && cooler.coolerSocketsType && newComponent.cpuSocketType) {
      if (!cooler.coolerSocketsType.includes(newComponent.cpuSocketType)) {
        issues.push({
          type: 'warning',
          message: `Obecne chłodzenie może nie obsługiwać nowego procesora (${newComponent.cpuSocketType})`,
          affectedComponents: ['processor', 'cooler']
        });
      }
    }
  }
  
  return issues;
};

const checkMemoryCompatibility = (components: ComponentDto[], newComponent: ComponentDto): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const motherboard = components.find(c => c.componentType.toLowerCase().includes('motherboard'));
  const ram = components.find(c => c.componentType.toLowerCase().includes('memory') || c.componentType.toLowerCase().includes('ram'));
  
  // Check RAM-Motherboard compatibility
  if (newComponent.componentType.toLowerCase().includes('memory') || newComponent.componentType.toLowerCase().includes('ram')) {
    if (motherboard && motherboard.boardMemoryType && newComponent.ramType) {
      if (motherboard.boardMemoryType !== newComponent.ramType) {
        issues.push({
          type: 'error',
          message: `Pamięć RAM (${newComponent.ramType}) nie jest kompatybilna z płytą główną (${motherboard.boardMemoryType})`,
          affectedComponents: ['memory', 'motherboard']
        });
      }
    }
  }
  
  if (newComponent.componentType.toLowerCase().includes('motherboard')) {
    if (ram && ram.ramType && newComponent.boardMemoryType) {
      if (ram.ramType !== newComponent.boardMemoryType) {
        issues.push({
          type: 'error',
          message: `Płyta główna (${newComponent.boardMemoryType}) nie jest kompatybilna z pamięcią RAM (${ram.ramType})`,
          affectedComponents: ['motherboard', 'memory']
        });
      }
    }
  }
  
  return issues;
};

const checkPowerRequirements = (components: ComponentDto[], newComponent: ComponentDto): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const psu = components.find(c => c.componentType.toLowerCase().includes('power') || c.componentType.toLowerCase().includes('psu'));
  const gpu = components.find(c => c.componentType.toLowerCase().includes('graphics') || c.componentType.toLowerCase().includes('gpu'));
  
  if (psu && psu.powerSupplyMaxPowerWatt) {
    let estimatedPower = 0;
    
    // Estimate power consumption
    components.forEach(comp => {
      if (comp.componentType.toLowerCase().includes('graphics') || comp.componentType.toLowerCase().includes('gpu')) {
        estimatedPower += comp.gpuPowerDraw || 200; // Default estimate
      } else if (comp.componentType.toLowerCase().includes('processor') || comp.componentType.toLowerCase().includes('cpu')) {
        estimatedPower += 100; // CPU estimate
      }
    });
    
    // Add new component power
    if (newComponent.componentType.toLowerCase().includes('graphics') || newComponent.componentType.toLowerCase().includes('gpu')) {
      estimatedPower += newComponent.gpuPowerDraw || 200;
    } else if (newComponent.componentType.toLowerCase().includes('processor') || newComponent.componentType.toLowerCase().includes('cpu')) {
      estimatedPower += 100;
    }
    
    // Add base system power (motherboard, RAM, storage, etc.)
    estimatedPower += 150;
    
    if (estimatedPower > psu.powerSupplyMaxPowerWatt) {
      issues.push({
        type: 'error',
        message: `Zasilacz (${psu.powerSupplyMaxPowerWatt}W) może być za słaby. Szacowane zapotrzebowanie: ${estimatedPower}W`,
        affectedComponents: ['power_supply']
      });
    } else if (estimatedPower > psu.powerSupplyMaxPowerWatt * 0.8) {
      issues.push({
        type: 'warning',
        message: `Zasilacz będzie mocno obciążony. Szacowane zapotrzebowanie: ${estimatedPower}W z ${psu.powerSupplyMaxPowerWatt}W`,
        affectedComponents: ['power_supply']
      });
    }
  }
  
  return issues;
};

const checkAllCompatibility = (components: ComponentDto[], newComponent: ComponentDto): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  issues.push(...checkSocketCompatibility(components, newComponent));
  issues.push(...checkMemoryCompatibility(components, newComponent));
  issues.push(...checkPowerRequirements(components, newComponent));
  
  return issues;
};

export const compatibilityIssuesAtom = atom<CompatibilityIssue[]>([]);

const userComputersAtom = atomWithStorage<computer[]>('user_computers', []);
const guestComputersAtom = atomWithStorage<computer[]>('guest_computers', []);
export const listOfComputers = atom(
  (get) => {
    const user = get(userAtom);
    if (user) {
      return get(userComputersAtom);
    } else {
      return get(guestComputersAtom);
    }
  },
  (get, set, newComputers: computer[]) => {
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

// Current build being created (now represents the selected computer's components)
export const currentBuildAtom = atom<ComponentDto[]>((get) => {
  const computers = get(listOfComputers);
  const selectedIndex = get(selectedComputerIdAtom);
  
  if (selectedIndex === null) return [];
  
  const selectedComputer = computers[selectedIndex];
  return selectedComputer?.components || [];
});

// Action to create new empty computer
export const createNewEmptyComputerAtom = atom(
  null,
  (get, set) => {
    const computers = get(listOfComputers);
    
    const newComputer: computer = {
      name: `Komputer ${computers.length + 1}`,
      price: 0,
      isVisible: false,
      components: []
    };
    
    const newComputers = [...computers, newComputer];
    set(listOfComputers, newComputers);
    set(selectedComputerIdAtom, newComputers.length - 1);
  }
);

// Action to select computer
export const selectComputerAtom = atom(
  null,
  (get, set, computerIndex: number | null) => {
    set(selectedComputerIdAtom, computerIndex);
  }
);

// Action to add component to selected computer with compatibility checking
export const addComponentToBuildAtom = atom(
  null,
  (get, set, component: ComponentDto) => {
    const computers = get(listOfComputers);
    const selectedIndex = get(selectedComputerIdAtom);
    
    if (selectedIndex === null) {
      // Create new computer if none selected
      const newComputer: computer = {
        name: `Komputer ${computers.length + 1}`,
        price: component.price,
        isVisible: false,
        components: [component]
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
    const otherComponents = selectedComputer.components.filter(c => c.componentType !== component.componentType);
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
      
      const existingIndex = computer.components.findIndex(c => c.componentType === component.componentType);
      let newComponents;
      
      if (existingIndex >= 0) {
        // Replace existing component of same type
        newComponents = [...computer.components];
        newComponents[existingIndex] = component;
        
        showToast.success(`Zastąpiono komponent: ${component.brand} ${component.model}`);
      } else {
        // Add new component
        newComponents = [...computer.components, component];
        
        showToast.success(`Dodano: ${component.brand} ${component.model}`);
      }
      
      const newPrice = newComponents.reduce((sum, comp) => sum + comp.price, 0);
      
      return {
        ...computer,
        components: newComponents,
        price: newPrice
      };
    });
    
    set(listOfComputers, updatedComputers);
  }
);

// Action to clear compatibility issues
export const clearCompatibilityIssuesAtom = atom(
  null,
  (get, set) => {
    set(compatibilityIssuesAtom, []);
  }
);

// Action to remove component from selected computer
export const removeComponentFromBuildAtom = atom(
  null,
  (get, set, componentType: string) => {
    const computers = get(listOfComputers);
    const selectedIndex = get(selectedComputerIdAtom);
    
    if (selectedIndex === null) return;
    
    const updatedComputers = computers.map((computer, index) => {
      if (index !== selectedIndex) return computer;
      
      const newComponents = computer.components.filter(c => c.componentType !== componentType);
      const newPrice = newComponents.reduce((sum, comp) => sum + comp.price, 0);
      
      showToast.success(`Usunięto komponent typu: ${componentType}`);
      
      return {
        ...computer,
        components: newComponents,
        price: newPrice
      };
    });
    
    set(listOfComputers, updatedComputers);
    
    // Clear compatibility issues after removing component
    set(compatibilityIssuesAtom, []);
  }
);

// Action to delete computer
export const deleteComputerAtom = atom(
  null,
  (get, set, computerIndex: number) => {
    const computers = get(listOfComputers);
    const selectedIndex = get(selectedComputerIdAtom);
    
    const updatedComputers = computers.filter((_, index) => index !== computerIndex);
    set(listOfComputers, updatedComputers);
    
    // If deleted computer was selected, clear selection
    if (selectedIndex === computerIndex) {
      set(selectedComputerIdAtom, null);
      set(compatibilityIssuesAtom, []);
    } else if (selectedIndex !== null && selectedIndex > computerIndex) {
      // Adjust selected index if it's after deleted computer
      set(selectedComputerIdAtom, selectedIndex - 1);
    }
  }
);

// Action to rename computer
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

// Action to toggle computer visibility
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

// Action to migrate guest data to user account after login
export const migrateGuestDataAtom = atom(
  null,
  (get, set) => {
    const guestComputers = get(guestComputersAtom);
    const guestSelectedId = get(guestSelectedComputerIdAtom);
    
    if (guestComputers.length > 0) {
      // Przenieś dane z guest do user storage
      const existingUserComputers = get(userComputersAtom);
      const mergedComputers = [...existingUserComputers, ...guestComputers];
      set(userComputersAtom, mergedComputers);
      set(userSelectedComputerIdAtom, guestSelectedId);

      // Wyczyść guest storage
      set(guestComputersAtom, []);
      set(guestSelectedComputerIdAtom, null);
      
      console.log('Dane przeniesione z sesji gościa do konta użytkownika');
    }
  }
);
// Action to save computer to database (tylko dla zalogowanych)
export const saveComputerToDbAtom = atom(
  null,
  async (get, set) => {
    const canSave = get(canSaveComputersAtom);
    if (!canSave) {
      throw new Error('Musisz być zalogowany aby zapisać zestaw');
    }

    const computers = get(listOfComputers);
    const userEmail = get(userAtom)?.email;
    console.log(computers)
    console.log(userEmail)
    if (!computers) return;

    try {
      await instance.post(`/computerApi/user/${userEmail}/computers`, computers);
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
      const response = await instance.get(`/computerApi/user/${userEmail}/computers`);
      
       console.log('=== RECEIVED FROM DB ===');
      console.log('Raw response:', response.data);
      console.log('First computer:', response.data[0]);
      console.log('Components:', response.data[0]?.components);
      set(userComputersAtom, response.data);

    } catch (error) {
      console.error('Błąd pobierania z bazy:', error);
      throw error;
    }
  }
)

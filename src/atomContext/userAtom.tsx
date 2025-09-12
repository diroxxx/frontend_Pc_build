import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { jwtDecode } from 'jwt-decode';
import { getAuthToken, setAuthToken} from '../components/Auth';

import { saveComputerToDbAtom, listOfComputers, retriveComputersFromDbAtom, migrateGuestDataAtom } from './computer';

export interface User {
  email: string;
  role: string;
  nickname: string;
}

export interface CustomJwtPayload {
  sub: string;
  role: string;
  username: string;
  exp: number;
}

export const userAtom = atomWithStorage<User | null>('user', null);
export const isAuthenticatedAtom = atom<boolean>((get) => {
  const user = get(userAtom);
  return user !== null;
});

export const loginUserAtom = atom(
  null,
  async (get, set, token: string) => {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const user: User = {
        email: decoded.sub,
        role: decoded.role,
        nickname: decoded.username
      };
      
      setAuthToken(token);
      set(userAtom, user);
      set(migrateGuestDataAtom);

      try {
        await set(retriveComputersFromDbAtom);
        console.log('Zestawy pobrane i zsynchronizowane');
      } catch (error) {
        console.warn('Nie udało się pobrać zestawów z bazy:', error);
      }
    } catch (error) {
      console.error('Błąd dekodowania tokenu:', error);
      throw new Error('Nieprawidłowy token');
    }
  }
);

export const logoutUserAtom = atom(
  null,
  async (get, set) => {
    const user = get(userAtom);
    if (user) {
      try {
        console.log('Saving computers before logout...');
        await set(saveComputerToDbAtom); 
        console.log('Computers saved successfully');
      } catch (error) {
        console.error('Error saving computers before logout:', error);
      }
    }
    
    console.log('Clearing tokens...');
    setAuthToken(null);
    set(userAtom, null);

    localStorage.removeItem('computers');
    localStorage.removeItem('computers_last_sync');
    localStorage.removeItem('selectedComputerId');
  }
);


// Computed atom to check if user can save computers
export const canSaveComputersAtom = atom<boolean>((get) => {
  const user = get(userAtom);
  return user !== null; 
});



export const loginAdminAtom = atom(
  null,
  async (get, set, token: string) => {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      
      if (decoded.role !== 'ADMIN') {
        throw new Error('Brak uprawnień administratora');
      }
      
      const user: User = {
        email: decoded.sub,
        role: decoded.role,
        nickname: decoded.username
      };
      
      setAuthToken(token);
      set(userAtom, user);
            
    } catch (error) {
      console.error('Błąd logowania administratora:', error);
      throw new Error('Nieprawidłowy token administratora');
    }
  }
);

export const logoutAdminAtom = atom(
  null,
  async (get, set) => {

    setAuthToken(null);
    set(userAtom, null);
        
    console.log('Administrator wylogowany');
  }
);
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { jwtDecode } from 'jwt-decode';
import {setAuthToken} from '../lib/Auth.tsx';

import {retriveComputersFromDbAtom, migrateGuestDataAtom } from './computerAtom.tsx';

export interface User {
    // id: number;
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
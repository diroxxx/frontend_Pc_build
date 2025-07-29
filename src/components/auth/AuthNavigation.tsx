import React from 'react';
import { Link } from 'react-router-dom';

interface AuthNavigationProps {
  type: 'login' | 'register';
}

const AuthNavigation: React.FC<AuthNavigationProps> = ({ type }) => {
  if (type === 'login') {
    return (
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200 focus:outline-none focus:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link 
          to="/login" 
          className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200 focus:outline-none focus:underline"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default AuthNavigation;
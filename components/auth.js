import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom } from '@/store';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [authenticated] = useAtom(isAuthenticatedAtom);

    useEffect(() => {
      if (!authenticated) {
        // Redirect to login page if not authenticated
        router.replace('/login');
      }
    }, [authenticated]);

    // Render the wrapped component only if authenticated
    return authenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
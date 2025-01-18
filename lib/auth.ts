import { useRouter } from 'next/navigation';

export function handleLogout(router: any) {
  // Clear auth token cookie
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  router.replace('/auth');
}

export function handleUnauthorized(error: any, router: any) {
  // Handle Error objects
  if (error instanceof Error) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      handleLogout(router);
      return true;
    }
  }
  // Handle string errors
  else if (typeof error === 'string' && (error === 'Unauthorized' || error === 'Invalid token')) {
    handleLogout(router);
    return true;
  }
  return false;
}

export function handleApiError(error: any, router: any) {
  // If it's an unauthorized error, handle it
  if (handleUnauthorized(error, router)) {
    return;
  }
  
  // For other errors, show them to the user
  const message = error instanceof Error ? error.message : 'An error occurred';
  alert(message);
} 
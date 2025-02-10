import { clearCache } from './utils';

export async function handleLogout(router: any) {
  try {
    // Clear all caches and storage
    clearCache();

    // Call logout API
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Cache-Control': 'no-cache' }
    });

    // Navigate to login page
    router.replace('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect to login even if there's an error
    router.replace('/login');
  }
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
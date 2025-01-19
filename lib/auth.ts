export async function handleLogout(router: any) {
  try {
    // Clear client-side storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Make a request to clear server-side session
    const response = await fetch('/api/auth/logout', { 
      method: 'POST',
      credentials: 'include' // Important for cookie handling
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Force a page reload to clear any in-memory state
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if server logout fails
    window.location.href = '/login';
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
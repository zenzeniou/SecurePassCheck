let csrfToken = '';

export async function fetchCSRFToken() {
    try {
        const response = await fetch('/api/csrf-token', {
            credentials: 'include',
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json();
        csrfToken = data.csrf_token;
        console.log("CSRF token fetched:", csrfToken);
        return csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
}

export function getCSRFToken() {
    if (!csrfToken) {
        console.warn("CSRF token is empty!");
    }
    return csrfToken;
}
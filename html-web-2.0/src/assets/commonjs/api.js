import http from './onloadF.js';

// export const getUserInfo = params => http.get('', params);
export const logout = params => http.get('/api/logout', params);

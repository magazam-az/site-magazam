// #region agent log
/**
 * prepareHeaders - RTK Query üçün Authorization header set edir
 * Token localStorage-dən oxuyur və Bearer token formatında header-ə əlavə edir
 */
export const prepareHeaders = (headers, { getState }) => {
  try {
    // #region agent log
    const logData = {
      location: 'prepareHeaders.js:7',
      message: 'prepareHeaders çağırıldı',
      data: {
        timestamp: Date.now(),
        localStorageKeys: Object.keys(localStorage || {}),
        hasToken: !!localStorage.getItem('token'),
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A'
    };
    fetch('http://127.0.0.1:7242/ingest/49f3303b-3f26-416c-a253-5eeb0b1414d8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {});
    console.log('[DEBUG] 🔵 [prepareHeaders] prepareHeaders çağırıldı', {
      hasToken: !!localStorage.getItem('token'),
      localStorageKeys: Object.keys(localStorage || {})
    });
    // #endregion

    // Token-i localStorage-dən oxuyur
    let token = localStorage.getItem('token');
    
    // Əgər token yoxdursa, user object-dən cəhd edir (fallback)
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.token) {
            token = user.token;
            localStorage.setItem('token', token); // Cache et
            console.log('[DEBUG] ⚠️ Token user object-dən alındı və localStorage-ə yazıldı');
          }
        } catch (e) {
          console.error('[DEBUG] User parse error:', e);
        }
      }
    }

    // #region agent log
    if (token) {
      const headerLog = {
        location: 'prepareHeaders.js:43',
        message: '✅ Authorization header set edildi',
        data: {
          tokenLength: token?.length,
          tokenPrefix: token?.substring(0, 20) + '...',
          headerValue: `Bearer ${token.trim()}`.substring(0, 30) + '...'
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A'
      };
      fetch('http://127.0.0.1:7242/ingest/49f3303b-3f26-416c-a253-5eeb0b1414d8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headerLog)
      }).catch(() => {});
      console.log('[DEBUG] ✅ [prepareHeaders] Authorization header set edildi', {
        tokenLength: token?.length,
        headerValue: `Bearer ${token.trim()}`.substring(0, 30) + '...'
      });
    } else {
      const noTokenLog = {
        location: 'prepareHeaders.js:60',
        message: '⚠️ NO TOKEN FOUND',
        data: {
          localStorageContents: {
            token: localStorage.getItem('token'),
            user: localStorage.getItem('user') ? 'exists' : null,
            isAuthenticated: localStorage.getItem('isAuthenticated')
          }
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A'
      };
      fetch('http://127.0.0.1:7242/ingest/49f3303b-3f26-416c-a253-5eeb0b1414d8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noTokenLog)
      }).catch(() => {});
      console.warn('[DEBUG] ⚠️ [prepareHeaders] NO TOKEN FOUND');
    }
    // #endregion

    // Token varsa, Authorization header-ə əlavə et
    if (token) {
      const bearerToken = `Bearer ${token.trim()}`;
      headers.set('authorization', bearerToken);
      headers.set('Authorization', bearerToken); // Case-sensitive fallback
      
      // #region agent log
      // Verify header was actually set
      const verifyHeaderLog = {
        location: 'prepareHeaders.js:78',
        message: '🔍 Header verify - set edildi',
        data: {
          hasAuthorization: headers.has('authorization'),
          hasAuthorizationUpper: headers.has('Authorization'),
          headerValue: headers.get('authorization')?.substring(0, 30) + '...' || null,
          allHeaders: Array.from(headers.entries()).map(([k]) => k),
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A'
      };
      fetch('http://127.0.0.1:7242/ingest/49f3303b-3f26-416c-a253-5eeb0b1414d8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyHeaderLog)
      }).catch(() => {});
      console.log('[DEBUG] 🔍 [prepareHeaders] Header verify:', {
        hasAuthorization: headers.has('authorization'),
        hasAuthorizationUpper: headers.has('Authorization'),
        headerValue: headers.get('authorization')?.substring(0, 30) + '...',
        allHeaders: Array.from(headers.entries()).map(([k]) => k)
      });
      // #endregion
      
      return headers;
    }

    return headers;
  } catch (error) {
    console.error('[DEBUG] ❌ [prepareHeaders] Error:', error);
    return headers;
  }
};
// #endregion


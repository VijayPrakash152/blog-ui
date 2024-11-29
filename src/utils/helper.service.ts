// src/common/helpers.ts
export const getCookieValue = (name: string): string | null => {
    if (typeof document === "undefined") {
      return null; // Cookies can only be accessed in the browser, not on the server
    }
    
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };
  

  // src/common/helpers.ts

export const getXrefToken = (): string | null => {
    if (typeof window === "undefined") return null; // Make sure it's only accessed in the browser
    
    // Assume x-ref token is stored in localStorage (change as needed)
    return localStorage.getItem("xrefToken") || null;
  };

// src/common/helpers.ts

export const getAccessToken = (): string | null => {
    if (typeof window === "undefined") return null; // Make sure it's only accessed in the browser
    
    // Assume token is stored in localStorage (change as needed)
    return localStorage.getItem("accessToken") || null;
  };

  
  // src/common/helpers.ts

export const addTimestampToUrl = (url: string): string => {
    const timestamp = new Date().getTime(); // Get current timestamp
    const separator = url.includes('?') ? '&' : '?'; // Check if the URL already has query params
    return `${url}${separator}t=${timestamp}`;
  };
  
  
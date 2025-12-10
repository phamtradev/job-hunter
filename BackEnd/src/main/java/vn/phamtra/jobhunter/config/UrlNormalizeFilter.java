package vn.phamtra.jobhunter.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to normalize URLs by removing double slashes
 * Example: //uploads/company/file.jpg -> /uploads/company/file.jpg
 */
@Component
public class UrlNormalizeFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        
        // Normalize double slashes (except after protocol like http://)
        if (requestURI.contains("//")) {
            // Replace multiple slashes with single slash, but preserve http:// or https://
            String normalizedURI = requestURI.replaceAll("(?<!http:|https:)/{2,}", "/");
            
            if (!normalizedURI.equals(requestURI)) {
                // Create a wrapper request with normalized URI
                HttpServletRequest normalizedRequest = new HttpServletRequestWrapper(request) {
                    @Override
                    public String getRequestURI() {
                        return normalizedURI;
                    }
                    
                    @Override
                    public StringBuffer getRequestURL() {
                        StringBuffer url = new StringBuffer();
                        String scheme = getScheme();
                        int port = getServerPort();
                        
                        url.append(scheme).append("://").append(getServerName());
                        if ((scheme.equals("http") && port != 80) || (scheme.equals("https") && port != 443)) {
                            url.append(':').append(port);
                        }
                        url.append(normalizedURI);
                        return url;
                    }
                };
                
                filterChain.doFilter(normalizedRequest, response);
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}


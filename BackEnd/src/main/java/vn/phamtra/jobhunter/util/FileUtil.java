package vn.phamtra.jobhunter.util;

/**
 * Utility class for file path/URL normalization
 */
public class FileUtil {

    /**
     * Extract only filename from path/URL
     * Examples:
     * - "/uploads/company/1716687538974-amzon.jpg" -> "1716687538974-amzon.jpg"
     * - "company/1716687538974-amzon.jpg" -> "1716687538974-amzon.jpg"
     * - "1716687538974-amzon.jpg" -> "1716687538974-amzon.jpg"
     * 
     * @param pathOrUrl The file path or URL (can be null or empty)
     * @return Only the filename, or null if input is null/empty
     */
    public static String extractFilename(String pathOrUrl) {
        if (pathOrUrl == null || pathOrUrl.trim().isEmpty()) {
            return null;
        }
        
        // Remove leading/trailing slashes and whitespace
        String normalized = pathOrUrl.trim();
        
        // Remove protocol and domain if present (http://, https://, file://)
        if (normalized.contains("://")) {
            int protocolEnd = normalized.indexOf("://") + 3;
            int pathStart = normalized.indexOf("/", protocolEnd);
            if (pathStart > 0) {
                normalized = normalized.substring(pathStart);
            }
        }
        
        // Remove leading slashes
        while (normalized.startsWith("/")) {
            normalized = normalized.substring(1);
        }
        
        // Remove common prefixes
        if (normalized.startsWith("uploads/")) {
            normalized = normalized.substring("uploads/".length());
        }
        if (normalized.startsWith("storage/")) {
            normalized = normalized.substring("storage/".length());
        }
        
        // Extract filename (last part after last slash)
        int lastSlash = normalized.lastIndexOf("/");
        if (lastSlash >= 0 && lastSlash < normalized.length() - 1) {
            normalized = normalized.substring(lastSlash + 1);
        }
        
        // Remove folder prefix if still present (e.g., "company/filename.jpg" -> "filename.jpg")
        // But only if it looks like a folder (common folder names)
        String[] commonFolders = {"company", "resume", "user", "avatar", "logo"};
        for (String folder : commonFolders) {
            if (normalized.startsWith(folder + "/")) {
                normalized = normalized.substring(folder.length() + 1);
                break;
            }
        }
        
        return normalized.isEmpty() ? null : normalized;
    }
}


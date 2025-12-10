package vn.phamtra.jobhunter.util;

/**
 * Utility class for file operations
 */
public class FileUtil {

    /**
     * Normalize filename by removing folder prefix if present.
     * Examples:
     * - "company/1716687538974-amzon.jpg" -> "1716687538974-amzon.jpg"
     * - "resume/123-cv.pdf" -> "123-cv.pdf"
     * - "1716687538974-amzon.jpg" -> "1716687538974-amzon.jpg" (no change)
     * 
     * @param fileName The filename that may contain folder prefix
     * @return Only the filename without folder prefix
     */
    public static String normalizeFileName(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return fileName;
        }
        
        // Remove leading slashes
        fileName = fileName.trim();
        if (fileName.startsWith("/")) {
            fileName = fileName.substring(1);
        }
        
        // Remove folder prefix (e.g., "company/", "resume/", etc.)
        // Only remove if there's exactly one slash (folder/filename pattern)
        int lastSlashIndex = fileName.lastIndexOf('/');
        if (lastSlashIndex > 0 && lastSlashIndex < fileName.length() - 1) {
            // Check if it's a folder/filename pattern (not a path with multiple slashes)
            String beforeSlash = fileName.substring(0, lastSlashIndex);
            if (!beforeSlash.contains("/")) {
                // It's a simple folder/filename pattern, extract only filename
                return fileName.substring(lastSlashIndex + 1);
            }
        }
        
        // If it's already just a filename or has multiple slashes, return as is
        return fileName;
    }
}




package vn.phamtra.jobhunter.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {

    @Value("${phamtra.upload-file.base-uri}")
    private String baseURI;

    public void createDirectory(String folder) throws IOException {
        try {
            // Normalize base URI: remove "file:" prefix
            String basePath = baseURI.replace("file:", "").replace("file://", "");
            if (basePath.endsWith("/")) {
                basePath = basePath.substring(0, basePath.length() - 1);
            }
            
            System.out.println(">>> FileService - Base URI: " + baseURI);
            System.out.println(">>> FileService - Base path: " + basePath);
            System.out.println(">>> FileService - Folder: " + folder);
            
            // Build full directory path
            Path root = Paths.get(basePath).toAbsolutePath().normalize();
            Path dirPath = root.resolve(folder).normalize();
            
            System.out.println(">>> FileService - Root path: " + root);
            System.out.println(">>> FileService - Directory path: " + dirPath);
            
            // Ensure directory is within root (security check)
            if (!dirPath.startsWith(root)) {
                throw new IOException("Invalid directory path: " + folder + " (outside root: " + root + ")");
            }
            
            // Create directory and all parent directories if they don't exist
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
                System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + dirPath);
            } else {
                System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS: " + dirPath);
            }
        } catch (Exception e) {
            System.err.println(">>> FileService.createDirectory ERROR: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to create directory: " + e.getMessage(), e);
        }
    }

    public String store(MultipartFile file, String folder) throws IOException {
        try {
           
            String basePath = baseURI.replace("file:", "").replace("file://", "");
            if (basePath.endsWith("/")) {
                basePath = basePath.substring(0, basePath.length() - 1);
            }
            
            
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || originalFileName.isEmpty()) {
                throw new IOException("File name is empty");
            }
            String finalName = System.currentTimeMillis() + "-" + originalFileName;
            
            System.out.println(">>> FileService.store - Base path: " + basePath);
            System.out.println(">>> FileService.store - Folder: " + folder);
            System.out.println(">>> FileService.store - Final name: " + finalName);
            
            // Build full file path using Path (handles special characters correctly)
            Path root = Paths.get(basePath).toAbsolutePath().normalize();
            Path filePath = root.resolve(folder).resolve(finalName).normalize();
            
            System.out.println(">>> FileService.store - Root: " + root);
            System.out.println(">>> FileService.store - File path: " + filePath);
            
            // Ensure file is within root (security check)
            if (!filePath.startsWith(root)) {
                throw new IOException("Invalid file path: " + folder + "/" + finalName + " (outside root: " + root + ")");
            }
            
            // Ensure parent directory exists
            Path parentDir = filePath.getParent();
            if (!Files.exists(parentDir)) {
                System.out.println(">>> FileService.store - Creating parent directory: " + parentDir);
                Files.createDirectories(parentDir);
            }
            
            // Copy file
            System.out.println(">>> FileService.store - Copying file to: " + filePath);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }
            
            System.out.println(">>> FILE STORED SUCCESSFULLY: " + filePath);
            return finalName; 
        } catch (Exception e) {
            System.err.println(">>> FileService.store ERROR: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to store file: " + e.getMessage(), e);
        }
    }

}

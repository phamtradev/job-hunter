package vn.phamtra.jobhunter.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {

    @Value("${phamtra.upload-file.base-uri}")
    private String baseURI;

    public void createDirectory(String folder) throws URISyntaxException {
        try {
            URI uri = new URI(folder);
            Path path = Paths.get(uri);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + folder);
            } else {
                System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String store(MultipartFile file, String folder) throws URISyntaxException, IOException { //luu file vao folder
        // create unique filename
        String finalName = System.currentTimeMillis() + "-" + file.getOriginalFilename();

        // Parse baseURI to get the base path
        URI baseUri = new URI(baseURI);
        Path basePath = Paths.get(baseUri);
        
        // Build full path using Paths.get() which handles special characters better
        Path fullPath = basePath.resolve(folder).resolve(finalName);
        
        // Create parent directories if they don't exist
        Files.createDirectories(fullPath.getParent());
        
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, fullPath,
                    StandardCopyOption.REPLACE_EXISTING);
        }
        return finalName;
    }

}

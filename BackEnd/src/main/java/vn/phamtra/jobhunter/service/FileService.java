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
        Path root = Paths.get(baseURI.replace("file:", ""));
        Path path = root.resolve(folder);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + path);
        } else {
            System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
        }
    }

    public String store(MultipartFile file, String folder) throws IOException { //luu file vao folder
        // create unique filename
        String finalName = System.currentTimeMillis() + "-" + file.getOriginalFilename();

        Path root = Paths.get(baseURI.replace("file:", ""));
        Path path = root.resolve(folder).resolve(finalName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path,
                    StandardCopyOption.REPLACE_EXISTING);
        }
        return finalName;
    }

}

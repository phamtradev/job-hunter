package vn.phamtra.jobhunter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vn.phamtra.jobhunter.domain.response.File.ResUploadFileDTO;
import vn.phamtra.jobhunter.service.FileService;
import vn.phamtra.jobhunter.util.annotation.ApiMessage;
import vn.phamtra.jobhunter.util.error.StorageException;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    @ApiMessage("upload single file")
    public ResponseEntity<ResUploadFileDTO> uploadFile(@RequestParam(value = "file", required = false) MultipartFile file,
                                                       @RequestParam("folder") String folder) throws IOException, StorageException {
        try {
            //validate
            if (file == null || file.isEmpty()) {
                throw new StorageException("File is empty. Please upload a file");
            }

            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || originalFileName.isEmpty()) {
                throw new StorageException("File name is empty");
            }

            List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx");

            boolean isValid = allowedExtensions.stream().anyMatch(item -> originalFileName.toLowerCase().endsWith(item));
            if (!isValid) {
                throw new StorageException("Invalid file extension. Only allows " + allowedExtensions.toString());
            }

            System.out.println(">>> FileController - Uploading file: " + originalFileName + " to folder: " + folder);

            //create a directory if not exist (FileService will handle baseURI internally)
            this.fileService.createDirectory(folder);

            //store file
            String storedFileName = this.fileService.store(file, folder);

            // Return relative path: folder/filename (frontend will add /uploads/ prefix)
            // This avoids duplicate /uploads/ if frontend already adds it
            String relativePath = folder + "/" + storedFileName;

            System.out.println(">>> FileController - File uploaded successfully. Relative path: " + relativePath);

            ResUploadFileDTO res = new ResUploadFileDTO(relativePath, Instant.now());
            return ResponseEntity.ok().body(res);
        } catch (StorageException e) {
            System.err.println(">>> FileController - StorageException: " + e.getMessage());
            throw e;
        } catch (IOException e) {
            System.err.println(">>> FileController - IOException: " + e.getMessage());
            e.printStackTrace();
            throw new StorageException("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            System.err.println(">>> FileController - Unexpected error: " + e.getMessage());
            e.printStackTrace();
            throw new StorageException("Unexpected error during file upload: " + e.getMessage());
        }
    }
}

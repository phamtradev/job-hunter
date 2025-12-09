package vn.phamtra.jobhunter.controller;

import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
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
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    @Value("${phamtra.upload-file.base-uri}")
    private String baseURI;

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
@ApiMessage("upload single file")
public ResponseEntity<ResUploadFileDTO> uploadFile(
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam("folder") String folder
) throws URISyntaxException, IOException, StorageException {
    
    if (file == null || file.isEmpty()) {
        throw new StorageException("File is empty. Please upload a file");
    }

    String originalName = file.getOriginalFilename();
    List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx");

    boolean isValid = allowedExtensions.stream()
            .anyMatch(ext -> originalName.toLowerCase().endsWith(ext));

    if (!isValid) {
        throw new StorageException("Invalid file extension. Only allows " + allowedExtensions);
    }

    // Create directory
    this.fileService.createDirectory(folder);

    // Store file (đổi tên biến để tránh trùng)
    String storedFileName = this.fileService.store(file, folder);

    ResUploadFileDTO res = new ResUploadFileDTO(storedFileName, Instant.now());

    return ResponseEntity.ok().body(res);
}
}

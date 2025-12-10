package vn.phamtra.jobhunter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vn.phamtra.jobhunter.service.FileService;
import vn.phamtra.jobhunter.util.annotation.ApiMessage;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    @ApiMessage("upload single file")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folder) throws Exception {

        Map<String, String> result = fileService.uploadToCloudinary(file, folder);

        return ResponseEntity.ok(Map.of(
                "fileUrl", result.get("url"),
                "publicId", result.get("publicId"),
                "uploadedAt", Instant.now()));
    }
}

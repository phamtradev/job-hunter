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
        //validate
        if (file == null || file.isEmpty()) {
            throw new StorageException("File is empty. Please upload a file");
        }

        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx");

        boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));
        if (!isValid) {
            throw new StorageException("Invalid file extension. Only allows " + allowedExtensions.toString());
        }

        //create a directory if not exist (FileService will handle baseURI internally)
        this.fileService.createDirectory(folder);

        //store file
        String fileName = this.fileService.store(file, folder);

        // Build public URL: /uploads/folder/filename
        String publicUrl = "/uploads/" + folder + "/" + fileName;

        ResUploadFileDTO res = new ResUploadFileDTO(publicUrl, Instant.now());


        return ResponseEntity.ok().body(res);
    }
}

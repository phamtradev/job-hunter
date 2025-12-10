package vn.phamtra.jobhunter.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileService {

    private final Cloudinary cloudinary;

    public FileService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map<String, String> uploadToCloudinary(MultipartFile file, String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IOException("File empty!");
        }

        String original = file.getOriginalFilename();

        String finalName;
        if (hasTimestampPrefix(original)) {
            finalName = original;
        } else {
            finalName = System.currentTimeMillis() + "-" + original;
        }

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "public_id", finalName,
                        "overwrite", true));

        return Map.of(
                "url", uploadResult.get("secure_url").toString(),
                "publicId", uploadResult.get("public_id").toString());
    }

    private boolean hasTimestampPrefix(String name) {
        if (name == null)
            return false;
        int idx = name.indexOf("-");
        if (idx > 0 && idx < 16) {
            String prefix = name.substring(0, idx);
            return prefix.matches("\\d{10,15}");
        }
        return false;
    }
}

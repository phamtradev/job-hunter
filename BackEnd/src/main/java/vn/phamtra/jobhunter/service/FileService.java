@Service
public class FileService {

    private final Cloudinary cloudinary;

    public FileService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadToCloudinary(MultipartFile file, String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IOException("File empty!");
        }

        String original = file.getOriginalFilename();

        // FIX: Không thêm timestamp nếu FE đã có timestamp
        String finalName;
        if (hasTimestampPrefix(original)) {
            finalName = original; // giữ nguyên
        } else {
            finalName = System.currentTimeMillis() + "-" + original;
        }

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "public_id", finalName));

        return uploadResult.get("secure_url").toString();
    }

    private boolean hasTimestampPrefix(String name) {
        if (name == null)
            return false;

        int idx = name.indexOf("-");
        if (idx > 0 && idx < 15) {
            String prefix = name.substring(0, idx);
            return prefix.matches("\\d{10,15}");
        }
        return false;
    }
}

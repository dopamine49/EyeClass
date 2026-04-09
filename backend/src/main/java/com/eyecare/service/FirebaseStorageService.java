package com.eyecare.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.StorageClient;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FirebaseStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
        "jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "avif"
    );

    private final FirebaseApp firebaseApp;
    private final String configuredBucket;

    public FirebaseStorageService(
        FirebaseApp firebaseApp,
        @Value("${firebase.storage-bucket:}") String configuredBucket
    ) {
        this.firebaseApp = firebaseApp;
        this.configuredBucket = configuredBucket;
    }

    public UploadedImage uploadProductImage(MultipartFile file) {
        validateImage(file);

        List<String> bucketCandidates = resolveBucketCandidates();
        String originalName = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String ext = getExtension(safeName);
        String contentType = resolveContentType(file, ext);

        String objectPath = String.format(
            "products/%d/%02d/%s%s",
            LocalDate.now().getYear(),
            LocalDate.now().getMonthValue(),
            UUID.randomUUID(),
            ext
        );

        String token = UUID.randomUUID().toString();

        Exception lastException = null;
        Map<String, String> bucketErrors = new LinkedHashMap<>();
        for (String bucketName : bucketCandidates) {
            try {
                Bucket bucket = StorageClient.getInstance(firebaseApp).bucket(bucketName);
                Blob blob = bucket.create(
                    objectPath,
                    file.getBytes(),
                    contentType
                );
                blob.toBuilder()
                    .setMetadata(java.util.Map.of("firebaseStorageDownloadTokens", token))
                    .build()
                    .update();

                String encodedPath = URLEncoder.encode(objectPath, StandardCharsets.UTF_8);
                String imageUrl = "https://firebasestorage.googleapis.com/v0/b/"
                    + bucketName
                    + "/o/"
                    + encodedPath
                    + "?alt=media&token="
                    + token;

                return new UploadedImage(imageUrl, objectPath, bucketName, file.getSize());
            } catch (Exception ex) {
                lastException = ex;
                bucketErrors.put(bucketName, ex.getClass().getSimpleName() + ": " + ex.getMessage());
            }
        }

        throw new IllegalStateException(
            "Failed to upload image to Firebase Storage. Tried buckets: "
                + String.join(", ", bucketCandidates)
                + ". Errors: "
                + bucketErrors
                + ". Please set FIREBASE_STORAGE_BUCKET explicitly if needed.",
            lastException
        );
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Image size must be <= 5MB");
        }

        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String ext = getExtension(originalName).replace(".", "").toLowerCase(Locale.ROOT);
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);

        boolean validByContentType = contentType.startsWith("image/");
        boolean validByExtension = ALLOWED_EXTENSIONS.contains(ext);
        if (!validByContentType && !validByExtension) {
            throw new IllegalArgumentException("Only image files are allowed (.jpg, .jpeg, .png, .webp, .gif, .bmp, .svg, .avif)");
        }
    }

    private List<String> resolveBucketCandidates() {
        LinkedHashSet<String> candidates = new LinkedHashSet<>();

        if (configuredBucket != null && !configuredBucket.isBlank()) {
            candidates.add(configuredBucket.trim());
        }

        String fromOptions = firebaseApp.getOptions().getStorageBucket();
        if (fromOptions != null && !fromOptions.isBlank()) {
            candidates.add(fromOptions.trim());
        }

        String projectId = firebaseApp.getOptions().getProjectId();
        if (projectId != null && !projectId.isBlank()) {
            candidates.add(projectId + ".firebasestorage.app");
            candidates.add(projectId + ".appspot.com");
        }

        if (candidates.isEmpty()) {
            throw new IllegalStateException(
                "Cannot resolve Firebase Storage bucket. Set firebase.storage-bucket in application config."
            );
        }
        return new ArrayList<>(candidates);
    }

    private String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot < 0) {
            return ".jpg";
        }
        return filename.substring(dot);
    }

    private String resolveContentType(MultipartFile file, String extensionWithDot) {
        String contentType = file.getContentType();
        if (contentType != null && contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            return contentType;
        }

        String ext = extensionWithDot.replace(".", "").toLowerCase(Locale.ROOT);
        return switch (ext) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "webp" -> "image/webp";
            case "gif" -> "image/gif";
            case "bmp" -> "image/bmp";
            case "svg" -> "image/svg+xml";
            case "avif" -> "image/avif";
            default -> "application/octet-stream";
        };
    }

    public record UploadedImage(
        String imageUrl,
        String path,
        String bucket,
        long size
    ) {
    }
}

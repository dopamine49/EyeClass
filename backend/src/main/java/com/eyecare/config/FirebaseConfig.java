package com.eyecare.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp(
        @Value("${firebase.config-path:classpath:firebase-config.json}") String configPath,
        @Value("${firebase.project-id:}") String projectId,
        @Value("${firebase.storage-bucket:}") String storageBucket,
        ResourceLoader resourceLoader
    ) throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        Resource resource = resourceLoader.getResource(configPath);
        if (!resource.exists()) {
            throw new IllegalStateException("Firebase config file not found at: " + configPath);
        }

        try (InputStream inputStream = resource.getInputStream()) {
            FirebaseOptions.Builder builder = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(inputStream));

            if (projectId != null && !projectId.isBlank()) {
                builder.setProjectId(projectId);
            }

            if (storageBucket != null && !storageBucket.isBlank()) {
                builder.setStorageBucket(storageBucket);
            }

            FirebaseOptions options = builder.build();
            return FirebaseApp.initializeApp(options);
        }
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        return FirestoreClient.getFirestore(firebaseApp);
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}

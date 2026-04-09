package com.eyecare.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Web configuration for the application
    // CORS is handled by CorsConfig.java
}

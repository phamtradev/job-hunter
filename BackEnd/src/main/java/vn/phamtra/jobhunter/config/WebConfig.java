package vn.phamtra.jobhunter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files stored under ./upload/ via /uploads/**
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./upload/");
    }
}



package vn.phamtra.jobhunter.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${phamtra.upload-file.base-uri}")
    private String baseUri;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // VD: https://domain.com/uploads/company/xxx.png
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(baseUri)
                .setCachePeriod(0);
    }
}


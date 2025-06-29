package vn.phamtra.jobhunter.util;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import vn.phamtra.jobhunter.domain.RestRespone;

@ControllerAdvice
public class FormatRestRespone implements ResponseBodyAdvice {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();

        RestRespone<Object> res = new RestRespone<Object>();
        res.setStatusCode(status);

        if (body instanceof String) {
            return body;
        }

        if (status >= 400) {
            //case error
            return body;
        } else {
            //case success
            res.setData(body);
            res.setMessage("CALL API SUCCESS");
        }

        return res;
    }
}

package vn.phamtra.jobhunter.service.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.phamtra.jobhunter.domain.RestRespone;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(value = IdInvalidException.class)
    public ResponseEntity<RestRespone<Object>> handleIdException(IdInvalidException idInvalidException) {
        RestRespone<Object> res = new RestRespone<Object>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError(idInvalidException.getMessage());
        res.setMessage("IdInvalidException");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}
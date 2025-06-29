package vn.phamtra.jobhunter.util.error;

import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Service
public class SecurityUtil {

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512; //thuật toán hash password (HS512)

    //lấy tham số môi trường
    @Value("${phamtra.jwt.base64-secret}")  //key secret
    private String jwtKey;

    @Value("${phamtra.jwt.token-validity-in-seconds}") //thời gian hết hạn
    private String jwtKeyExpiration;

    public void createToken(Authentication authentication) {

    }
}

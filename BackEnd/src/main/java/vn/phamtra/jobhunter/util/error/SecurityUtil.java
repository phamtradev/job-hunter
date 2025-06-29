package vn.phamtra.jobhunter.util.error;

import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class SecurityUtil {
    private final JwtEncoder jwtEncoder;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512; //thuật toán hash password (HS512)

    //lấy tham số môi trường
    @Value("${phamtra.jwt.base64-secret}")  //key secret
    private String jwtKey;

    @Value("${phamtra.jwt.token-validity-in-seconds}") //thời gian hết hạn
    private long jwtKeyExpiration;

    public String createToken(Authentication authentication) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.jwtKeyExpiration, ChronoUnit.SECONDS); //tính thời gian hết hạn


        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(authentication.getName())
                .claim("phamtra", authentication)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

    }
}

package com.ktpm.ktpm.configuration;

import com.ktpm.ktpm.dto.request.IntrospectRequest;
import com.ktpm.ktpm.dto.response.IntrospectResponse;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.service.AuthService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Component
public class CustomJWTDecoder implements JwtDecoder {
    @Value("${jwt.key}")
    private String SIGNER_KEY;

    @Autowired
    private AuthService authService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            IntrospectResponse response = authService.introspect(
                    IntrospectRequest.builder()
                            .token(token)
                            .build()
            );

            if (!response.isValid())
                throw new AppException(ErrorType.UNAUTHORIZED);
        } catch (ParseException | JOSEException e) {
            throw new JwtException(e.getMessage());
        }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");

            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}

package com.ktpm.ktpm.service;

import com.ktpm.ktpm.dto.request.AuthRequest;
import com.ktpm.ktpm.dto.request.IntrospectRequest;
import com.ktpm.ktpm.dto.request.LogoutRequest;
import com.ktpm.ktpm.dto.response.AuthResponse;
import com.ktpm.ktpm.dto.response.IntrospectResponse;
import com.ktpm.ktpm.entity.InvalidatedToken;
import com.ktpm.ktpm.entity.UserEntity;
import com.ktpm.ktpm.exception.AppException;
import com.ktpm.ktpm.exception.ErrorType;
import com.ktpm.ktpm.repository.InvalidatedTokenRepository;
import com.ktpm.ktpm.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import static java.rmi.server.LogStream.log;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Value("${jwt.key}")
    @NonFinal
    protected String SIGNER_KEY;

    @Value("${jwt.expiration-time}")
    @NonFinal
    protected long EXPIRATION_TIME;

    public AuthResponse authenticate(AuthRequest request) {
        UserEntity user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new AppException(ErrorType.UNAUTHORIZED));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new AppException(ErrorType.UNAUTHORIZED);

        String token = generateToken(user);

        AuthResponse respond = AuthResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
        return respond;
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        String token = request.getToken();

        boolean verified = true;
        try{
            verifyToken(token);
        } catch(AppException e) {
            verified = false;
        }

        return IntrospectResponse.builder()
                .valid(verified)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            String token = request.getToken();

            SignedJWT signedJWT = verifyToken(token);
            JWTClaimsSet jwtClaimsSet = signedJWT.getJWTClaimsSet();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jwtClaimsSet.getJWTID())
                    .expiryTime(jwtClaimsSet.getExpirationTime())
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (Exception e) {
            log(e.getMessage());
        }
    }

    private String generateToken(UserEntity user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claimSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .claim("scope", buildScope(user))
                .jwtID(UUID.randomUUID().toString())
                .issuer("domainname")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(EXPIRATION_TIME, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .build();
        Payload payload = new Payload(claimSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            AuthService.log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(UserEntity user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        user.getRoles().forEach(role -> {
            stringJoiner.add("ROLE_" + role.getRoleName());
        });

        return stringJoiner.toString();
    }

    private SignedJWT verifyToken(String token) throws ParseException, JOSEException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY);
        SignedJWT signedJWT = SignedJWT.parse(token);

        boolean verified = signedJWT.verify(verifier);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        if (!(verified && expirationTime.after(new Date())))
            throw new AppException(ErrorType.UNAUTHORIZED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorType.UNAUTHORIZED);

        return signedJWT;
    }
}

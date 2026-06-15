package com.onecpharma.service;

import com.onecpharma.dto.request.LoginRequest;
import com.onecpharma.dto.request.RegisterRequest;
import com.onecpharma.dto.request.ForgotPasswordRequest;
import com.onecpharma.dto.request.VerifyOtpRequest;
import com.onecpharma.dto.request.ResetPasswordRequest;
import com.onecpharma.dto.response.AuthResponse;
import com.onecpharma.exception.BadRequestException;
import com.onecpharma.model.User;
import com.onecpharma.model.Role;
import com.onecpharma.model.Cart;
import com.onecpharma.repository.UserRepository;
import com.onecpharma.repository.CartRepository;
import com.onecpharma.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    // Ephemeral in-memory OTP store
    private static final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .isPhysicallyChallenged(request.getIsPhysicallyChallenged() != null ? request.getIsPhysicallyChallenged() : false)
                .udidNumber(request.getUdidNumber())
                .udidApprovalStatus(request.getIsPhysicallyChallenged() != null && request.getIsPhysicallyChallenged() ? com.onecpharma.model.UdidVerificationStatus.PENDING : com.onecpharma.model.UdidVerificationStatus.PENDING)
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        // Create empty cart for user
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .isElderly(user.getIsElderly())
                .isPhysicallyChallenged(user.getIsPhysicallyChallenged())
                .udidVerified(user.getUdidVerified())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .isElderly(user.getIsElderly())
                .isPhysicallyChallenged(user.getIsPhysicallyChallenged())
                .udidVerified(user.getUdidVerified())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User not found with email: " + request.getEmail());
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        otpStore.put(request.getEmail(), otp);

        System.out.println("=================================================");
        System.out.println("🔑 PASSWORD RESET OTP FOR: " + request.getEmail());
        System.out.println("👉 OTP CODE: " + otp);
        System.out.println("=================================================");

        return "OTP sent successfully to " + request.getEmail();
    }

    public String verifyOtp(VerifyOtpRequest request) {
        String storedOtp = otpStore.get(request.getEmail());
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }
        return "OTP verified successfully";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        String storedOtp = otpStore.get(request.getEmail());
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Remove used OTP
        otpStore.remove(request.getEmail());

        return "Password reset successfully";
    }
}

package com.onecpharma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class OnecPharmaApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnecPharmaApplication.class, args);
    }
}

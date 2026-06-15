package com.onecpharma.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping(value = {
        "/",
        "/login",
        "/register",
        "/forgot-password",
        "/cart",
        "/checkout",
        "/admin/**",
        "/profile",
        "/products/**",
        "/categories/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}

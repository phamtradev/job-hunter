package vn.phamtra.jobhunter.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.phamtra.jobhunter.service.UserService;

@RestController
public class HelloController {
    private final UserService userService;

    public HelloController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String getHelloWorld() {

        return "update";
    }
}

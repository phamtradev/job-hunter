package vn.phamtra.jobhunter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.phamtra.jobhunter.domain.User;
import vn.phamtra.jobhunter.service.UserService;
import vn.phamtra.jobhunter.service.error.IdInvalidException;

import java.util.List;


@RestController
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> fetchUserById(@PathVariable("id") long id) {
        User phamtraUser = this.userService.fetchUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(phamtraUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUser() {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.fetchAllUser());
    }

   @PostMapping("/users")
    public ResponseEntity<User> createNewUser(@RequestBody User postManUser) {
        String hashPassword = this.passwordEncoder.encode(postManUser.getPassword()); //mã hóa password
        postManUser.setPassword(hashPassword);
        User phamtraUser = this.userService.handleCreateUser(postManUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(phamtraUser);
    }

    @PutMapping("/users")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        User phamtraUser = this.userService.handleUpdateUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(phamtraUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) throws IdInvalidException {
        if (id >= 1500) {
            throw new IdInvalidException("Id không lớn hơn 1500");
        }
        this.userService.handleDeleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body("user");
    }
}

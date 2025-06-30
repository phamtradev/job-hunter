package vn.phamtra.jobhunter.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.phamtra.jobhunter.domain.User;
import vn.phamtra.jobhunter.domain.dto.Meta;
import vn.phamtra.jobhunter.domain.dto.ResultPaginationDTO;
import vn.phamtra.jobhunter.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
    }

    public void handleDeleteUser(long id) {
        this.userRepository.deleteById(id);
    }

    public User fetchUserById(long id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userOptional.get();
        }
        return null;
    }

    public ResultPaginationDTO fetchAllUser(Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(pageable);//convert sang kiểu dữ liệu List và truyền pageable vào để phân trang

        //khai báo ResultPaginationDTO và Meta để tiến hành set hiển thị các trang
        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        //set các hiển thị
        mt.setPage(pageUser.getNumber()); //số trang
        mt.setPageSize(pageUser.getSize()); //số phần tử

        mt.setPages(pageUser.getTotalPages()); //tổng số trang
        mt.setTotal(pageUser.getTotalElements()); //tổng số phần tử

        rs.setMeta(mt);
        rs.setResult(pageUser.getContent());

        return rs; //dạng convert dạng List thì return kiểu này
    }

    public User handleUpdateUser(User reqUser) {
        User currentUser = this.fetchUserById(reqUser.getId());
        if (currentUser != null) {
            currentUser.setEmail(reqUser.getEmail());
            currentUser.setName(reqUser.getName());
            currentUser.setPassword(reqUser.getPassword());

            //update
            currentUser = this.userRepository.save(currentUser);
        }
        return currentUser;
    }

    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }
}

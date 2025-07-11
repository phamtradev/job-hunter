package vn.phamtra.jobhunter.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;
import vn.phamtra.jobhunter.domain.Permission;
import vn.phamtra.jobhunter.domain.Role;
import vn.phamtra.jobhunter.domain.User;
import vn.phamtra.jobhunter.service.UserService;
import vn.phamtra.jobhunter.util.error.IdInvalidException;
import vn.phamtra.jobhunter.util.error.PermissionException;
import vn.phamtra.jobhunter.util.error.SecurityUtil;

import java.util.List;

public class PermissionInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Lấy thông tin API và phương thức HTTP
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();

        System.out.println(">>> RUN preHandle");
        System.out.println(">>> path= " + path);
        System.out.println(">>> httpMethod= " + httpMethod);
        System.out.println(">>> requestURI= " + requestURI);

        // Lấy email của người dùng hiện tại từ SecurityUtil
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        if (email == null || email.isEmpty()) {
            throw new IdInvalidException("Người dùng chưa đăng nhập hoặc email không hợp lệ.");
        }

        // Lấy thông tin người dùng từ UserService
        User user = this.userService.handleGetUserByUsername(email);
        if (user == null) {
            throw new PermissionException("Không tìm thấy thông tin người dùng.");
        }

        // Kiểm tra quyền của người dùng
        Role role = user.getRole();
        if (role == null || role.getPermissions() == null || role.getPermissions().isEmpty()) {
            throw new PermissionException("Người dùng không có quyền truy cập trang này.");
        }

        // Kiểm tra xem người dùng có quyền truy cập API hiện tại hay không
        boolean isAllowed = role.getPermissions().stream().anyMatch(permission ->
                path.equals(permission.getApiPath()) && httpMethod.equalsIgnoreCase(permission.getMethod())
        );

        if (!isAllowed) {
            throw new PermissionException("Bạn không có quyền truy cập trang này.");
        }

        return true;
    }
}

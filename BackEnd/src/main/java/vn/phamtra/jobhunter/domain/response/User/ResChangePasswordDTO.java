package vn.phamtra.jobhunter.domain.response.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResChangePasswordDTO {
    private String message;

    public ResChangePasswordDTO() {
        this.message = "Đổi mật khẩu thành công";
    }

    public ResChangePasswordDTO(String message) {
        this.message = message;
    }
}


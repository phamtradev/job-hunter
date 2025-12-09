package vn.phamtra.jobhunter.domain.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class ReqChangePasswordDTO {

    @NotBlank(message = "Mật khẩu cũ không được để trống")
    @JsonProperty("oldPassword")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @JsonProperty("newPassword")
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}


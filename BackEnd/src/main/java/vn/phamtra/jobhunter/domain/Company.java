package vn.phamtra.jobhunter.domain;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.phamtra.jobhunter.util.error.SecurityUtil;
import vn.phamtra.jobhunter.util.FileUtil;

import java.time.Instant;
import java.util.List;

@Table(name = "companies")
@Entity
@Getter
@Setter
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "name không được để trống")
    private String name;

    @Column(columnDefinition = "MEDIUMTEXT") //lưu trữ lớn hơn 200 kí tự
    private String description;

    private String address;

    @JsonIgnore // Hide raw logo field, use normalized getter instead
    private String logo;

    //@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;

    private Instant updatedAt;

    private String createdBy;

    private String updatedBy;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    //trì hoãn tải dữ liệu (lazy loading), dữ liệu sẽ không được lấy ra ngay lập tức khi truy vấn company
    @JsonIgnore //fix loi lap vo han
    List<User> users;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Job> jobs;


    @PrePersist
    public void handleBeforeCreate() {
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        this.updatedAt = Instant.now();
    }

    /**
     * Normalize logo URL to return only filename when serializing to JSON
     * This prevents duplicate folder paths when frontend builds the full URL
     */
    @JsonGetter("logo")
    public String getNormalizedLogo() {
        return FileUtil.extractFilename(this.logo);
    }

}

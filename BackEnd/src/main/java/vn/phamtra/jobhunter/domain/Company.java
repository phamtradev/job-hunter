package vn.phamtra.jobhunter.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Table(name = "companies")
@Getter
@Setter
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(columnDefinition = "MEDIUMTEXT") //lưu trữ lớn hơn 200 kí tự
    private String description;

    private String address;

    private String logo;

    private Instant createdAt;

    private Instant updatedAt;

    private String createdBy;

    private String updatedBy;


}

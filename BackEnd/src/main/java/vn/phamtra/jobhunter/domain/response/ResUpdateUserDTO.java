package vn.phamtra.jobhunter.domain.response;

import lombok.Getter;
import lombok.Setter;
import vn.phamtra.jobhunter.util.constant.GenderEnum;

import java.time.Instant;

@Getter
@Setter
public class ResUpdateUserDTO {
    private long id;
    private String name;
    private GenderEnum gender;
    private String address;
    private int age;
    private Instant updateAt;
}

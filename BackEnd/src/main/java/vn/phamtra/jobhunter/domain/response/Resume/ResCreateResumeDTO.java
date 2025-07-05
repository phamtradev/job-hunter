package vn.phamtra.jobhunter.domain.response.Resume;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResCreateResumeDTO {

    private long id;
    private Instant createdAt;
    private String createdBy;

}

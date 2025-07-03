package vn.phamtra.jobhunter.domain.response.Job;

import lombok.Getter;
import lombok.Setter;
import vn.phamtra.jobhunter.util.constant.LevelEnum;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ResUpdateJobDTO {
    private long id;
    private String name;
    private String location;
    private double salary;
    private int quantity;
    private LevelEnum level;
    private Instant startDate;
    private Instant endDate;

    private boolean isActive;

    private List<String> skills;

    private Instant createdAt;
    private String createdBy;
}

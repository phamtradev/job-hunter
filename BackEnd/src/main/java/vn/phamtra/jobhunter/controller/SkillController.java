package vn.phamtra.jobhunter.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.phamtra.jobhunter.domain.Skill;
import vn.phamtra.jobhunter.domain.response.ResultPaginationDTO;
import vn.phamtra.jobhunter.service.SkillService;
import vn.phamtra.jobhunter.util.annotation.ApiMessage;
import vn.phamtra.jobhunter.util.error.IdInvalidException;

@Controller
@RequestMapping("/api/v1")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping("/skills")
    @ApiMessage("create a skill")
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody Skill postManSkill) throws IdInvalidException {
        boolean isSkillExist = this.skillService.isSkillExist(postManSkill.getName());
        if (isSkillExist) {
            throw new IdInvalidException(
                    "Skill " + postManSkill.getName() + " đã tồn tại, vui lòng tạo skill khác");
        }
        Skill phamtraSkill = this.skillService.handleCreateSkill(postManSkill);
        return ResponseEntity.status(HttpStatus.CREATED).body(phamtraSkill);
    }

    @PutMapping("/skills")
    @ApiMessage("update a skill")
    public ResponseEntity<Skill> updateSkill(@RequestBody Skill skill) throws IdInvalidException {
        Skill phamtraSkill = this.skillService.handleUpdateSkill(skill);
        if (phamtraSkill == null) {
            throw new IdInvalidException("Skill với id: " + skill.getId() + " không tồn tại");
        }
        return ResponseEntity.status(HttpStatus.OK).body(phamtraSkill);
    }

    @GetMapping("/skills")
    @ApiMessage("fetch all skills")
    public ResponseEntity<ResultPaginationDTO> getAllSkill(
            @Filter Specification<Skill> spec, Pageable pageable) {

        return ResponseEntity.status(HttpStatus.OK).body(this.skillService.fetchAllSkill(spec, pageable));
    }

    @DeleteMapping("/skills/{id}")
    @ApiMessage("Delete a skill")
    public ResponseEntity<Void> deleteSkill(@PathVariable("id") long id) throws IdInvalidException {
        //check id
        Skill currenSkill = this.skillService.fetchSkillById(id);
        if (currenSkill == null) {
            throw new IdInvalidException("Skill với id: " + id + " không tồn tại");
        }
        this.skillService.deleteSkill(id);
        return ResponseEntity.ok().body(null);
    }
}

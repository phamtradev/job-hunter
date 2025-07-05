package vn.phamtra.jobhunter.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.phamtra.jobhunter.domain.Resume;
import vn.phamtra.jobhunter.domain.response.Resume.ResCreateResumeDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResFetchResumeDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResUpdateResumeDTO;
import vn.phamtra.jobhunter.service.ResumeService;
import vn.phamtra.jobhunter.util.annotation.ApiMessage;
import vn.phamtra.jobhunter.util.error.IdInvalidException;

import java.util.Optional;

@Controller
@RequestMapping("/api/v1")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/resumes")
    @ApiMessage("create a resume")
    public ResponseEntity<ResCreateResumeDTO> createResume(@Valid @RequestBody Resume resume) throws IdInvalidException {
        boolean isResumeExist = this.resumeService.checkResumeExistByUserAndJob(resume);
        if (!isResumeExist) {
            throw new IdInvalidException(
                    "User id/Job id khong ton tai");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.resumeService.handleCreateResume(resume));
    }

    @GetMapping("/resumes/{id}")
    @ApiMessage("fetch a resume by id")
    public ResponseEntity<ResFetchResumeDTO> fetchById(@PathVariable("id") long id) throws IdInvalidException {
        Optional<Resume> reqResumeOptional = this.resumeService.fetchResumeById(id);
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume voi id: " + id + " khong ton tai");
        }
        return ResponseEntity.status(HttpStatus.OK).body(this.resumeService.getResume(reqResumeOptional.get()));
    }

    @DeleteMapping("/resumes/{id}")
    @ApiMessage("Delete a resume")
    public ResponseEntity<Void> deleteResume(@PathVariable("id") long id) throws IdInvalidException {
        //check id
        Optional<Resume> reqResumeOptional = this.resumeService.fetchResumeById(id);
        if (reqResumeOptional == null) {
            throw new IdInvalidException("Resume với id: " + id + " không tồn tại");
        }
        this.resumeService.deleteResume(id);
        return ResponseEntity.ok().body(null);
    }

    @PutMapping("/resumes")
    @ApiMessage("update a resume")
    public ResponseEntity<ResUpdateResumeDTO> updateResume(@RequestBody Resume resume) throws IdInvalidException {
        Optional<Resume> reqResumeOptional = this.resumeService.fetchResumeById(resume.getId());
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume với id: " + resume.getId() + " không tồn tại");
        }

        Resume reqResume = reqResumeOptional.get();
        reqResume.setStatus(resume.getStatus());
        return ResponseEntity.ok().body(this.resumeService.updateResume(reqResume));
    }
}

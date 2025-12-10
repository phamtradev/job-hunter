package vn.phamtra.jobhunter.controller;

import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.phamtra.jobhunter.domain.Company;
import vn.phamtra.jobhunter.domain.Job;
import vn.phamtra.jobhunter.domain.Resume;
import vn.phamtra.jobhunter.domain.User;
import vn.phamtra.jobhunter.domain.response.ResultPaginationDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResCreateResumeDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResFetchResumeDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResUpdateResumeDTO;
import vn.phamtra.jobhunter.service.ResumeService;
import vn.phamtra.jobhunter.service.UserService;
import vn.phamtra.jobhunter.util.annotation.ApiMessage;
import vn.phamtra.jobhunter.util.error.IdInvalidException;
import vn.phamtra.jobhunter.util.error.SecurityUtil;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/v1")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserService userService;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final FilterBuilder filterBuilder;

    public ResumeController(ResumeService resumeService, UserService userService, FilterSpecificationConverter filterSpecificationConverter, FilterBuilder filterBuilder) {
        this.resumeService = resumeService;
        this.userService = userService;
        this.filterSpecificationConverter = filterSpecificationConverter;
        this.filterBuilder = filterBuilder;
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

    @PostMapping("resumes/by-user")
    @ApiMessage("Get list resumes by user")
    public ResponseEntity<ResultPaginationDTO> fetchResumeByUser(Pageable pageable) {
        return ResponseEntity.ok().body(this.resumeService.fetchResumeByUser(pageable));
    }

    @GetMapping("/resumes")
    @ApiMessage("Fetch all resumes with paginate")
    public ResponseEntity<ResultPaginationDTO> fetchAll(@Filter Specification<Resume> spec, Pageable pageable) {
        List<Long> arrJobIds = null;
        Optional<String> currentUserLoginOpt = SecurityUtil.getCurrentUserLogin();
        if (currentUserLoginOpt.isPresent()) {
            String email = currentUserLoginOpt.get();
            User currentUser = this.userService.handleGetUserByUsername(email);
            if (currentUser != null) {
                Company userCompany = currentUser.getCompany();
                if (userCompany != null) {
                    List<Job> companyJobs = userCompany.getJobs();
                    if (companyJobs != null && !companyJobs.isEmpty()) {
                        arrJobIds = companyJobs.stream().map(Job::getId).collect(Collectors.toList());
                        System.out.println(">>> ResumeController - User has company with " + arrJobIds.size() + " jobs: " + arrJobIds);
                    } else {
                        System.out.println(">>> ResumeController - User has company but no jobs");
                    }
                } else {
                    System.out.println(">>> ResumeController - User has no company");
                }
            } else {
                System.out.println(">>> ResumeController - User not found for email: " + email);
            }
        } else {
            System.out.println(">>> ResumeController - No current user login");
        }

        // Start with base spec (from @Filter annotation, can be null)
        Specification<Resume> finalSpec = spec != null ? spec : (root, query, cb) -> cb.conjunction(); // Empty spec = always true
        
        // Only filter by job IDs if user has a company with jobs
        // If user has company with jobs, only show resumes for those jobs
        // If user doesn't have company or company has no jobs, show all resumes
        if (arrJobIds != null && !arrJobIds.isEmpty()) {
            try {
                Specification<Resume> jobInSpec = filterSpecificationConverter.convert(
                    filterBuilder.field("job").in(filterBuilder.input(arrJobIds)).get()
                );
                finalSpec = finalSpec.and(jobInSpec);
                System.out.println(">>> ResumeController - Applied job filter with " + arrJobIds.size() + " job IDs");
            } catch (Exception e) {
                System.err.println(">>> ResumeController - Error creating job filter: " + e.getMessage());
                e.printStackTrace();
                // If filter creation fails, continue with base spec (no job filtering)
            }
        } else {
            System.out.println(">>> ResumeController - No job filter applied (showing all resumes)");
        }

        ResultPaginationDTO result = this.resumeService.fetchAllResume(finalSpec, pageable);
        int resultSize = 0;
        if (result.getResult() != null && result.getResult() instanceof List) {
            resultSize = ((List<?>) result.getResult()).size();
        }
        System.out.println(">>> ResumeController - Returning " + resultSize + " resumes");
        return ResponseEntity.ok().body(result);
    }


}

package vn.phamtra.jobhunter.service;

import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.phamtra.jobhunter.domain.Job;
import vn.phamtra.jobhunter.domain.Resume;
import vn.phamtra.jobhunter.domain.User;
import vn.phamtra.jobhunter.domain.response.ResultPaginationDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResCreateResumeDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResFetchResumeDTO;
import vn.phamtra.jobhunter.domain.response.Resume.ResUpdateResumeDTO;
import vn.phamtra.jobhunter.repository.JobRepository;
import vn.phamtra.jobhunter.repository.ResumeRepository;
import vn.phamtra.jobhunter.repository.UserRepository;
import vn.phamtra.jobhunter.util.FileUtil;
import vn.phamtra.jobhunter.util.error.SecurityUtil;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository, JobRepository jobRepository, FilterParser filterParser, FilterSpecificationConverter filterSpecificationConverter) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.filterParser = filterParser;
        this.filterSpecificationConverter = filterSpecificationConverter;
    }

    public boolean checkResumeExistByUserAndJob(Resume resume) {
        //check user by id
        if (resume.getUser() == null)
            return false;
        Optional<User> userOptional = this.userRepository.findById(resume.getUser().getId());
        if (userOptional.isEmpty())
            return false;


        //check job by id
        if (resume.getJob() == null)
            return false;
        Optional<Job> jobOptional = this.jobRepository.findById(resume.getJob().getId());
        if (jobOptional.isEmpty())
            return false;

        return true;

    }

    public ResCreateResumeDTO handleCreateResume(Resume resume) {
        // Normalize URL filename (remove folder prefix if present)
        if (resume.getUrl() != null && !resume.getUrl().isEmpty()) {
            String normalizedUrl = FileUtil.normalizeFileName(resume.getUrl());
            resume.setUrl(normalizedUrl);
        }
        
        resume.handleBeforeCreate();

        resume = this.resumeRepository.save(resume);

        ResCreateResumeDTO res = new ResCreateResumeDTO();
        res.setId(resume.getId());
        res.setCreatedBy(resume.getCreatedBy());
        res.setCreatedAt(resume.getCreatedAt());

        return res;
    }

    public void deleteResume(long id) {
        this.resumeRepository.deleteById(id);
    }

    public Optional<Resume> fetchResumeById(long id) {
        return this.resumeRepository.findById(id);
    }

    public ResultPaginationDTO fetchAllResume(Specification<Resume> spec, Pageable pageable) {
        Page<Resume> pageResume = this.resumeRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageResume.getTotalPages());
        mt.setTotal(pageResume.getTotalElements());

        rs.setMeta(mt);

        List<ResFetchResumeDTO> listResume = pageResume.getContent().stream().map(item -> this.getResume(item)).collect(Collectors.toList());
        rs.setResult(listResume);
        return rs;
    }

    public ResFetchResumeDTO getResume(Resume resume) {

        ResFetchResumeDTO res = new ResFetchResumeDTO();

        res.setId(resume.getId());
        res.setEmail(resume.getEmail());
        res.setUrl(resume.getUrl());
        res.setStatus(resume.getStatus());
        res.setCreatedAt(resume.getCreatedAt());
        res.setCreatedBy(resume.getCreatedBy());
        res.setUpdatedAt(resume.getUpdatedAt());
        res.setUpdateBy(resume.getUpdatedBy());

        if (resume.getJob() != null) { //neu cv co cong viec thuoc job
            res.setCompanyName(resume.getJob().getCompany().getName()); //lay ten cong ty
        }

        res.setUser(new ResFetchResumeDTO.UserResume(resume.getUser().getId(), resume.getUser().getName()));
        res.setJob(new ResFetchResumeDTO.JobResume(resume.getJob().getId(), resume.getJob().getName()));

        return res;
    }

    public ResUpdateResumeDTO updateResume(Resume resume) {

        resume.handleBeforeUpdate();

        resume = this.resumeRepository.save(resume);
        ResUpdateResumeDTO res = new ResUpdateResumeDTO();
        res.setUpdatedAt(resume.getUpdatedAt());
        res.setUpdatedBy(resume.getUpdatedBy());

        return res;
    }

    public ResultPaginationDTO fetchResumeByUser(Pageable pageable) {
        Optional<String> currentUserLogin = SecurityUtil.getCurrentUserLogin();
        if (!currentUserLogin.isPresent()) {
            throw new IllegalArgumentException("User login not found");
        }

        String email = currentUserLogin.get();
        FilterNode node = filterParser.parse("email = '" + email + "'"); // Đảm bảo email được bao quanh bởi dấu nháy đơn
        FilterSpecification<Resume> spec = filterSpecificationConverter.convert(node);
        Page<Resume> pageResume = this.resumeRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageResume.getTotalPages());
        mt.setTotal(pageResume.getTotalElements());
        rs.setMeta(mt);

        List<ResFetchResumeDTO> listResume = pageResume.getContent().stream()
                .map(item -> this.getResume(item))
                .collect(Collectors.toList());
        rs.setResult(listResume);
        return rs;
    }

    public ResultPaginationDTO fetchAllResumes(Specification<Resume> spec, Pageable pageable) {
        Page<Resume> pageResumes = this.resumeRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageResumes.getTotalPages());
        mt.setTotal(pageResumes.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageResumes.getContent());
        return rs;
    }

}

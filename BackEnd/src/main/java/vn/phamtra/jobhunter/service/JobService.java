package vn.phamtra.jobhunter.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.phamtra.jobhunter.domain.Company;
import vn.phamtra.jobhunter.domain.Job;
import vn.phamtra.jobhunter.domain.Skill;
import vn.phamtra.jobhunter.domain.response.Job.ResCreateJobDTO;
import vn.phamtra.jobhunter.domain.response.Job.ResUpdateJobDTO;
import vn.phamtra.jobhunter.domain.response.ResultPaginationDTO;
import vn.phamtra.jobhunter.repository.CompanyRepository;
import vn.phamtra.jobhunter.repository.JobRepository;
import vn.phamtra.jobhunter.repository.SkillRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public JobService(SkillRepository skillRepository, JobRepository jobRepository, CompanyRepository companyRepository) {
        this.skillRepository = skillRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    public Optional<Job> fetchJobById(long id) {
        return this.jobRepository.findById(id);
    }

    public void deleteJob(long id) {
        //delete jobs (inside job_skill table)
        Optional<Job> jobOptional = this.jobRepository.findById(id);
        Job currentJob = jobOptional.get();
        currentJob.getSkills().forEach(job -> job.getJobs().remove(currentJob));

        //delete skill
        this.jobRepository.delete(currentJob);
    }

    public ResCreateJobDTO createJob(Job j) {
        //check skills
        if (j.getSkills() != null) {
            List<Long> reqSkills = j.getSkills().stream().map(x -> x.getId()).collect(Collectors.toList());

            List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
            j.setSkills(dbSkills);
        }

        //check company
        if (j.getCompany() != null) {
            Optional<Company> companyOptional = this.companyRepository.findById(j.getCompany().getId());
            if (companyOptional.isPresent()) {
                j.setCompany(companyOptional.get());
            }
        }

        //create job
        Job currentJob = this.jobRepository.save(j);

        //convert respone
        ResCreateJobDTO dto = new ResCreateJobDTO();
        dto.setId(currentJob.getId());
        dto.setName(currentJob.getName());
        dto.setSalary(currentJob.getSalary());
        dto.setQuantity(currentJob.getQuantity());
        dto.setLocation(currentJob.getLocation());
        dto.setLevel(currentJob.getLevel());
        dto.setStartDate(currentJob.getStartDate());
        dto.setEndDate(currentJob.getEndDate());
        dto.setActive(currentJob.isActive());
        dto.setCreatedAt(currentJob.getCreatedAt());
        dto.setCreatedBy(currentJob.getCreatedBy());

        if (currentJob.getSkills() != null) {
            List<String> skills = currentJob.getSkills().stream().map(item -> item.getName()).collect(Collectors.toList());
            dto.setSkills(skills);
        }
        return dto;
    }

    public ResUpdateJobDTO updateJob(Job j, Job jobInDB) {

        //check skill
        if (j.getSkills() != null) {
            List<Long> reqSkills = j.getSkills().stream().map(x -> x.getId()).collect(Collectors.toList());

            List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
            jobInDB.setSkills(dbSkills);
        }

        //check company
        if (j.getCompany() != null) {
            Optional<Company> companyOptional = this.companyRepository.findById(j.getCompany().getId());
            if (companyOptional.isPresent()) {
                jobInDB.setCompany(companyOptional.get());
            }
        }

        //update correct info
        jobInDB.setName(j.getName());
        jobInDB.setSalary(j.getSalary());
        jobInDB.setQuantity(j.getQuantity());
        jobInDB.setLocation(j.getLocation());
        jobInDB.setLevel(j.getLevel());
        jobInDB.setStartDate(j.getStartDate());
        jobInDB.setEndDate(j.getEndDate());
        jobInDB.setActive(j.isActive());

        //update job
        Job currentJob = this.jobRepository.save(jobInDB);

        ResUpdateJobDTO dto = new ResUpdateJobDTO();
        dto.setId(currentJob.getId());
        dto.setName(currentJob.getName());
        dto.setSalary(currentJob.getSalary());
        dto.setQuantity(currentJob.getQuantity());
        dto.setLocation(currentJob.getLocation());
        dto.setLevel(currentJob.getLevel());
        dto.setStartDate(currentJob.getStartDate());
        dto.setEndDate(currentJob.getEndDate());
        dto.setActive(currentJob.isActive());
        dto.setCreatedAt(currentJob.getCreatedAt());
        dto.setCreatedBy(currentJob.getCreatedBy());
        return dto;
    }

    public ResultPaginationDTO fetchAllJob(Specification<Job> spec, Pageable pageable) {

        Page<Job> pageJob = this.jobRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        //set các hiển thị
        mt.setPage(pageable.getPageNumber() + 1); //số trang
        mt.setPageSize(pageable.getPageSize()); //số phần tử

        mt.setPages(pageJob.getTotalPages()); //tổng số trang
        mt.setTotal(pageJob.getTotalElements()); //tổng số phần tử

        rs.setMeta(mt);
        rs.setResult(pageJob.getContent());

        return rs;
    }


}


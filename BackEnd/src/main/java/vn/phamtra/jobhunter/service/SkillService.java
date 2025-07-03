package vn.phamtra.jobhunter.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.phamtra.jobhunter.domain.Company;
import vn.phamtra.jobhunter.domain.Skill;
import vn.phamtra.jobhunter.domain.response.ResultPaginationDTO;
import vn.phamtra.jobhunter.repository.SkillRepository;

import java.util.Optional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public Skill handleCreateSkill(Skill skill) {
        return this.skillRepository.save(skill);
    }

    public Skill fetchSkillById(long id) {
        Optional<Skill> skillOptional = this.skillRepository.findById(id);
        if (skillOptional.isPresent()) {
            return skillOptional.get();
        }
        return null;
    }

    public Skill handleUpdateSkill(Skill skill) {
        Skill currentSkill = this.fetchSkillById(skill.getId());

        if (currentSkill != null) {
            currentSkill.setName(skill.getName());
            //update
            currentSkill = this.skillRepository.save(currentSkill);
        }

        return currentSkill;
    }

    public ResultPaginationDTO fetchAllSkill(Specification<Skill> spec, Pageable pageable) {

        Page<Skill> pageSkill = this.skillRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        //set các hiển thị
        mt.setPage(pageable.getPageNumber() + 1); //số trang
        mt.setPageSize(pageable.getPageSize()); //số phần tử

        mt.setPages(pageSkill.getTotalPages()); //tổng số trang
        mt.setTotal(pageSkill.getTotalElements()); //tổng số phần tử

        rs.setMeta(mt);
        rs.setResult(pageSkill.getContent());

        return rs;
    }

    public void deleteSkill(long id) {
        //delete jobs (inside job_skill table)
        Optional<Skill> skillOptional = this.skillRepository.findById(id);
        Skill currentSkill = skillOptional.get();
        currentSkill.getJobs().forEach(job -> job.getSkills().remove(currentSkill));

        //delete skill
        this.skillRepository.delete(currentSkill);
    }

    public boolean isSkillExist(String name) {
        return this.skillRepository.existsByName(name);
    }
}

package vn.phamtra.jobhunter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.phamtra.jobhunter.domain.Job;
import vn.phamtra.jobhunter.domain.Resume;
import vn.phamtra.jobhunter.domain.Skill;
import vn.phamtra.jobhunter.domain.User;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long>, JpaSpecificationExecutor<Resume> {
}

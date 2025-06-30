package vn.phamtra.jobhunter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.phamtra.jobhunter.domain.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

}

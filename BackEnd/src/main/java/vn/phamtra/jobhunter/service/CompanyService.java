package vn.phamtra.jobhunter.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.phamtra.jobhunter.domain.Company;
import vn.phamtra.jobhunter.domain.User;
import vn.phamtra.jobhunter.domain.response.ResultPaginationDTO;
import vn.phamtra.jobhunter.repository.CompanyRepository;
import vn.phamtra.jobhunter.repository.UserRepository;
import vn.phamtra.jobhunter.util.FileUtil;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public Company fetchCompanyById(long id) {
        Optional<Company> companyOptional = this.companyRepository.findById(id);
        if (companyOptional.isPresent()) {
            return companyOptional.get();
        }
        return null;
    }


    public Company handleCreateCompany(Company company) {
        // Normalize logo filename (remove folder prefix if present)
        if (company.getLogo() != null && !company.getLogo().isEmpty()) {
            String normalizedLogo = FileUtil.normalizeFileName(company.getLogo());
            company.setLogo(normalizedLogo);
        }
        return this.companyRepository.save(company);
    }

    public ResultPaginationDTO fetchAllCompany(Specification<Company> spec, Pageable pageable) {

        Page<Company> pageCompany = this.companyRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        //set các hiển thị
        mt.setPage(pageable.getPageNumber() + 1); //số trang
        mt.setPageSize(pageable.getPageSize()); //số phần tử

        mt.setPages(pageCompany.getTotalPages()); //tổng số trang
        mt.setTotal(pageCompany.getTotalElements()); //tổng số phần tử

        rs.setMeta(mt);
        rs.setResult(pageCompany.getContent());

        return rs;
    }

    public Company handleUpdateCompany(Company reqCompany) {
        Company currentCompany = this.fetchCompanyById(reqCompany.getId());

        if (currentCompany != null) {
            currentCompany.setName(reqCompany.getName());
            currentCompany.setDescription(reqCompany.getDescription());
            currentCompany.setAddress(reqCompany.getAddress());
            
            // Normalize logo filename (remove folder prefix if present)
            if (reqCompany.getLogo() != null && !reqCompany.getLogo().isEmpty()) {
                String normalizedLogo = FileUtil.normalizeFileName(reqCompany.getLogo());
                currentCompany.setLogo(normalizedLogo);
            } else {
                currentCompany.setLogo(reqCompany.getLogo());
            }

            //updayte
            currentCompany = this.companyRepository.save(currentCompany);
        }

        return currentCompany;
    }

    public void handleDeleteCompany(long id) {
        Optional<Company> companyOptional = this.companyRepository.findById(id);
        if (companyOptional.isPresent()) {
            Company com = companyOptional.get();
            List<User> users = this.userRepository.findByCompany(com);
            this.userRepository.deleteAll(users);
        }
        this.companyRepository.deleteById(id);
    }

    public Optional<Company> findById(long id) {
        return this.companyRepository.findById(id);
    }

}

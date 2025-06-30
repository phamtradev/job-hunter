package vn.phamtra.jobhunter.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.phamtra.jobhunter.domain.Company;
import vn.phamtra.jobhunter.domain.User;
import vn.phamtra.jobhunter.domain.dto.Meta;
import vn.phamtra.jobhunter.domain.dto.ResultPaginationDTO;
import vn.phamtra.jobhunter.repository.CompanyRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company fetchCompanyById(long id) {
        Optional<Company> companyOptional = this.companyRepository.findById(id);
        if (companyOptional.isPresent()) {
            return companyOptional.get();
        }
        return null;
    }


    public Company handleCreateCompany(Company company) {
        return this.companyRepository.save(company);
    }

    public ResultPaginationDTO fetchAllCompany(Specification<Company> spec, Pageable pageable) {

        Page<Company> pageCompany = this.companyRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        //set các hiển thị
        mt.setPage(pageCompany.getNumber() + 1); //số trang
        mt.setPageSize(pageCompany.getSize()); //số phần tử

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
            currentCompany.setLogo(reqCompany.getLogo());

            //updayte
            currentCompany = this.companyRepository.save(currentCompany);
        }

        return currentCompany;
    }

    public void handleDeleteCompany(long id) {
        this.companyRepository.deleteById(id);
    }
}

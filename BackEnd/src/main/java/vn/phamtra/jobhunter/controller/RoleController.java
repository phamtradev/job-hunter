package vn.phamtra.jobhunter.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.phamtra.jobhunter.domain.Role;
import vn.phamtra.jobhunter.domain.response.ResultPaginationDTO;
import vn.phamtra.jobhunter.service.RoleService;
import vn.phamtra.jobhunter.util.annotation.ApiMessage;
import vn.phamtra.jobhunter.util.error.IdInvalidException;

@Controller
@RequestMapping("/api/v1")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/roles")
    @ApiMessage("create a role")
    public ResponseEntity<Role> createPermission(@Valid @RequestBody Role role) throws IdInvalidException {
        if (this.roleService.existByName(role.getName())) {
            throw new IdInvalidException(
                    "Role voi name " + role.getName() + " da ton tai");
        }
        Role createdRole = this.roleService.handleCreateRole(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
    }

    @PutMapping("/roles")
    @ApiMessage("update a role")
    public ResponseEntity<Role> updateRole(@Valid @RequestBody Role role) throws IdInvalidException {
        //check exist by id
        if (this.roleService.fetchById(role.getId()) == null) {
            throw new IdInvalidException("Role với id: " + role.getId() + " không tồn tại");
        }

        //check name
//        if (this.roleService.existByName(role.getName())) {
//            throw new IdInvalidException("Role voi name " + role.getName() + " khong ton tai");
//        }

        //update permission
        return ResponseEntity.ok().body(this.roleService.updateRole(role));
    }

    @DeleteMapping("/roles/{id}")
    @ApiMessage("Delete a role")
    public ResponseEntity<Void> deleteRole(@PathVariable("id") long id) throws IdInvalidException {
        //check id
        if (this.roleService.fetchById(id) == null) {
            throw new IdInvalidException("Role với id: " + id + " không tồn tại");
        }
        this.roleService.deleteRole(id);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/roles")
    @ApiMessage("Fetch all roles")
    public ResponseEntity<ResultPaginationDTO> getPermissions(@Filter Specification<Role> spec, Pageable pageable) {
        return ResponseEntity.ok(this.roleService.fetchAllRoles(spec, pageable));
    }

    @GetMapping("/roles/{id}")
    @ApiMessage("fetch role by id")
    public ResponseEntity<Role> fetchRoleById(@PathVariable("id") long id) throws IdInvalidException {
        //check id
        Role role = this.roleService.fetchById(id);
        if (role == null) {
            throw new IdInvalidException("Role với id: " + id + " không tồn tại");
        }
        return ResponseEntity.ok().body(null);
    }
}

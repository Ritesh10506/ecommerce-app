package com.hcl.e_comerce.repository;

import com.hcl.e_comerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
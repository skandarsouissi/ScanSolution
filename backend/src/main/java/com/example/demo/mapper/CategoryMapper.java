package com.example.demo.mapper;



import com.example.demo.dto.CategoryDTO;
import com.example.demo.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    CategoryDTO toDto(Category category);
    Category toEntity(CategoryDTO categoryDTO);
}
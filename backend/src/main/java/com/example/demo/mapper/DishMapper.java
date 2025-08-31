package com.example.demo.mapper;


import com.example.demo.dto.DishDTO;
import com.example.demo.model.Dish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(uses = CategoryMapper.class)
public interface DishMapper {
    DishMapper INSTANCE = Mappers.getMapper(DishMapper.class);

    @Mapping(source = "category.id", target = "categoryId")
    DishDTO toDto(Dish dish);

    @Mapping(target = "category", ignore = true)
    Dish toEntity(DishDTO dishDTO);
}
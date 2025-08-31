package com.example.demo.mapper;


import com.example.demo.dto.TableDTO;
import com.example.demo.model.RestaurantTable;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TableMapper {
    TableMapper INSTANCE = Mappers.getMapper(TableMapper.class);

    TableDTO toDto(RestaurantTable table);
    RestaurantTable toEntity(TableDTO tableDTO);
}
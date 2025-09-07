package com.example.demo.mapper;

import com.example.demo.dto.TableDTO;
import com.example.demo.model.RestaurantTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TableMapper {
    TableMapper INSTANCE = Mappers.getMapper(TableMapper.class);

    // Mapper de l'entité vers le DTO
    @Mapping(source = "qrCodeBase64", target = "qrBase64")
    TableDTO toDto(RestaurantTable table);

    // Mapper du DTO vers l'entité
    @Mapping(source = "qrBase64", target = "qrCodeBase64")
    RestaurantTable toEntity(TableDTO tableDTO);
}

package com.example.demo.service;



import com.example.demo.dto.TableDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.TableMapper;
import com.example.demo.model.RestaurantTable;
import com.example.demo.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableService {
    private final TableRepository tableRepository;

    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public List<TableDTO> getAllTables() {
        return tableRepository.findAll().stream()
                .map(TableMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    public TableDTO getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        return TableMapper.INSTANCE.toDto(table);
    }

    public TableDTO createTable(TableDTO tableDTO) {
        if (tableRepository.existsByCode(tableDTO.getCode())) {
            throw new RuntimeException("Table code already exists");
        }

        RestaurantTable table = TableMapper.INSTANCE.toEntity(tableDTO);
        RestaurantTable savedTable = tableRepository.save(table);
        return TableMapper.INSTANCE.toDto(savedTable);
    }

    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Table not found with id: " + id);
        }
        tableRepository.deleteById(id);
    }
}
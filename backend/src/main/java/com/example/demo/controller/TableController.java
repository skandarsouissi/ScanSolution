package com.example.demo.controller;

import com.example.demo.dto.TableDTO;
import com.example.demo.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = "http://localhost:4200",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<List<TableDTO>> getAllTables() {
        List<TableDTO> tables = tableService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableDTO> getTableById(@PathVariable Long id) {
        TableDTO table = tableService.getTableById(id);
        return ResponseEntity.ok(table);
    }

    // Création d'une table avec génération automatique du QR code
    @PostMapping
    public ResponseEntity<TableDTO> createTable(@RequestBody TableDTO tableDTO) {

        String clientBaseUrl = "http://192.168.0.26:4200/products";

        TableDTO createdTable = tableService.createTableWithQRCode(tableDTO, clientBaseUrl);
        return ResponseEntity.ok(createdTable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}

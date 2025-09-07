package com.example.demo.service;

import com.example.demo.dto.TableDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.TableMapper;
import com.example.demo.model.RestaurantTable;
import com.example.demo.repository.TableRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableService {

    private final TableRepository tableRepository;
    private final QRCodeService qrCodeService;

    public TableService(TableRepository tableRepository, QRCodeService qrCodeService) {
        this.tableRepository = tableRepository;
        this.qrCodeService = qrCodeService;

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
    public String generateQRCodeBase64(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            var bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            return Base64.getEncoder().encodeToString(pngData);
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Erreur lors de la génération du QR Code", e);
        }
    }

    // Création d'une table avec génération automatique du QR code
    public TableDTO createTableWithQRCode(TableDTO tableDTO, String clientBaseUrl) {
        if (tableDTO.getCode() == null || tableDTO.getCode().isEmpty()) {
            throw new IllegalArgumentException("Le code de la table est obligatoire !");
        }

        // Générer le QR code URL
        String qrUrl = generateQRCodeUrl(clientBaseUrl, tableDTO.getCode());
        tableDTO.setQrUrl(qrUrl);

        // Générer QR code en Base64
        String qrBase64 = generateQRCodeBase64(qrUrl, 200, 200);
        tableDTO.setQrBase64(qrBase64);

        // Convertir DTO en entité
        RestaurantTable table = new RestaurantTable();
        table.setCode(tableDTO.getCode());
        table.setQrUrl(qrUrl);
        table.setQrCodeBase64(qrBase64); // <-- Stockage dans la DB

        // Sauvegarder en base
        tableRepository.save(table);

        return tableDTO;
    }


    private String generateQRCodeUrl(String baseUrl, String tableCode) {
        // Exemple simple : URL pour accéder au menu de la table
        return baseUrl + "?table=" + tableCode;
    }


    // Ancienne méthode pour créer une table sans QR code
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

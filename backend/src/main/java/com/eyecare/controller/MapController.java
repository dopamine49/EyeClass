package com.eyecare.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/maps")
public class MapController {

    @GetMapping("/branches")
    public ResponseEntity<List<Map<String, Object>>> getBranches() {
        List<Map<String, Object>> branches = List.of(
            Map.of("name", "Eyecare Quận 1", "address", "123 Nguyễn Huệ, Q1, TP.HCM", "lat", 10.7769, "lng", 106.7009),
            Map.of("name", "Eyecare Thủ Đức", "address", "45 Võ Văn Ngân, Thủ Đức, TP.HCM", "lat", 10.8506, "lng", 106.7717),
            Map.of("name", "Eyecare Hà Nội", "address", "89 Trần Duy Hưng, Cầu Giấy, Hà Nội", "lat", 21.0103, "lng", 105.8001)
        );
        return ResponseEntity.ok(branches);
    }
}

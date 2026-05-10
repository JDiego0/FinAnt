package com.finant.controller;

import com.finant.dto.request.NoteRequest;
import com.finant.dto.response.NoteResponse;
import com.finant.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                noteService.getNotesByUser(userDetails.getUsername())
        );
    }

    @PostMapping
    public ResponseEntity<NoteResponse> create(
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                noteService.createNote(request, userDetails.getUsername())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                noteService.updateNote(id, request, userDetails.getUsername())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        noteService.deleteNote(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
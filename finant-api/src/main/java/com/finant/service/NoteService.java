package com.finant.service;

import com.finant.dto.request.NoteRequest;
import com.finant.dto.response.NoteResponse;
import com.finant.entity.Note;
import com.finant.entity.User;
import com.finant.repository.NoteRepository;
import com.finant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public List<NoteResponse> getNotesByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return noteRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public NoteResponse createNote(NoteRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Note note = Note.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        noteRepository.save(note);
        return toResponse(note);
    }

    @Transactional
    public NoteResponse updateNote(Long noteId, NoteRequest request, String email) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada"));

        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("No autorizado");
        }

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        noteRepository.save(note);
        return toResponse(note);
    }

    @Transactional
    public void deleteNote(Long noteId, String email) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada"));

        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("No autorizado");
        }

        noteRepository.delete(note);
    }

    private NoteResponse toResponse(Note note) {
        NoteResponse response = new NoteResponse();
        response.setId(note.getId());
        response.setTitle(note.getTitle());
        response.setContent(note.getContent());
        response.setCreatedAt(note.getCreatedAt());
        return response;
    }
}
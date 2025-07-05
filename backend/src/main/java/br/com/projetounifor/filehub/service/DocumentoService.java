package br.com.projetounifor.filehub.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.projetounifor.filehub.domain.model.Documento;
import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.model.enums.StatusDocumento;
import br.com.projetounifor.filehub.domain.repository.DocumentoRepository;
import br.com.projetounifor.filehub.domain.repository.ProjetoRepository;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import br.com.projetounifor.filehub.dto.DocumentoDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentoService {
    private final DocumentoRepository documentoRepository;
    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    private final S3Service s3Service;

    public DocumentoDTO submeterDocumento(Long projetoId, Long usuarioId, MultipartFile file) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Criar diretório se não existir
        String uploadDir = System.getProperty("user.dir") + "/uploads";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs(); // Cria diretório e subdiretórios
        }

        String bucketName = "filehub-document-bucket";
        String keyName = UUID.randomUUID() + file.getOriginalFilename();

        try {
            s3Service.uploadFile(bucketName, keyName, file);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }

        Documento doc = new Documento();
        doc.setNomeArquivo(file.getOriginalFilename());
        doc.setCaminhoArquivo(keyName);
        doc.setStatus(StatusDocumento.PENDENTE);
        doc.setProjeto(projeto);
        doc.setCriadoPor(usuario);
        doc.setCriadoEm(LocalDateTime.now());
        doc.setVersao(1);

        return toDTO(documentoRepository.save(doc));
    }

    public Documento aprovar(Long documentoId, Long aprovadorId) {
        Documento doc = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));

        Usuario aprovador = usuarioRepository.findById(aprovadorId)
                .orElseThrow(() -> new RuntimeException("Aprovador não encontrado"));

        doc.setStatus(StatusDocumento.APROVADO);
        doc.setAprovadoPor(aprovador);
        doc.setAprovadoEm(LocalDateTime.now());
        return documentoRepository.save(doc);
    }
    
    public List<DocumentoDTO> consultarPorProjeto(Long projetoId) {
        List<Documento> documentos = documentoRepository.findByProjetoId(projetoId);
        return documentos.stream()
            .map(this::toDTO)
            .filter(Objects::nonNull) // Possível filtro que remove null
            .collect(Collectors.toList());
    }

    public Documento novaVersao(Long documentoOriginalId, Long usuarioId, MultipartFile novaVersaoFile) {
        Documento anterior = documentoRepository.findById(documentoOriginalId)
                .orElseThrow(() -> new RuntimeException("Documento original não encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Documento novaVersao = new Documento();
        novaVersao.setNomeArquivo(novaVersaoFile.getOriginalFilename());
        novaVersao.setCaminhoArquivo("/uploads/" + novaVersaoFile.getOriginalFilename());
        novaVersao.setProjeto(anterior.getProjeto());
        novaVersao.setCriadoPor(usuario);
        novaVersao.setCriadoEm(LocalDateTime.now());
        novaVersao.setVersao(anterior.getVersao() + 1);
        novaVersao.setStatus(StatusDocumento.PENDENTE);

        return documentoRepository.save(novaVersao);
    }

    public DocumentoDTO toDTO(Documento doc) {
        DocumentoDTO dto = new DocumentoDTO();
        dto.setId(doc.getId());
        dto.setNomeArquivo(doc.getNomeArquivo());
        dto.setCaminhoArquivo(doc.getCaminhoArquivo());
        dto.setVersao(doc.getVersao());
        dto.setStatus(doc.getStatus());

        if (doc.getProjeto() != null)
            dto.setProjetoId(doc.getProjeto().getId());
        if (doc.getCriadoPor() != null)
            dto.setCriadoPorId(doc.getCriadoPor().getId());
        if (doc.getAprovadoPor() != null)
            dto.setAprovadoPorId(doc.getAprovadoPor().getId());

        dto.setCriadoEm(doc.getCriadoEm());
        dto.setAprovadoEm(doc.getAprovadoEm());

        return dto;
    }

    public Documento getDocumento(Long documentoId) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));

        return documento;
    }
}

package br.com.projetounifor.filehub.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
public class S3Service {

  private final S3Client s3Client;

  public S3Service(S3Client s3Client) {
    this.s3Client = s3Client;
  }

  public void uploadFile(String bucketName, String keyName, MultipartFile file) throws IOException {
    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
        .bucket(bucketName)
        .key(keyName)
        .contentType(file.getContentType())
        .build();

    s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
  }

  public ResponseInputStream<GetObjectResponse> downloadFile(String bucket, String key) {
    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
        .bucket(bucket)
        .key(key)
        .build();

    return s3Client.getObject(getObjectRequest);
  }
}

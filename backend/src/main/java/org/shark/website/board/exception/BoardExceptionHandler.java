package org.shark.website.board.exception;

import org.shark.website.board.dto.response.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BoardExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ResponseDTO<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
    ResponseDTO<Void> response = ResponseDTO.<Void>builder()
        .status(HttpStatus.NOT_FOUND.value())  // 404
        .message(e.getMessage())  // BoardController에서 발생한 예외 메시지(실제 발생은 BoardServiceImpl에서 발생)
        .build();
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }
  
}

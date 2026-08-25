package org.shark.website.auth.service;

import org.shark.website.auth.dto.request.LoginRequestDTO;
import org.shark.website.auth.dto.request.RegisterRequestDTO;
import org.shark.website.auth.dto.response.JwtTokenResponseDTO;

public interface AuthenticationService {
  JwtTokenResponseDTO register(RegisterRequestDTO request);
  JwtTokenResponseDTO login(LoginRequestDTO request);
}

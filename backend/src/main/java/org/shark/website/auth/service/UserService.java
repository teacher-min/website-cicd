package org.shark.website.auth.service;

import org.shark.website.auth.entity.User;

public interface UserService {
  User findByEmail(String email);
  User getCurrentUser();
}

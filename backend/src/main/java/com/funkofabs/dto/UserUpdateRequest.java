package com.funkofabs.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String photoUrl;
}

package com.saurav.expensesplitter.service;

import com.saurav.expensesplitter.dto.request.LoginRequest;
import com.saurav.expensesplitter.dto.request.RegisterRequest;
import com.saurav.expensesplitter.dto.response.AuthResponse;
import com.saurav.expensesplitter.dto.response.UserResponse;
import com.saurav.expensesplitter.exception.EmailAlreadyExistsException;
import com.saurav.expensesplitter.exception.ResourceNotFoundException;
import com.saurav.expensesplitter.model.User;
import com.saurav.expensesplitter.repository.UserRepository;
import com.saurav.expensesplitter.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by Email"+ email));

        return new org.springframework.security.core.userdetails.User(user.getEmail(),
                user.getPassword(),
                new ArrayList<>());


    }

    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email already exists" +request.getEmail());
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, "Bearer");
    }

    public AuthResponse login(LoginRequest request) {
        UserDetails userDetails = loadUserByUsername(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token, "Bearer");
    }

    public UserResponse getUserById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("User not found with id"+id));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }

}
